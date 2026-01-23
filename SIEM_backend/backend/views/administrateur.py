from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from backend.permissions import IsAdmin
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from backend.models import Article, Categorie, Vulnerabilite, Utilisateur
from .utils import send_login_credentials_to_user, generate_random_password, paginate_queryset

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdmin])
def api_users_list(request):
    """Liste tous les utilisateurs (admin seulement)"""
    users = Utilisateur.objects.all()

    paginated = paginate_queryset(users, request, page_size=10)
    
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
        'pagination': paginated['pagination'],
        'users': users_data
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdmin])
def api_add_user(request):
    try:
        data = request.data

        nom_utilisateur = data.get('nom_utilisateur')
        email_utilisateur = data.get('email_utilisateur')
        role_utilisateur = data.get('role_utilisateur')

        if not nom_utilisateur:
            raise KeyError("nom_utilisateur")
        if not email_utilisateur:
            raise KeyError("email_utilisateur")
        if not role_utilisateur:
            raise KeyError("role_utilisateur")
        
        if Utilisateur.objects.filter(email_utilisateur=email_utilisateur).exists():
            raise Exception(f"l'utilisateur {email_utilisateur} existe déjà dans la base de données")

        # Create user WITHOUT password first
        utilisateur = Utilisateur.objects.create(
            nom_utilisateur=nom_utilisateur,
            email_utilisateur=email_utilisateur,
            role_utilisateur=role_utilisateur,
        )

        # Generate password
        generated_password = generate_random_password()

        # Send email + set hashed password
        send_login_credentials_to_user(
            utilisateur=utilisateur,
            generated_password=generated_password
        )

        utilisateur.set_password(generated_password)
        utilisateur.save()

        return Response(
            {"message": "Utilisateur créé avec succès"},
            status=status.HTTP_201_CREATED
        )

    except KeyError as e:
        return Response(
            {
                "status": "error",
                "message": f"Champ manquant: {str(e)}"
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    except Exception as e:
        return Response(
            {
                "status": "error",
                "message": str(e)
            },
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['DELETE'])
@permission_classes([IsAuthenticated, IsAdmin])
def api_delete_user(request, user_id):
    """
    Supprimer un utilisateur (sauf les admins)
    Seuls les admins peuvent supprimer des utilisateurs
    """
    try:
        # Récupérer l'utilisateur à supprimer
        utilisateur = get_object_or_404(Utilisateur, id_utilisateur=user_id)
        
        # Vérifier si l'utilisateur est un admin
        if utilisateur.role_utilisateur == 'admin':
            return Response(
                {
                    "status": "error",
                    "message": "Impossible de supprimer un administrateur"
                },
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Vérifier si l'admin essaie de se supprimer lui-même
        if utilisateur.id_utilisateur == request.user.id_utilisateur:
            return Response(
                {
                    "status": "error",
                    "message": "Vous ne pouvez pas supprimer votre propre compte"
                },
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Sauvegarder les infos avant suppression (pour le message)
        nom_utilisateur = utilisateur.nom_utilisateur
        email_utilisateur = utilisateur.email_utilisateur
        
        # Supprimer l'utilisateur
        utilisateur.delete()
        
        return Response(
            {
                "status": "success",
                "message": f"Utilisateur '{nom_utilisateur}' ({email_utilisateur}) supprimé avec succès"
            },
            status=status.HTTP_200_OK
        )
        
    except Utilisateur.DoesNotExist:
        return Response(
            {
                "status": "error",
                "message": "Utilisateur non trouvé"
            },
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {
                "status": "error",
                "message": f"Erreur lors de la suppression: {str(e)}"
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdmin])
def api_deactivate_user(request, user_id):
    """
    Désactiver un utilisateur (soft delete)
    L'utilisateur ne peut plus se connecter mais les données restent
    """
    try:
        utilisateur = get_object_or_404(Utilisateur, id_utilisateur=user_id)
        
        # Vérifier si l'utilisateur est un admin
        if utilisateur.role_utilisateur == 'admin':
            return Response(
                {
                    "status": "error",
                    "message": "Impossible de désactiver un administrateur"
                },
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Vérifier si l'admin essaie de se désactiver lui-même
        if utilisateur.id_utilisateur == request.user.id_utilisateur:
            return Response(
                {
                    "status": "error",
                    "message": "Vous ne pouvez pas désactiver votre propre compte"
                },
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Vérifier si déjà désactivé
        if not utilisateur.is_active:
            return Response(
                {
                    "status": "error",
                    "message": "L'utilisateur est déjà désactivé"
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Désactiver l'utilisateur
        utilisateur.is_active = False
        utilisateur.save()
        
        return Response(
            {
                "status": "success",
                "message": f"Utilisateur '{utilisateur.nom_utilisateur}' désactivé avec succès"
            },
            status=status.HTTP_200_OK
        )
        
    except Utilisateur.DoesNotExist:
        return Response(
            {
                "status": "error",
                "message": "Utilisateur non trouvé"
            },
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {
                "status": "error",
                "message": f"Erreur lors de la désactivation: {str(e)}"
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdmin])
def api_reactivate_user(request, user_id):
    """
    Réactiver un utilisateur désactivé
    """
    try:
        utilisateur = get_object_or_404(Utilisateur, id_utilisateur=user_id)
        
        if utilisateur.is_active:
            return Response(
                {
                    "status": "error",
                    "message": "L'utilisateur est déjà actif"
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        utilisateur.is_active = True
        utilisateur.save()
        
        return Response(
            {
                "status": "success",
                "message": f"Utilisateur '{utilisateur.nom_utilisateur}' réactivé avec succès"
            },
            status=status.HTTP_200_OK
        )
        
    except Utilisateur.DoesNotExist:
        return Response(
            {
                "status": "error",
                "message": "Utilisateur non trouvé"
            },
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {
                "status": "error",
                "message": f"Erreur lors de la réactivation: {str(e)}"
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )