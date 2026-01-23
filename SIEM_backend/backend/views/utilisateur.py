from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from backend.permissions import IsUtilisateur
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from backend.models import Categorie, Utilisateur
from backend.serializers import CategorieSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsUtilisateur])
def api_user_followed_categories(request):

    """Récupérer toutes les catégories suivies"""
    utilisateur = request.user
    categories = utilisateur.categories_suivies.all()
    serializer = CategorieSerializer(categories, many=True)
    
    return Response({
        'status': 'success',
        'count': categories.count(),
        'categories': serializer.data
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_add_category_to_user(request):
    data = request.data

    user_id = data.get('user_id')
    category_id = data.get('category_id')

    if not user_id or request.user.id_utilisateur != user_id:
        return Response(
            {"message": "user_id est requis"},
            status=status.HTTP_400_BAD_REQUEST
        )

    if not category_id:
        return Response(
            {"message": "category_id est requis"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Check user exists
    user = get_object_or_404(Utilisateur, id_utilisateur=user_id)

    # Check category exists
    category = get_object_or_404(Categorie, id=category_id)

    # Prevent duplicate follow
    if user.categories_suivies.filter(id=category.id).exists():
        return Response(
            {
                "message": "Cette catégorie est déjà suivie par l'utilisateur",
                "user_id": user.id_utilisateur,
                "category_id": category.id
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # Add relation
    user.categories_suivies.add(category)

    return Response(
        {
            "message": "Catégorie ajoutée aux catégories suivies",
            "user_id": user.id_utilisateur,
            "category_id": category.id
        },
        status=status.HTTP_200_OK
    )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_remove_category_from_user(request):
    data = request.data

    user_id = data.get('user_id')
    category_id = data.get('category_id')

    if not user_id:
        return Response(
            {"message": "user_id est requis"},
            status=status.HTTP_400_BAD_REQUEST
        )

    if not category_id:
        return Response(
            {"message": "category_id est requis"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Check user exists
    user = get_object_or_404(Utilisateur, id_utilisateur=user_id)

    # Check category exists
    category = get_object_or_404(Categorie, id=category_id)

    # Relation does not exist
    if not user.categories_suivies.filter(id=category.id).exists():
        return Response(
            {
                "message": "Cette catégorie n'est pas suivie par l'utilisateur",
                "user_id": user.id_utilisateur,
                "category_id": category.id
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # Remove relation
    user.categories_suivies.remove(category)

    return Response(
        {
            "message": "Catégorie supprimée des catégories suivies",
            "user_id": user.id_utilisateur,
            "category_id": category.id
        },
        status=status.HTTP_200_OK
    )