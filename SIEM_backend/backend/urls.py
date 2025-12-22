# backend/urls.py
from django.urls import path

# Import conditionnel de SimpleJWT
try:
    from rest_framework_simplejwt.views import TokenRefreshView
    SIMPLE_JWT_AVAILABLE = True
except ImportError:
    SIMPLE_JWT_AVAILABLE = False
    TokenRefreshView = None

# Vues API classiques
from . import views

# Vues d'authentification
from .views_auth import (
    RegisterView,
    LoginView,
    LogoutView,
    ProfileView,
    ChangePasswordView,
    FollowCategoryView,
    UserFollowedCategoriesView,
    CheckAuthView
)

urlpatterns = [
    # ============================================
    # API HOME & STATS
    # ============================================
    path('', views.api_home, name='api_home'),
    path('stats/', views.api_stats, name='api_stats'),
    
    # ============================================
    # AUTHENTIFICATION
    # ============================================
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/check/', CheckAuthView.as_view(), name='check-auth'),
    
    # Profil utilisateur
    path('auth/profile/', ProfileView.as_view(), name='profile'),
    path('auth/change-password/', ChangePasswordView.as_view(), name='change-password'),
    
    # Gestion des catégories suivies
    path('auth/categories/followed/', UserFollowedCategoriesView.as_view(), name='followed-categories'),
    path('auth/categories/<int:categorie_id>/follow/', FollowCategoryView.as_view(), name='follow-category'),
    
    # ============================================
    # ARTICLES
    # ============================================
    path('articles/', views.api_articles_list, name='api_articles_list'),
    path('articles/<int:article_id>/', views.api_article_detail, name='api_article_detail'),
    path('articles/create/', views.api_create_article, name='api_create_article'),
    
    # ============================================
    # CATÉGORIES
    # ============================================
    path('categories/', views.api_categories_list, name='api_categories_list'),
    
    # ============================================
    # VULNÉRABILITÉS
    # ============================================
    path('vulnerabilities/', views.api_vulnerabilities_list, name='api_vulnerabilities_list'),
    
    # ============================================
    # UTILISATEURS
    # ============================================
    path('users/', views.api_users_list, name='api_users_list'),
]

# Ajouter le refresh token endpoint si SimpleJWT est disponible
if SIMPLE_JWT_AVAILABLE and TokenRefreshView:
    urlpatterns += [
        path('auth/token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    ]