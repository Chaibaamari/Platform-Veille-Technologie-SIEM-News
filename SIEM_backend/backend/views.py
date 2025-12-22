# backend/views.py
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from .models import Article, Categorie, Vulnerabilite, Utilisateur
from .serializers import ArticleCreateSerializer
import json

# =======================
# VUES API (Retour JSON)
# =======================

def api_home(request):
    """Endpoint racine - Informations API"""
    data = {
        'api_name': 'CIEM Veille API',
        'version': '1.0',
        'endpoints': {
            'home': '/',
            'articles': '/articles/',
            'article_detail': '/articles/<id>/',
            'categories': '/categories/',
            'vulnerabilities': '/vulnerabilities/',
            'users': '/users/'
        },
        'status': 'active'
    }
    return JsonResponse(data)

def api_articles_list(request):
    """Liste tous les articles (JSON)"""
    articles = Article.objects.all().order_by('-date_publication')
    
    articles_data = []
    for article in articles:
        articles_data.append({
            'id': article.id_article,
            'titre': article.titre_article,
            'url': article.url_article,
            'description': article.description_article,
            'date_publication': article.date_publication.strftime('%Y-%m-%d'),
            'categories': [cat.nom_categorie for cat in article.categories.all()],
            'thumbnail': article.thumbnail
        })
    
    return JsonResponse({
        'count': len(articles_data),
        'articles': articles_data
    })

def api_article_detail(request, article_id):
    """Détail d'un article spécifique"""
    article = get_object_or_404(Article, id_article=article_id)
    
    data = {
        'id': article.id_article,
        'titre': article.titre_article,
        'url': article.url_article,
        'description': article.description_article,
        'contenu': article.contenu_article,
        'summary': article.summary_article,
        'date_publication': article.date_publication.strftime('%Y-%m-%d'),
        'thumbnail': article.thumbnail,
        'categories': [{
            'id': cat.id_categorie,
            'nom': cat.nom_categorie
        } for cat in article.categories.all()]
    }
    
    return JsonResponse(data)

def api_categories_list(request):
    """Liste toutes les catégories"""
    categories = Categorie.objects.all()
    
    categories_data = []
    for cat in categories:
        categories_data.append({
            'id': cat.id_categorie,
            'nom': cat.nom_categorie,
            'description': cat.description_categorie,
            'date_creation': cat.date_creation.strftime('%Y-%m-%d %H:%M:%S'),
            'nb_articles': cat.articles.count(),
            'nb_suiveurs': cat.utilisateurs_suivants.count()
        })
    
    return JsonResponse({
        'count': len(categories_data),
        'categories': categories_data
    })

def api_vulnerabilities_list(request):
    """Liste toutes les vulnérabilités"""
    vulnerabilities = Vulnerabilite.objects.all().order_by('-date_publication')
    
    vulns_data = []
    for vuln in vulnerabilities:
        vulns_data.append({
            'id': vuln.id_vulnerabilite,
            'cve_id': vuln.cve_id,
            'titre': vuln.cve_id,  # Utilise CVE comme titre
            'severite': vuln.severite,
            'score_cvss': float(vuln.score_cvss) if vuln.score_cvss else None,
            'description': vuln.description_vuln[:200] + '...' if len(vuln.description_vuln) > 200 else vuln.description_vuln,
            'date_publication': vuln.date_publication.strftime('%Y-%m-%d'),
            'source': vuln.source_vuln,
            'type': vuln.type_vuln
        })
    
    return JsonResponse({
        'count': len(vulns_data),
        'vulnerabilities': vulns_data
    })

def api_users_list(request):
    """Liste tous les utilisateurs (admin seulement)"""
    users = Utilisateur.objects.all()
    
    users_data = []
    for user in users:
        users_data.append({
            'id': user.id_utilisateur,
            'username': user.nom_utilisateur,
            'email': user.email_utilisateur,
            'role': user.role_utilisateur,
            'date_creation': user.date_creation.strftime('%Y-%m-%d %H:%M:%S'),
            'categories_suivies': [cat.nom_categorie for cat in user.categories_suivies.all()]
        })
    
    return JsonResponse({
        'count': len(users_data),
        'users': users_data
    })

def api_stats(request):
    """Statistiques générales"""
    stats = {
        'articles': Article.objects.count(),
        'categories': Categorie.objects.count(),
        'vulnerabilities': Vulnerabilite.objects.count(),
        'users': Utilisateur.objects.count(),
        'articles_recent': Article.objects.order_by('-date_publication').count(),
        'vulns_critical': Vulnerabilite.objects.filter(severite='critical').count(),
        'vulns_high': Vulnerabilite.objects.filter(severite='high').count(),
    }
    return JsonResponse(stats)

@api_view(['POST'])
@csrf_exempt  # Désactiver CSRF pour cette vue API
def api_create_article(request):
    """Créer un nouvel article (POST) avec DRF"""
    try:
        # Utiliser request.data qui est déjà parsé par DRF
        data = request.data
        
        # Récupérer la catégorie
        categorie_nom = data.get('categorie', 'AWS Security')
        categorie, created = Categorie.objects.get_or_create(
            nom_categorie=categorie_nom,
            defaults={'description_categorie': f'Catégorie {categorie_nom}'}
        )
        
        # Créer l'article
        article = Article.objects.create(
            titre_article=data['titre'],
            url_article=data['url'],
            description_article=data.get('description', ''),
            date_publication=data.get('date_publication', '2024-01-01')
        )
        
        # Ajouter la catégorie
        article.categories.add(categorie)
        
        return Response({
            'status': 'success',
            'message': 'Article créé avec succès',
            'article_id': article.id_article
        }, status=status.HTTP_201_CREATED)
        
    except KeyError as e:
        return Response({
            'status': 'error',
            'message': f'Champ manquant: {str(e)}'
        }, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)