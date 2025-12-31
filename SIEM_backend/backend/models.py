from django.db import models
from django.core.validators import URLValidator
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

# =======================
# MANAGER PERSONNALISÉ
# =======================
class UtilisateurManager(BaseUserManager):
    def create_user(self, email_utilisateur, nom_utilisateur, password=None, **extra_fields):
        if not email_utilisateur:
            raise ValueError('L\'email est obligatoire')
        if not nom_utilisateur:
            raise ValueError('Le nom d\'utilisateur est obligatoire')
        
        email_utilisateur = self.normalize_email(email_utilisateur)
        utilisateur = self.model(
            email_utilisateur=email_utilisateur,
            nom_utilisateur=nom_utilisateur,
            **extra_fields
        )
        
        if password:
            utilisateur.set_password(password)
        utilisateur.save(using=self._db)
        return utilisateur
    
    def create_superuser(self, email_utilisateur, nom_utilisateur, password=None, **extra_fields):
        extra_fields.setdefault('role_utilisateur', 'admin')
        extra_fields.setdefault('is_active', True)
        
        return self.create_user(
            email_utilisateur=email_utilisateur,
            nom_utilisateur=nom_utilisateur,
            password=password,
            **extra_fields
        )

# =======================
# MODÈLE UTILISATEUR
# =======================
class Utilisateur(AbstractBaseUser):
    ROLE_CHOICES = [
        ('admin', 'Administrateur'),
        ('utilisateur', 'Utilisateur'),
    ]
    
    id_utilisateur = models.AutoField(primary_key=True)
    nom_utilisateur = models.CharField(max_length=150, unique=True)
    email_utilisateur = models.EmailField(unique=True)
    role_utilisateur = models.CharField(max_length=20, choices=ROLE_CHOICES, default='utilisateur')
    date_creation = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    last_login = models.DateTimeField(null=True, blank=True)
    
    # Gestionnaire personnalisé
    objects = UtilisateurManager()
    
    # Définir le champ utilisé pour l'authentification
    USERNAME_FIELD = 'email_utilisateur'
    REQUIRED_FIELDS = ['nom_utilisateur']
    
    # Relation UTILISATEUR (0,n) — suit — (0,n) CATÉGORIE
    categories_suivies = models.ManyToManyField(
        'Categorie',
        related_name='utilisateurs_suivants',
        blank=True
    )
    
    class Meta:
        db_table = 'utilisateur'
    
    def __str__(self):
        return self.nom_utilisateur
    
    def set_password(self, raw_password):
        """Hash le mot de passe"""
        self.password = make_password(raw_password)
    
    def check_password(self, raw_password):
        """Vérifie le mot de passe"""
        return check_password(raw_password, self.password)
    
    # Méthodes nécessaires
    @property
    def is_staff(self):
        return self.role_utilisateur == 'admin'
    
    @property
    def is_superuser(self):
        return self.role_utilisateur == 'admin'
    
    def has_perm(self, perm, obj=None):
        return self.role_utilisateur == 'admin'
    
    def has_module_perms(self, app_label):
        return self.role_utilisateur == 'admin'
    
    def get_username(self):
        return self.nom_utilisateur


# =======================
# MODÈLE CATÉGORIE
# =======================
class Categorie(models.Model):
    id_categorie = models.AutoField(primary_key=True)
    nom_categorie = models.CharField(max_length=100, unique=True)
    description_categorie = models.TextField(blank=True)
    date_creation = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'categorie'
    
    def __str__(self):
        return self.nom_categorie


# =======================
# MODÈLE ARTICLE
# =======================
class Article(models.Model):
    # need to add author and source columns
    id_article = models.AutoField(primary_key=True)
    titre_article = models.CharField(max_length=500)
    url_article = models.URLField(max_length=1000, unique=True, validators=[URLValidator()])
    description_article = models.TextField(blank=True)
    contenu_article = models.TextField(blank=True)
    summary_article = models.TextField(blank=True)
    date_publication = models.DateField()

    # problem: photos should be uploaded in a folder path, then shown from that path
    thumbnail = models.URLField(max_length=500, blank=True, null=True)
    
    # Relation ARTICLE (0,n) — appartient — (0,n) CATÉGORIE
    categories = models.ManyToManyField(
        Categorie,
        related_name='articles',
        blank=True
    )
    
    class Meta:
        db_table = 'article'
        ordering = ['-date_publication']
    
    def __str__(self):
        return f"{self.titre_article[:50]}..."


# =======================
# MODÈLE VULNÉRABILITÉ
# =======================
class Vulnerabilite(models.Model):
    SEVERITY_CHOICES = [
        ('low', 'Faible'),
        ('medium', 'Moyenne'),
        ('high', 'Élevée'),
        ('critical', 'Critique'),
    ]
    
    id_vulnerabilite = models.AutoField(primary_key=True)
    cve_id = models.CharField(max_length=50, unique=True)
    severite = models.CharField(max_length=20, choices=SEVERITY_CHOICES)
    score_cvss = models.DecimalField(max_digits=3, decimal_places=1, null=True, blank=True)
    description_vuln = models.TextField()
    date_publication = models.DateField()
    source_vuln = models.CharField(max_length=100)
    type_vuln = models.CharField(max_length=100)
    
    class Meta:
        db_table = 'vulnerabilite'
        ordering = ['-date_publication']
    
    def __str__(self):
        return self.cve_id