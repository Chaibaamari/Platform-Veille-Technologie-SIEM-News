# veille/views_auth.py
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.conf import settings

# Import conditionnel de SimpleJWT
try:
    from rest_framework_simplejwt.tokens import RefreshToken
    from rest_framework_simplejwt.exceptions import TokenError
    SIMPLE_JWT_AVAILABLE = True
except ImportError:
    SIMPLE_JWT_AVAILABLE = False
    RefreshToken = None

from .utils import send_password_reset_email
from backend.models import Utilisateur, Categorie, PasswordResetToken
from backend.serializers import (
    UtilisateurSerializer, 
    UtilisateurLoginSerializer,
    UtilisateurProfileSerializer,
    CategorieSerializer,
    ForgotPasswordSerializer,
    ResetPasswordSerializer
)

def get_tokens_for_user(utilisateur: Utilisateur):
    refresh = RefreshToken.for_user(utilisateur)

    refresh['role'] = utilisateur.role_utilisateur
    refresh['nom_utilisateur'] = utilisateur.nom_utilisateur
    refresh['email'] = utilisateur.email_utilisateur

    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token)
    }

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
            tokens = get_tokens_for_user(utilisateur)

            # Créer la réponse
            response = Response({
                'status': 'success',
                'message': 'Connexion réussie',
                'user': UtilisateurProfileSerializer(utilisateur).data,
                'tokens': {
                    'access': tokens['access'],
                }
            })

            # Stocker le refresh token dans un cookie HTTP-only
            response.set_cookie(
                key='refresh_token',
                value=tokens['refresh'],
                httponly=True,
                samesite='None',
                max_age=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds(),
                path='/',
            )
            
            return response
        
        return Response({
            'status': 'error',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

class RefreshTokenView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_token = request.COOKIES.get('refresh_token')

        if not refresh_token:
            return Response({
                'status': 'error',
                'message': 'Refresh token manquant'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        try:
            # Vérifier et décoder le refresh token
            refresh = RefreshToken(refresh_token)
            
            # Générer un nouveau access token
            access_token = str(refresh.access_token)
            
            response = Response({
                'status': 'success',
                'tokens': {
                    'access': access_token
                }
            })
            
            # Si ROTATE_REFRESH_TOKENS est activé, mettre à jour le cookie
            if settings.SIMPLE_JWT.get('ROTATE_REFRESH_TOKENS', False):
                # Générer un nouveau refresh token
                refresh.set_jti()
                refresh.set_exp()
                
                response.set_cookie(
                    key='refresh_token',
                    value=str(refresh),
                    httponly=True,
                    secure=settings.SIMPLE_JWT.get('AUTH_COOKIE_SECURE', True),
                    samesite=settings.SIMPLE_JWT.get('AUTH_COOKIE_SAMESITE', 'Lax'),
                    max_age=settings.SIMPLE_JWT.get('REFRESH_TOKEN_LIFETIME').total_seconds(),
                    path='/',
                )
            
            return response
            
        except TokenError as e:
            return Response({
                'status': 'error',
                'message': 'Token invalide ou expiré'
            }, status=status.HTTP_401_UNAUTHORIZED)

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
    
class ForgotPasswordView(APIView):
    """Demande de réinitialisation de mot de passe"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        
        if serializer.is_valid():
            email = serializer.validated_data['email_utilisateur']
            
            try:
                utilisateur = Utilisateur.objects.get(
                    email_utilisateur=email,
                    is_active=True
                )
                
                # Invalider tous les anciens tokens non utilisés
                PasswordResetToken.objects.filter(
                    utilisateur=utilisateur,
                    is_used=False
                ).update(is_used=True)
                
                # Créer un nouveau token
                reset_token = PasswordResetToken.objects.create(
                    utilisateur=utilisateur
                )
                
                # Envoyer l'email
                send_password_reset_email(utilisateur, reset_token)
                
            except Utilisateur.DoesNotExist:
                # Ne pas révéler si l'utilisateur existe ou non
                pass
            
            # Toujours retourner le même message pour la sécurité
            return Response({
                'status': 'success',
                'message': 'Si cet email existe dans notre système, vous recevrez un lien de réinitialisation.'
            })
        
        return Response({
            'status': 'error',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class ValidateResetTokenView(APIView):
    """Valider un token de réinitialisation"""
    permission_classes = [AllowAny]
    
    def get(self, request, token):
        try:
            reset_token = PasswordResetToken.objects.get(token=token)
            
            if reset_token.is_valid():
                return Response({
                    'status': 'success',
                    'message': 'Token valide',
                    'email': reset_token.utilisateur.email_utilisateur
                })
            else:
                return Response({
                    'status': 'error',
                    'message': 'Token expiré ou déjà utilisé'
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except PasswordResetToken.DoesNotExist:
            return Response({
                'status': 'error',
                'message': 'Token invalide'
            }, status=status.HTTP_404_NOT_FOUND)


class ResetPasswordView(APIView):
    """Réinitialiser le mot de passe"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        
        if serializer.is_valid():
            token_uuid = serializer.validated_data['token']
            new_password = serializer.validated_data['new_password']
            
            try:
                reset_token = PasswordResetToken.objects.get(token=token_uuid)
                
                if not reset_token.is_valid():
                    return Response({
                        'status': 'error',
                        'message': 'Token expiré ou déjà utilisé'
                    }, status=status.HTTP_400_BAD_REQUEST)
                
                # Mettre à jour le mot de passe
                utilisateur = reset_token.utilisateur
                utilisateur.set_password(new_password)
                utilisateur.save()
                
                # Marquer le token comme utilisé
                reset_token.is_used = True
                reset_token.save()
                
                # Invalider tous les autres tokens de cet utilisateur
                PasswordResetToken.objects.filter(
                    utilisateur=utilisateur,
                    is_used=False
                ).update(is_used=True)
                
                return Response({
                    'status': 'success',
                    'message': 'Mot de passe réinitialisé avec succès'
                })
                
            except PasswordResetToken.DoesNotExist:
                return Response({
                    'status': 'error',
                    'message': 'Token invalide'
                }, status=status.HTTP_404_NOT_FOUND)
        
        return Response({
            'status': 'error',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

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