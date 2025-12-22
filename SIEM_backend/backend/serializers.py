# backend/serializers.py
from rest_framework import serializers
from .models import Utilisateur, Categorie, Article, Vulnerabilite


# ============================================
# SERIALIZERS UTILISATEUR & AUTHENTIFICATION
# ============================================

class UtilisateurSerializer(serializers.ModelSerializer):
    """Serializer pour l'inscription d'un nouvel utilisateur"""
    password = serializers.CharField(
        write_only=True, 
        min_length=8,
        style={'input_type': 'password'},
        help_text="Minimum 8 caractères"
    )
    confirm_password = serializers.CharField(
        write_only=True,
        style={'input_type': 'password'}
    )
    
    class Meta:
        model = Utilisateur
        fields = [
            'id_utilisateur',
            'nom_utilisateur',
            'email_utilisateur',
            'password',
            'confirm_password',
            'role_utilisateur',
            'date_creation'
        ]
        read_only_fields = ['id_utilisateur', 'date_creation', 'role_utilisateur']
    
    def validate(self, data):
        """Validation personnalisée"""
        # Vérifier que les mots de passe correspondent
        if data.get('password') != data.get('confirm_password'):
            raise serializers.ValidationError({
                'confirm_password': 'Les mots de passe ne correspondent pas'
            })
        
        # Vérifier que le nom d'utilisateur n'existe pas
        if Utilisateur.objects.filter(nom_utilisateur=data.get('nom_utilisateur')).exists():
            raise serializers.ValidationError({
                'nom_utilisateur': 'Ce nom d\'utilisateur existe déjà'
            })
        
        # Vérifier que l'email n'existe pas
        if Utilisateur.objects.filter(email_utilisateur=data.get('email_utilisateur')).exists():
            raise serializers.ValidationError({
                'email_utilisateur': 'Cet email est déjà utilisé'
            })
        
        return data
    
    def create(self, validated_data):
        """Créer un nouvel utilisateur avec mot de passe hashé"""
        # Retirer confirm_password
        validated_data.pop('confirm_password', None)
        
        # Extraire le mot de passe
        password = validated_data.pop('password')
        
        # Utiliser le manager pour créer l'utilisateur
        utilisateur = Utilisateur.objects.create_user(
            email_utilisateur=validated_data['email_utilisateur'],
            nom_utilisateur=validated_data['nom_utilisateur'],
            password=password,
            role_utilisateur=validated_data.get('role_utilisateur', 'utilisateur')
        )
        
        return utilisateur


class UtilisateurLoginSerializer(serializers.Serializer):
    """Serializer pour la connexion"""
    email_utilisateur = serializers.EmailField()
    password = serializers.CharField(
        write_only=True,
        style={'input_type': 'password'}
    )
    
    def validate(self, data):
        """Vérifier les credentials"""
        email_utilisateur = data.get('email_utilisateur')
        password = data.get('password')
        
        if not email_utilisateur or not password:
            raise serializers.ValidationError(
                'L\'email et le mot de passe sont requis'
            )
        
        try:
            utilisateur = Utilisateur.objects.get(email_utilisateur=email_utilisateur)
        except Utilisateur.DoesNotExist:
            raise serializers.ValidationError(
                'Email ou mot de passe incorrect'
            )
        
        if not utilisateur.check_password(password):
            raise serializers.ValidationError(
                'Email ou mot de passe incorrect'
            )
        
        if not utilisateur.is_active:
            raise serializers.ValidationError(
                'Ce compte est désactivé'
            )
        
        data['utilisateur'] = utilisateur
        return data


class UtilisateurProfileSerializer(serializers.ModelSerializer):
    """Serializer pour le profil utilisateur (sans mot de passe)"""
    nb_categories_suivies = serializers.SerializerMethodField()
    
    class Meta:
        model = Utilisateur
        fields = [
            'id_utilisateur',
            'nom_utilisateur',
            'email_utilisateur',
            'role_utilisateur',
            'date_creation',
            'is_active',
            'last_login',
            'nb_categories_suivies'
        ]
        read_only_fields = ['id_utilisateur', 'date_creation', 'role_utilisateur', 'last_login']
    
    def get_nb_categories_suivies(self, obj):
        """Retourne le nombre de catégories suivies"""
        return obj.categories_suivies.count()


# ============================================
# SERIALIZERS CATÉGORIE
# ============================================

class CategorieSerializer(serializers.ModelSerializer):
    """Serializer pour les catégories"""
    nb_articles = serializers.SerializerMethodField()
    nb_abonnes = serializers.SerializerMethodField()
    is_followed = serializers.SerializerMethodField()
    
    class Meta:
        model = Categorie
        fields = [
            'id_categorie',
            'nom_categorie',
            'description_categorie',
            'date_creation',
            'nb_articles',
            'nb_abonnes',
            'is_followed'
        ]
        read_only_fields = ['id_categorie', 'date_creation']
    
    def get_nb_articles(self, obj):
        """Nombre d'articles dans cette catégorie"""
        return obj.articles.count()
    
    def get_nb_abonnes(self, obj):
        """Nombre d'utilisateurs abonnés"""
        return obj.utilisateurs_suivants.count()
    
    def get_is_followed(self, obj):
        """Vérifie si l'utilisateur connecté suit cette catégorie"""
        request = self.context.get('request')
        if request and hasattr(request, 'user') and request.user.is_authenticated:
            return obj.utilisateurs_suivants.filter(id_utilisateur=request.user.id_utilisateur).exists()
        return False


class CategorieListSerializer(serializers.ModelSerializer):
    """Serializer simplifié pour lister les catégories"""
    nb_articles = serializers.SerializerMethodField()
    
    class Meta:
        model = Categorie
        fields = [
            'id_categorie',
            'nom_categorie',
            'nb_articles'
        ]
    
    def get_nb_articles(self, obj):
        return obj.articles.count()


# ============================================
# SERIALIZERS ARTICLE
# ============================================

class ArticleListSerializer(serializers.ModelSerializer):
    """Serializer pour lister les articles (version allégée)"""
    categories_noms = serializers.SerializerMethodField()
    
    class Meta:
        model = Article
        fields = [
            'id_article',
            'titre_article',
            'url_article',
            'description_article',
            'date_publication',
            'thumbnail',
            'categories_noms'
        ]
    
    def get_categories_noms(self, obj):
        """Retourne les noms des catégories"""
        return [cat.nom_categorie for cat in obj.categories.all()]


class ArticleDetailSerializer(serializers.ModelSerializer):
    """Serializer détaillé pour un article"""
    categories = CategorieListSerializer(many=True, read_only=True)
    
    class Meta:
        model = Article
        fields = [
            'id_article',
            'titre_article',
            'url_article',
            'description_article',
            'contenu_article',
            'summary_article',
            'date_publication',
            'thumbnail',
            'categories'
        ]


class ArticleCreateSerializer(serializers.ModelSerializer):
    """Serializer pour créer/modifier un article"""
    categories_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False
    )
    
    class Meta:
        model = Article
        fields = [
            'titre_article',
            'url_article',
            'description_article',
            'contenu_article',
            'summary_article',
            'date_publication',
            'thumbnail',
            'categories_ids'
        ]
    
    def validate_url_article(self, value):
        """Vérifier que l'URL est unique pour un nouvel article"""
        if self.instance is None:  # Création
            if Article.objects.filter(url_article=value).exists():
                raise serializers.ValidationError("Un article avec cette URL existe déjà")
        else:  # Modification
            if Article.objects.exclude(id_article=self.instance.id_article).filter(url_article=value).exists():
                raise serializers.ValidationError("Un article avec cette URL existe déjà")
        return value
    
    def create(self, validated_data):
        """Créer un article avec ses catégories"""
        categories_ids = validated_data.pop('categories_ids', [])
        
        article = Article.objects.create(**validated_data)
        
        if categories_ids:
            categories = Categorie.objects.filter(id_categorie__in=categories_ids)
            article.categories.set(categories)
        
        return article
    
    def update(self, instance, validated_data):
        """Mettre à jour un article et ses catégories"""
        categories_ids = validated_data.pop('categories_ids', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        if categories_ids is not None:
            categories = Categorie.objects.filter(id_categorie__in=categories_ids)
            instance.categories.set(categories)
        
        return instance


# ============================================
# SERIALIZERS SIMPLIFIÉS POUR LA CRÉATION D'ARTICLES
# ============================================

class ArticleCreateSimpleSerializer(serializers.Serializer):
    """Serializer simplifié pour créer un article via l'API simple"""
    titre = serializers.CharField(max_length=500)
    url = serializers.URLField(max_length=1000)
    description = serializers.CharField(required=False, allow_blank=True)
    categorie = serializers.CharField(max_length=100, default='AWS Security')
    date_publication = serializers.CharField(required=False, default='2024-01-01')
    
    def validate(self, data):
        """Validation personnalisée"""
        # Vérifier que l'URL n'existe pas déjà
        if Article.objects.filter(url_article=data.get('url')).exists():
            raise serializers.ValidationError({
                'url': 'Un article avec cette URL existe déjà'
            })
        return data
    
    def create(self, validated_data):
        """Créer un article avec la catégorie spécifiée"""
        # Récupérer ou créer la catégorie
        categorie_nom = validated_data.get('categorie', 'AWS Security')
        categorie, created = Categorie.objects.get_or_create(
            nom_categorie=categorie_nom,
            defaults={'description_categorie': f'Catégorie {categorie_nom}'}
        )
        
        # Créer l'article
        article = Article.objects.create(
            titre_article=validated_data['titre'],
            url_article=validated_data['url'],
            description_article=validated_data.get('description', ''),
            date_publication=validated_data.get('date_publication', '2024-01-01')
        )
        
        # Ajouter la catégorie
        article.categories.add(categorie)
        
        return article


# ============================================
# SERIALIZERS VULNÉRABILITÉ
# ============================================

class VulnerabiliteListSerializer(serializers.ModelSerializer):
    """Serializer pour lister les vulnérabilités"""
    
    class Meta:
        model = Vulnerabilite
        fields = [
            'id_vulnerabilite',
            'cve_id',
            'severite',
            'score_cvss',
            'type_vuln',
            'date_publication',
            'source_vuln'
        ]


class VulnerabiliteDetailSerializer(serializers.ModelSerializer):
    """Serializer détaillé pour une vulnérabilité"""
    
    class Meta:
        model = Vulnerabilite
        fields = '__all__'


class VulnerabiliteCreateSerializer(serializers.ModelSerializer):
    """Serializer pour créer/modifier une vulnérabilité"""
    
    class Meta:
        model = Vulnerabilite
        fields = [
            'cve_id',
            'severite',
            'score_cvss',
            'description_vuln',
            'date_publication',
            'source_vuln',
            'type_vuln'
        ]
    
    def validate_cve_id(self, value):
        """Vérifier l'unicité du CVE ID"""
        if self.instance is None:  # Création
            if Vulnerabilite.objects.filter(cve_id=value).exists():
                raise serializers.ValidationError(f"La vulnérabilité {value} existe déjà")
        else:  # Modification
            if Vulnerabilite.objects.exclude(id_vulnerabilite=self.instance.id_vulnerabilite).filter(cve_id=value).exists():
                raise serializers.ValidationError(f"La vulnérabilité {value} existe déjà")
        return value