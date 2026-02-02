from datetime import timedelta
from django.db.models import Count
from django.utils import timezone
from rest_framework.decorators import permission_classes, api_view, authentication_classes
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from backend.models import Article, Categorie, Vulnerabilite
from .utils import paginate_queryset
from backend.serializers import ArticleListSerializer, VulnerabiliteListSerializer, VulnerabiliteDetailSerializer, CategorieListSerializer
from django.db.models.functions import TruncMonth
from collections import defaultdict
from django.db.models import Q

@permission_classes([IsAuthenticated])
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

@permission_classes([IsAuthenticated])
def api_articles_list(request):
    search_query = request.GET.get('q', '').strip()

    # Start with all articles
    articles = Article.objects.all()

    # Apply search query
    if search_query:
        articles = articles.filter(
            Q(categories__nom_categorie__icontains=search_query) |
            Q(titre_article__icontains=search_query) |
            Q(contenu_article__icontains=search_query)
        ).distinct()  # distinct to prevent duplicates if multiple categories match

    # Order by publication date
    articles = articles.order_by('-date_publication')

    # Pagination
    paginated = paginate_queryset(articles, request, page_size=30)

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
            'id': cat.id,
            'nom': cat.nom_categorie
        } for cat in article.categories.all()]
    }
    
    return JsonResponse(data)

@permission_classes([IsAuthenticated])
def api_categories_list(request):
    categories = Categorie.objects.all().order_by('nom_categorie')

    paginated = paginate_queryset(categories, request, page_size=10)

    categories_data = []
    for cat in categories:
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

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_user_favorite_categories(request):

    user = request.user
    categories = user.categories_suivies.all()

    serializer = CategorieListSerializer(categories, many=True)

    return JsonResponse(serializer.data, safe=False)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_update_user_favorite_categories(request):
    utilisateur = request.user
    category_ids = request.data.get('categories', [])

    if not isinstance(category_ids, list):
        return JsonResponse(
            {"error": "categories must be a list of IDs"},
            status=400
        )

    # Fetch valid categories
    categories = Categorie.objects.filter(id__in=category_ids)

    # Replace followed categories
    utilisateur.categories_suivies.set(categories)

    return JsonResponse(
        {
            "message": "Favorite categories updated successfully",
            "categories_count": categories.count(),
            "categories": list(
                categories.values('id', 'nom_categorie')
            )
        },
        status=200
    )
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_vulnerabilities_list(request):
    # Get query parameters
    search_query = request.GET.get('q', '').strip()  # search by CVE ID or description
    severity_filter = request.GET.get('severity', '').lower().strip()  # filter by severity

    # Start with all vulnerabilities
    vulnerabilities = Vulnerabilite.objects.all()

    # Apply search query
    if search_query:
        vulnerabilities = vulnerabilities.filter(
            Q(cve_id__icontains=search_query) |
            Q(description_vuln__icontains=search_query)
        )

    # Apply severity filter
    if severity_filter and severity_filter in dict(Vulnerabilite.SEVERITY_CHOICES):
        vulnerabilities = vulnerabilities.filter(severite=severity_filter)

    # Order by publication date
    vulnerabilities = vulnerabilities.order_by('-date_publication')

    # Pagination (reuse your existing helper)
    paginated = paginate_queryset(vulnerabilities, request, page_size=10)

    vuln_data = list(paginated['items'])

    return JsonResponse({
        'pagination': paginated['pagination'],
        'vulnerabilities': VulnerabiliteListSerializer(vuln_data, many=True).data
    })

@permission_classes([IsAuthenticated])
def api_vulnerability_detail(request, vulnerability_id):
    """Détail d'un article spécifique"""
    vulnerabilitie = get_object_or_404(Vulnerabilite, cve_id=vulnerability_id)
    data = VulnerabiliteDetailSerializer(vulnerabilitie).data
    return JsonResponse(data)

@permission_classes([IsAuthenticated])
def api_stats(request):
    """Return general dashboard statistics."""

    # ----------------------------
    # Time ranges
    # ----------------------------
    today = timezone.now().date()
    last_7_days = today - timedelta(days=7)
    last_12_months = today - timedelta(days=365)

    # ----------------------------
    # Recent articles & vulnerabilities
    # ----------------------------
    recent_articles_qs = Article.objects.filter(date_publication__gte=last_7_days)
    recent_vulns_qs = Vulnerabilite.objects.filter(date_publication__gte=last_7_days)

    # ----------------------------
    # Categories repartition (top 5 + "Another")
    # ----------------------------
    TOP_N = 5
    category_counts = (
        Categorie.objects
        .annotate(article_count=Count('articles'))
        .filter(article_count__gt=0)
        .order_by('-article_count')
    )

    top_categories = category_counts[:TOP_N]
    other_categories = category_counts[TOP_N:]

    categories_repartition = [
        {"category": cat.nom_categorie, "count": cat.article_count}
        for cat in top_categories
    ]

    other_count = sum(cat.article_count for cat in other_categories)
    if other_count > 0:
        categories_repartition.append({"category": "Another", "count": other_count})

    # ----------------------------
    # Trends data (articles & vulnerabilities per month)
    # ----------------------------
    articles_per_month = (
        Article.objects.filter(date_publication__gte=last_12_months)
        .annotate(month=TruncMonth('date_publication'))
        .values('month')
        .annotate(count=Count('id_article'))
        .order_by('month')
    )

    vulns_per_month = (
        Vulnerabilite.objects.filter(date_publication__gte=last_12_months)
        .annotate(month=TruncMonth('date_publication'))
        .values('month')
        .annotate(count=Count('cve_id'))
        .order_by('month')
    )

    # Merge trends into a single dict
    trend_map = defaultdict(lambda: {"articles": 0, "vulnerabilities": 0})
    for row in articles_per_month:
        trend_map[row["month"]]["articles"] = row["count"]
    for row in vulns_per_month:
        trend_map[row["month"]]["vulnerabilities"] = row["count"]

    trends_data = [
        {
            "date": month.strftime("%b %Y"),
            "articles": values["articles"],
            "vulnerabilities": values["vulnerabilities"],
        }
        for month, values in sorted(trend_map.items())
    ]

    # ----------------------------
    # Vulnerabilities by severity
    # ----------------------------
    severity_counts = (
        Vulnerabilite.objects.values('severite')
        .annotate(count=Count('cve_id'))
        .order_by('-count')
    )

    COLORS = {
        'unknown': '#6c757d',
        'low': '#10b981',
        'medium': '#3b82f6',
        'high': '#f59e0b',
        'critical': '#ef4444'
    }

    LABELS = {
        'critical': 'Critical',
        'high': 'High',
        'medium': 'Medium',
        'low': 'Low',
        'unknown': 'Unknown'
    }

    severity_data = [
        {
            "severity": LABELS.get(item["severite"], item["severite"].title()),
            "count": item["count"],
            "color": COLORS.get(item["severite"], "#000000")
        }
        for item in severity_counts
    ]

    # ----------------------------
    # Assemble final stats
    # ----------------------------
    stats = {
        "totalArticles": Article.objects.count(),
        "categories": Categorie.objects.count(),
        "totalVulnerabilities": Vulnerabilite.objects.count(),
        "recentArticles": recent_articles_qs.count(),
        "criticalVulnerabilities": Vulnerabilite.objects.filter(severite='critical').count(),
        "categoriesRepartition": categories_repartition,
        "trendsData": trends_data,
        "severityData": severity_data,
        "recentArticlesData": ArticleListSerializer(
            recent_articles_qs.order_by('-date_publication'), many=True
        ).data,
        "recentVulnerabilitiesData": VulnerabiliteListSerializer(
            recent_vulns_qs.order_by('-date_publication'), many=True
        ).data
    }

    return JsonResponse(stats)