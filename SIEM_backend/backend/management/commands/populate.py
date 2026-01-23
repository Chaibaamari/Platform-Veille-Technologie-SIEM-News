# backend/management/commands/populate_data.py
from django.core.management.base import BaseCommand
from backend.models import Utilisateur, Categorie, Article, Vulnerabilite
from datetime import date, timedelta
from decimal import Decimal

class Command(BaseCommand):
    help = 'Remplit la base de données avec des données de test CIEM'

    def add_arguments(self, parser):
        parser.add_argument(
            '--reset',
            action='store_true',
            help='Supprime toutes les données avant de créer',
        )

    def handle(self, *args, **options):
        if options['reset']:
            self.stdout.write(self.style.WARNING('⚠️  Suppression de toutes les données...'))
            Article.objects.all().delete()
            Vulnerabilite.objects.all().delete()
            Categorie.objects.all().delete()
            Utilisateur.objects.filter(role_utilisateur='utilisateur').delete()
            self.stdout.write(self.style.SUCCESS('✅ Données supprimées'))
        
        self.stdout.write(self.style.HTTP_INFO('🚀 Début de la population de la base de données...'))
        
        # Créer les utilisateurs
        self.create_users()
        
        # Créer les catégories
        categories = self.create_categories()
        
        # Créer les articles
        self.create_articles(categories)
        
        # Créer les vulnérabilités
        self.create_vulnerabilities()
        
        # Afficher le résumé
        self.display_summary()
        
        self.stdout.write(self.style.SUCCESS('\n✅ Population terminée avec succès !'))

    def create_users(self):
        self.stdout.write('\n👥 Création des utilisateurs...')
        
        # Admin - vérifier par nom_utilisateur OU email
        try:
            admin = Utilisateur.objects.filter(
                nom_utilisateur='admin'
            ).first() or Utilisateur.objects.filter(
                email_utilisateur='admin@ciem-veille.dz'
            ).first()
            
            if admin:
                self.stdout.write('  ℹ️  Admin existe déjà')
            else:
                admin = Utilisateur.objects.create_user(
                    email_utilisateur='admin@ciem-veille.dz',
                    nom_utilisateur='admin',
                    password='admin123',
                    role_utilisateur='admin'
                )
                self.stdout.write(self.style.SUCCESS('  ✅ Admin créé : admin@ciem-veille.dz / admin123'))
        except Exception as e:
            self.stdout.write(self.style.WARNING(f'  ⚠️  Admin : {str(e)}'))
        
        # User 1
        try:
            user1 = Utilisateur.objects.filter(
                nom_utilisateur='user01'
            ).first() or Utilisateur.objects.filter(
                email_utilisateur='user1@ciem-veille.dz'
            ).first()
            
            if user1:
                self.stdout.write('  ℹ️  User1 existe déjà')
            else:
                user1 = Utilisateur.objects.create_user(
                    email_utilisateur='user1@ciem-veille.dz',
                    nom_utilisateur='user01',
                    password='user123',
                    role_utilisateur='utilisateur'
                )
                self.stdout.write(self.style.SUCCESS('  ✅ User1 créé : user1@ciem-veille.dz / user123'))
        except Exception as e:
            self.stdout.write(self.style.WARNING(f'  ⚠️  User1 : {str(e)}'))
        
        # User 2
        try:
            user2 = Utilisateur.objects.filter(
                nom_utilisateur='user02'
            ).first() or Utilisateur.objects.filter(
                email_utilisateur='user2@ciem-veille.dz'
            ).first()
            
            if user2:
                self.stdout.write('  ℹ️  User2 existe déjà')
            else:
                user2 = Utilisateur.objects.create_user(
                    email_utilisateur='user2@ciem-veille.dz',
                    nom_utilisateur='user02',
                    password='user123',
                    role_utilisateur='utilisateur'
                )
                self.stdout.write(self.style.SUCCESS('  ✅ User2 créé : user2@ciem-veille.dz / user123'))
        except Exception as e:
            self.stdout.write(self.style.WARNING(f'  ⚠️  User2 : {str(e)}'))

    def create_categories(self):
        self.stdout.write('\n📁 Création des catégories...')
        
        categories_data = [
            ('AWS Security', 'Articles sur la sécurité AWS et IAM'),
            ('Azure Security', 'Sécurité Azure et RBAC'),
            ('GCP Security', 'Google Cloud Platform Security'),
            ('CIEM Solutions', 'Solutions CIEM du marché'),
            ('Cloud Best Practices', 'Bonnes pratiques cloud'),
            ('Zero Trust', 'Architecture Zero Trust'),
        ]
        
        categories = {}
        for nom, description in categories_data:
            cat, created = Categorie.objects.get_or_create(
                nom_categorie=nom,
                defaults={'description_categorie': description}
            )
            categories[nom] = cat
            status = '✅ créée' if created else 'ℹ️  existe'
            self.stdout.write(f'  {status} : {nom}')
        
        return categories

    def create_articles(self, categories):
        self.stdout.write('\n📰 Création des articles...')
        
        articles_data = [
            {
                'titre': 'AWS IAM Best Practices for 2024',
                'url': 'https://aws.amazon.com/blogs/security/iam-best-practices-2024',
                'description': 'Guide complet des meilleures pratiques IAM pour sécuriser votre environnement AWS',
                'contenu': 'Cet article détaille les bonnes pratiques pour gérer les permissions IAM sur AWS...',
                'summary': 'Guide des best practices IAM AWS 2024',
                'categories': ['AWS Security', 'Cloud Best Practices'],
                'days_ago': 2,
            },
            {
                'titre': 'Critical Azure AD Privilege Escalation Vulnerability',
                'url': 'https://msrc.microsoft.com/update-guide/vulnerability/CVE-2024-1234',
                'description': 'Nouvelle vulnérabilité permettant l\'élévation de privilèges dans Azure AD',
                'contenu': 'Une vulnérabilité critique a été découverte dans Azure AD...',
                'summary': 'Vulnérabilité critique Azure AD',
                'categories': ['Azure Security'],
                'days_ago': 1,
            },
            {
                'titre': 'GCP IAM Conditional Access Deep Dive',
                'url': 'https://cloud.google.com/blog/products/identity-security/gcp-iam-conditional',
                'description': 'Analyse approfondie des accès conditionnels dans GCP IAM',
                'contenu': 'Les accès conditionnels permettent de définir des règles granulaires...',
                'summary': 'Accès conditionnels GCP IAM',
                'categories': ['GCP Security', 'Cloud Best Practices'],
                'days_ago': 5,
            },
            {
                'titre': 'Top 5 CIEM Tools Comparison 2024',
                'url': 'https://cloudsecurity.io/ciem-tools-comparison',
                'description': 'Comparatif des principales solutions CIEM : Ermetic, Wiz, Orca Security',
                'contenu': 'Comparaison détaillée des outils CIEM leaders du marché...',
                'summary': 'Comparatif CIEM 2024',
                'categories': ['CIEM Solutions'],
                'days_ago': 7,
            },
            {
                'titre': 'Implementing Least Privilege in Multi-Cloud',
                'url': 'https://cloudsec.io/least-privilege-multi-cloud',
                'description': 'Guide pratique pour implémenter le principe du moindre privilège',
                'contenu': 'Le principe du moindre privilège est essentiel pour la sécurité cloud...',
                'summary': 'Least Privilege Multi-Cloud',
                'categories': ['Cloud Best Practices'],
                'days_ago': 10,
            },
            {
                'titre': 'Zero Trust Architecture for Cloud Workloads',
                'url': 'https://zerotrust.io/cloud-workloads',
                'description': 'Implémentation de Zero Trust pour les charges de travail cloud',
                'contenu': 'Zero Trust est un modèle de sécurité qui ne fait confiance à personne...',
                'summary': 'Zero Trust Cloud',
                'categories': ['Zero Trust', 'Cloud Best Practices'],
                'days_ago': 3,
            },
            {
                'titre': 'AWS S3 Bucket Policy Security Review',
                'url': 'https://aws.amazon.com/blogs/security/s3-policy-review',
                'description': 'Comment auditer et sécuriser vos politiques S3',
                'contenu': 'Les buckets S3 mal configurés sont une source majeure de fuites de données...',
                'summary': 'Audit S3 Policies',
                'categories': ['AWS Security'],
                'days_ago': 4,
            },
            {
                'titre': 'Azure RBAC vs Custom Roles: When to Use What',
                'url': 'https://docs.microsoft.com/azure/rbac-custom-roles',
                'description': 'Comprendre quand utiliser les rôles intégrés vs personnalisés',
                'contenu': 'Azure propose des rôles intégrés mais parfois des rôles personnalisés sont nécessaires...',
                'summary': 'RBAC vs Custom Roles',
                'categories': ['Azure Security'],
                'days_ago': 6,
            },
        ]
        
        for data in articles_data:
            article, created = Article.objects.get_or_create(
                url_article=data['url'],
                defaults={
                    'titre_article': data['titre'],
                    'description_article': data['description'],
                    'contenu_article': data['contenu'],
                    'summary_article': data['summary'],
                    'date_publication': date.today() - timedelta(days=data['days_ago']),
                    'thumbnail': f'https://via.placeholder.com/300x200?text={data["titre"][:20]}'
                }
            )
            
            if created:
                # Ajouter les catégories
                for cat_name in data['categories']:
                    if cat_name in categories:
                        article.categories.add(categories[cat_name])
                
                self.stdout.write(f'  ✅ créé : {data["titre"][:50]}...')
            else:
                self.stdout.write(f'  ℹ️  existe : {data["titre"][:50]}...')

    def create_vulnerabilities(self):
        self.stdout.write('\n🔒 Création des vulnérabilités...')
        
        vulns_data = [
            {
                'cve_id': 'CVE-2024-1234',
                'severite': 'high',
                'score_cvss': Decimal('8.2'),
                'description': 'Une configuration incorrecte de iam:PassRole permet à un attaquant d\'élever ses privilèges dans AWS',
                'type': 'Privilege Escalation',
                'source': 'NVD',
                'days_ago': 3,
            },
            {
                'cve_id': 'CVE-2024-5678',
                'severite': 'critical',
                'score_cvss': Decimal('9.1'),
                'description': 'Contournement des politiques d\'accès conditionnel dans Azure AD',
                'type': 'Policy Bypass',
                'source': 'Microsoft MSRC',
                'days_ago': 1,
            },
            {
                'cve_id': 'CVE-2024-9999',
                'severite': 'medium',
                'score_cvss': Decimal('6.5'),
                'description': 'Exposition accidentelle de clés de comptes de service GCP dans des dépôts publics',
                'type': 'Credential Exposure',
                'source': 'Google Security',
                'days_ago': 15,
            },
            {
                'cve_id': 'CVE-2024-1111',
                'severite': 'high',
                'score_cvss': Decimal('7.8'),
                'description': 'Vulnérabilité dans AWS Lambda permettant l\'accès à des ressources non autorisées',
                'type': 'Unauthorized Access',
                'source': 'AWS Security',
                'days_ago': 5,
            },
            {
                'cve_id': 'CVE-2024-2222',
                'severite': 'low',
                'score_cvss': Decimal('3.1'),
                'description': 'Divulgation d\'informations mineures dans Azure Storage',
                'type': 'Information Disclosure',
                'source': 'Azure Security',
                'days_ago': 20,
            },
        ]
        
        for data in vulns_data:
            vuln, created = Vulnerabilite.objects.get_or_create(
                cve_id=data['cve_id'],
                defaults={
                    'severite': data['severite'],
                    'score_cvss': data['score_cvss'],
                    'description_vuln': data['description'],
                    'type_vuln': data['type'],
                    'source_vuln': data['source'],
                    'date_publication': date.today() - timedelta(days=data['days_ago']),
                }
            )
            status = '✅ créée' if created else 'ℹ️  existe'
            self.stdout.write(f'  {status} : {data["cve_id"]} - {data["severite"]}')

    def display_summary(self):
        self.stdout.write('\n' + '='*60)
        self.stdout.write(self.style.HTTP_INFO('📊 RÉSUMÉ'))
        self.stdout.write('='*60)
        
        self.stdout.write(f"\n👥 Utilisateurs : {Utilisateur.objects.count()}")
        for user in Utilisateur.objects.all()[:5]:
            self.stdout.write(f"   - {user.nom_utilisateur} ({user.role_utilisateur})")
        
        self.stdout.write(f"\n📁 Catégories : {Categorie.objects.count()}")
        for cat in Categorie.objects.all():
            nb_articles = cat.articles.count()
            self.stdout.write(f"   - {cat.nom_categorie} : {nb_articles} article(s)")
        
        self.stdout.write(f"\n📰 Articles : {Article.objects.count()}")
        self.stdout.write(f"🔒 Vulnérabilités : {Vulnerabilite.objects.count()}")
        
        self.stdout.write('\n🔐 Comptes de test :')
        self.stdout.write('   Admin  : admin@ciem-veille.dz / admin123')
        self.stdout.write('   User 1 : user1@ciem-veille.dz / user123')
        self.stdout.write('   User 2 : user2@ciem-veille.dz / user123')