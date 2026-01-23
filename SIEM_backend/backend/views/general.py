from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from backend.permissions import IsAdmin, IsVeilleur
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from backend.models import Article, Categorie, Vulnerabilite, Utilisateur
from .utils import paginate_queryset

def api_home(request):
    """Endpoint racine - Informations API"""
    data = {
    'api_name': 'CIEM Veille API',
    'version': '1.0',
    'status': 'active',
    'endpoints': {

        'home': '/',
        'stats': '/stats/',

        'auth': {
            'register': '/auth/register/',
            'login': '/auth/login/',
            'logout': '/auth/logout/',
            'check': '/auth/check/',
            'profile': '/auth/profile/',
            'change_password': '/auth/change-password/',

            'categories': {
                'followed': '/auth/categories/followed/',
                'follow': '/auth/categories/<categorie_id>/follow/'
            }
        },

        'articles': {
            'list': '/articles/',
            'detail': '/articles/<article_id>/',
            'create': '/articles/create/'
        },

        'categories': '/categories/',

        'vulnerabilities': '/vulnerabilities/',

        'users': '/users/',
    }
}

    return JsonResponse(data)

def api_articles_list(request):
    articles = Article.objects.all().order_by('-date_publication')

    paginated = paginate_queryset(articles, request, page_size=10)

    articles_data = []
    for article in paginated['items']:
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
        'pagination': paginated['pagination'],
        'articles': articles_data
    })

@permission_classes([IsAuthenticated])
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
    categories = Categorie.objects.all().order_by('nom_categorie')

    paginated = paginate_queryset(categories, request, page_size=10)

    categories_data = []
    for cat in paginated['items']:
        categories_data.append({
            'id': cat.id,
            'nom': cat.nom_categorie,
            'nb_articles': cat.articles.count(),
            'nb_suiveurs': cat.utilisateurs_suivants.count()
        })

    return JsonResponse({
        'pagination': paginated['pagination'],
        'categories': categories_data
    })


def api_vulnerabilities_list(request):
    vulnerabilities = Vulnerabilite.objects.all().order_by('-date_publication')

    paginated = paginate_queryset(vulnerabilities, request, page_size=10)

    vulns_data = []
    for vuln in paginated['items']:
        vulns_data.append({
            'cve_id': vuln.cve_id,
            'severite': vuln.severite,
            'score_cvss': float(vuln.score_cvss) if vuln.score_cvss else None,
            'description': vuln.description_vuln,
            'date_publication': vuln.date_publication.strftime('%Y-%m-%d'),
            'types': [
                {
                    'cwe_id': t.cwe_id,
                    'type_vul': t.type_vul
                }
                for t in vuln.types_vuln.all()
            ]
        })

    return JsonResponse({
        'pagination': paginated['pagination'],
        'vulnerabilities': vulns_data
    })


def api_stats(request):
    """Statistiques générales"""
    stats = {
        'articles': Article.objects.count(),
        'categories': Categorie.objects.count(),
        'vulnerabilities': Vulnerabilite.objects.count(),
        'articles_recent': Article.objects.count(),
        'vulns_critical': Vulnerabilite.objects.filter(severite='critical').count(),
        'vulns_high': Vulnerabilite.objects.filter(severite='high').count(),
    }
    return JsonResponse(stats)