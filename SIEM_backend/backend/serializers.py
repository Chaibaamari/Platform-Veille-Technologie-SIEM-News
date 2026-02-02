# backend/serializers.py
from rest_framework import serializers
from .models import Utilisateur, Categorie, Article, Vulnerabilite
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

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
    email_utilisateur = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, data):
        email = data.get('email_utilisateur')
        password = data.get('password')
        
        try:
            utilisateur = Utilisateur.objects.get(email_utilisateur=email)
            
            # Vérifier si l'utilisateur est actif
            if not utilisateur.is_active:
                raise serializers.ValidationError(
                    'Ce compte a été désactivé. Contactez un administrateur.'
                )
            
            # Vérifier le mot de passe
            if not utilisateur.check_password(password):
                raise serializers.ValidationError(
                    'Email ou mot de passe incorrect'
                )
            
            data['utilisateur'] = utilisateur
            return data
            
        except Utilisateur.DoesNotExist:
            raise serializers.ValidationError(
                'Email ou mot de passe incorrect'
            )


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
            'nb_categories_suivies'
        ]
        read_only_fields = ['id_utilisateur', 'date_creation', 'role_utilisateur', 'last_login']
    
    def get_nb_categories_suivies(self, obj):
        """Retourne le nombre de catégories suivies"""
        return obj.categories_suivies.count()


class ForgotPasswordSerializer(serializers.Serializer):
    email_utilisateur = serializers.EmailField()
    
    def validate_email_utilisateur(self, value):
        """Vérifie que l'email existe"""
        from .models import Utilisateur
        if not Utilisateur.objects.filter(email_utilisateur=value, is_active=True).exists():
            # Ne pas révéler si l'email existe ou non pour la sécurité
            # On retourne quand même True mais on n'enverra pas d'email
            pass
        return value


class ResetPasswordSerializer(serializers.Serializer):
    token = serializers.UUIDField()
    new_password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True, min_length=8)
    
    def validate(self, data):
        """Valide que les mots de passe correspondent"""
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError({
                'confirm_password': 'Les mots de passe ne correspondent pas'
            })
        
        # Valider la complexité du mot de passe
        try:
            validate_password(data['new_password'])
        except ValidationError as e:
            raise serializers.ValidationError({
                'new_password': list(e.messages)
            })
        
        return data
    

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
            'id',
            'nom_categorie',
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
            'id',
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
    source = serializers.SerializerMethodField()
    
    class Meta:
        model = Article
        fields = [
            'id_article',
            'titre_article',
            'url_article',
            'description_article',
            'date_publication',
            'thumbnail',
            'categories_noms',
            'source'
        ]
    
    def get_categories_noms(self, obj):
        """Retourne les noms des catégories"""
        return [cat.nom_categorie for cat in obj.categories.all()]
    
    def get_source(self, obj):
        return obj.source.nom_source


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

# ============================================
# SERIALIZERS VULNÉRABILITÉ
# ============================================

class VulnerabiliteListSerializer(serializers.ModelSerializer):
    """Serializer pour lister les vulnérabilités"""
    types_vuln = serializers.SerializerMethodField()
    
    class Meta:
        model = Vulnerabilite
        fields = [
            'cve_id',
            'severite',
            'score_cvss',
            'types_vuln',
            'date_publication',
            'description_vuln'
        ]


    def get_types_vuln(self, obj):
        return [{
            'type_vul': type_vuln.type_vul,
            'cwe_id': type_vuln.cwe_id
        } for type_vuln in obj.types_vuln.all()]


class VulnerabiliteDetailSerializer(serializers.ModelSerializer):
    """Serializer détaillé pour une vulnérabilité"""
    types_vuln = serializers.SerializerMethodField()
    
    class Meta:
        model = Vulnerabilite
        fields = '__all__'

    def get_types_vuln(self, obj):
        return [{
            'type_vul': type_vuln.type_vul,
            'cwe_id': type_vuln.cwe_id
        } for type_vuln in obj.types_vuln.all()]