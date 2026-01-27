# backend/urls.py
from django.urls import path
# Vues API classiques
from . import views

urlpatterns = [
    # ============================================
    # API HOME & STATS
    # ============================================
    path('', views.api_home, name='api_home'),
    path('stats/', views.api_stats, name='api_stats'),
    
    # ============================================
    # AUTHENTIFICATION
    # ============================================
    path('auth/register/', views.RegisterView.as_view(), name='register'),
    path('auth/login/', views.LoginView.as_view(), name='login'),
    path('auth/logout/', views.LogoutView.as_view(), name='logout'),
    path('auth/check/', views.CheckAuthView.as_view(), name='check-auth'),
    path('auth/refresh/', views.RefreshTokenView.as_view(), name='refresh-token'),
    path('auth/forgot-password/', views.ForgotPasswordView.as_view(), name='forgot-password'),
    path('auth/validate-reset-token/<uuid:token>/', views.ValidateResetTokenView.as_view(), name='validate-reset-token'),
    path('auth/reset-password/', views.ResetPasswordView.as_view(), name='reset-password'),
    
    # Profil utilisateur
    path('auth/profile/', views.ProfileView.as_view(), name='profile'),
    path('auth/change-password/', views.ChangePasswordView.as_view(), name='change-password'),
    
    # ============================================
    # ARTICLES
    # ============================================
    path('articles/', views.api_articles_list, name='api_articles_list'),
    path('articles/<int:article_id>/', views.api_article_detail, name='api_article_detail'),
    # path('articles/create/', views.APICreateArticle.as_view(), name='api_create_article'),
    
    # ============================================
    # CATÉGORIES
    # ============================================
    path('categories/', views.api_categories_list, name='api_categories_list'),
    path('users/add-category/', views.api_add_category_to_user),
    path('users/remove-category/', views.api_remove_category_from_user),
    path('users/categories/followed/', views.api_user_followed_categories, name='followed-categories'),
    
    # ============================================
    # VULNÉRABILITÉS
    # ============================================
    path('vulnerabilities/', views.api_vulnerabilities_list, name='api_vulnerabilities_list'),
    path('vulnerabilities/<str:vulnerability_id>/', views.api_vulnerability_detail, name='api_vulnerability_detail'),

    # ============================================
    # UTILISATEURS
    # ============================================
    path('users/', views.api_users_list, name='api_users_list'),
    path('users/add', views.api_add_user, name='api_add_user'),
    path('users/<int:user_id>/delete/', views.api_delete_user, name='delete-user'),
    path('users/<int:user_id>/deactivate/', views.api_deactivate_user, name='deactivate-user'),
    path('users/<int:user_id>/reactivate/', views.api_reactivate_user, name='reactivate-user'),

    # ============================================
    # VEILLE
    # ============================================
    path('lancer_veille/', views.api_start_scrapping, name='start_scraping_background'),

    # ============================================
    # SOURCES
    # ============================================
    path('sources/', views.api_list_sources),
    path('sources/add/', views.api_add_source),
    path('sources/<int:source_id>/delete/', views.api_delete_source),
]