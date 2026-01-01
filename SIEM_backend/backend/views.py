# backend/views.py
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from .models import Article, Categorie, Vulnerabilite, Utilisateur
from .serializers import ArticleCreateSerializer
import json
from .serializers import (
    UtilisateurSerializer, 
    UtilisateurLoginSerializer,
    UtilisateurProfileSerializer,
    CategorieSerializer
)

# =======================
# VUES API (Retour JSON)
# =======================

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

@api_view(["GET", "DELETE", "PUT"])
@permission_classes([IsAuthenticated])
def api_article_detail(request, article_id):
    article = get_object_or_404(Article, id_article=article_id)

    if request.method == "DELETE":
        if request.user.role_utilisateur != "admin":
            return Response(
                {"error": "Admin only"},
                status=status.HTTP_403_FORBIDDEN
            )

        article.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    data = {
        "id": article.id_article,
        "titre": article.titre_article,
        "url": article.url_article,
        "description": article.description_article,
        "contenu": article.contenu_article,
        "summary": article.summary_article,
        "date_publication": article.date_publication.strftime("%Y-%m-%d"),
        "thumbnail": article.thumbnail,
        "categories": [
            {"id": cat.id_categorie, "nom": cat.nom_categorie}
            for cat in article.categories.all()
        ],
    }

    if request.method == "PUT":
        if request.user.role_utilisateur != "admin":
            return Response(
                {"error": "Admin Only"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if not request.data:
          return Response({
               'status': 'error',
               'message': 'Aucune donnée fournie pour la mise à jour'
            }, status=status.HTTP_400_BAD_REQUEST)

        """Mettre à jour l'article"""
        data = request.data
        article.titre_article = data.get("titre", article.titre_article)
        article.url_article = data.get("url", article.url_article)
        article.description_article = data.get("description", article.description_article)
        article.contenu_article = data.get("contenu", article.contenu_article)
        article.summary_article = data.get("summary", article.summary_article)
        article.thumbnail = data.get("thumbnail", article.thumbnail)

        article.save()
        
        return Response(
            {"message": "Article updated successfully"},
            status=status.HTTP_200_OK
        )


    return Response(data, status=status.HTTP_200_OK)

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
            'description': vuln.description_vuln,
            'contenu': vuln.contenu_vuln,
            'summary': vuln.summary_vuln,
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

