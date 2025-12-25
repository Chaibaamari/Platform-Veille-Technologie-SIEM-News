# veille/views_auth.py
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.utils import timezone

# Import conditionnel de SimpleJWT
try:
    from rest_framework_simplejwt.tokens import RefreshToken
    from rest_framework_simplejwt.views import TokenRefreshView
    SIMPLE_JWT_AVAILABLE = True
except ImportError:
    SIMPLE_JWT_AVAILABLE = False
    RefreshToken = None
    TokenRefreshView = None

from .models import Utilisateur, Categorie
from .serializers import (
    UtilisateurSerializer, 
    UtilisateurLoginSerializer,
    UtilisateurProfileSerializer,
    CategorieSerializer
)


class RegisterView(APIView):
    """Inscription d'un nouvel utilisateur"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        if not SIMPLE_JWT_AVAILABLE:
            return Response({
                'status': 'error',
                'message': 'SimpleJWT non installé. Exécutez: pip install djangorestframework-simplejwt'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        serializer = UtilisateurSerializer(data=request.data)
        
        if serializer.is_valid():
            utilisateur = serializer.save()
            
            # Générer les tokens JWT
            refresh = RefreshToken.for_user(utilisateur)
            
            return Response({
                'status': 'success',
                'message': 'Utilisateur créé avec succès',
                'user': UtilisateurProfileSerializer(utilisateur).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'status': 'error',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    """Connexion utilisateur"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        if not SIMPLE_JWT_AVAILABLE:
            return Response({
                'status': 'error',
                'message': 'SimpleJWT non installé. Exécutez: pip install djangorestframework-simplejwt'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        serializer = UtilisateurLoginSerializer(data=request.data)
        
        if serializer.is_valid():
            utilisateur = serializer.validated_data['utilisateur']
            
            # Générer les tokens JWT
            refresh = RefreshToken.for_user(utilisateur)
            
            return Response({
                'status': 'success',
                'message': 'Connexion réussie',
                'user': UtilisateurProfileSerializer(utilisateur).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            })
        
        return Response({
            'status': 'error',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    """Déconnexion utilisateur (blacklist du token)"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        if not SIMPLE_JWT_AVAILABLE:
            return Response({
                'status': 'error',
                'message': 'SimpleJWT non installé'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        try:
            refresh_token = request.data.get('refresh')
            if not refresh_token:
                return Response({
                    'status': 'error',
                    'message': 'Token de rafraîchissement requis'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            token = RefreshToken(refresh_token)
            token.blacklist()
            
            return Response({
                'status': 'success',
                'message': 'Déconnexion réussie'
            })
        except Exception as e:
            return Response({
                'status': 'error',
                'message': f'Erreur lors de la déconnexion: {str(e)}'
            }, status=status.HTTP_400_BAD_REQUEST)


class ProfileView(APIView):
    """Profil utilisateur connecté"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Récupérer le profil de l'utilisateur connecté"""
        serializer = UtilisateurProfileSerializer(request.user)
        return Response({
            'status': 'success',
            'user': serializer.data
        })
    
    def put(self, request):
        if not request.data:
          return Response({
               'status': 'error',
               'message': 'Aucune donnée fournie pour la mise à jour'
            }, status=status.HTTP_400_BAD_REQUEST)

        """Mettre à jour le profil"""
        utilisateur = request.user
        serializer = UtilisateurProfileSerializer(
            utilisateur, 
            data=request.data, 
            partial=True
        )

        # problem: returns success even if data sent is empty [FIXED]
        
        if serializer.is_valid():
            serializer.save()
            return Response({
                'status': 'success',
                'message': 'Profil mis à jour avec succès',
                'user': serializer.data
            })
        
        return Response({
            'status': 'error',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class ChangePasswordView(APIView):
    """Changer le mot de passe de l'utilisateur connecté"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        utilisateur = request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')
        confirm_password = request.data.get('confirm_password')
        
        # Validation des champs requis
        if not old_password or not new_password or not confirm_password:
            return Response({
                'status': 'error',
                'message': 'Tous les champs sont requis'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Vérifier que les nouveaux mots de passe correspondent
        if new_password != confirm_password:
            return Response({
                'status': 'error',
                'message': 'Les nouveaux mots de passe ne correspondent pas'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Vérifier la longueur minimale
        if len(new_password) < 8:
            return Response({
                'status': 'error',
                'message': 'Le nouveau mot de passe doit contenir au moins 8 caractères'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Vérifier l'ancien mot de passe
        if not utilisateur.check_password(old_password):
            return Response({
                'status': 'error',
                'message': 'Ancien mot de passe incorrect'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Changer le mot de passe
        utilisateur.set_password(new_password)
        utilisateur.save()
        
        return Response({
            'status': 'success',
            'message': 'Mot de passe changé avec succès'
        })


class FollowCategoryView(APIView):
    """Suivre ou ne plus suivre une catégorie"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request, categorie_id):
        """Toggle follow/unfollow d'une catégorie"""
        try:
            categorie = Categorie.objects.get(id_categorie=categorie_id)
            utilisateur = request.user
            
            # Vérifier si l'utilisateur suit déjà cette catégorie
            if utilisateur.categories_suivies.filter(id_categorie=categorie_id).exists():
                # Désabonner
                utilisateur.categories_suivies.remove(categorie)
                action = 'unfollowed'
                message = 'Vous ne suivez plus cette catégorie'
            else:
                # Abonner
                utilisateur.categories_suivies.add(categorie)
                action = 'followed'
                message = 'Vous suivez maintenant cette catégorie'
            
            return Response({
                'status': 'success',
                'action': action,
                'message': message,
                'category': CategorieSerializer(categorie).data
            })
            
        except Categorie.DoesNotExist:
            return Response({
                'status': 'error',
                'message': 'Catégorie non trouvée'
            }, status=status.HTTP_404_NOT_FOUND)


class UserFollowedCategoriesView(APIView):
    """Liste des catégories suivies par l'utilisateur connecté"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Récupérer toutes les catégories suivies"""
        utilisateur = request.user
        categories = utilisateur.categories_suivies.all()
        serializer = CategorieSerializer(categories, many=True)
        
        return Response({
            'status': 'success',
            'count': categories.count(),
            'categories': serializer.data
        })


class CheckAuthView(APIView):
    """Vérifier si l'utilisateur est authentifié"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Retourne les infos de l'utilisateur connecté"""
        serializer = UtilisateurProfileSerializer(request.user)
        return Response({
            'status': 'success',
            'authenticated': True,
            'user': serializer.data
        })