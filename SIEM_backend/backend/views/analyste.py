from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from backend.permissions import IsAnalyste
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from backend.models import Article, Categorie


@api_view(["POST"])
@permission_classes([IsAuthenticated, IsAnalyste])
def api_add_categories_to_article(request):
    data = request.data

    article_id = data.get('article_id')
    categories_ids = data.get('categories_ids')

    if not article_id:
        return Response(
            {"message": "article_id est requis"},
            status=status.HTTP_400_BAD_REQUEST
        )

    if not isinstance(categories_ids, list) or not categories_ids:
        return Response(
            {"message": "categories_ids doit être une liste non vide"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Check article exists
    article = get_object_or_404(Article, id_article=article_id)

    # Fetch categories that exist
    categories = Categorie.objects.filter(id__in=categories_ids)

    if not categories.exists():
        return Response(
            {"message": "Aucune catégorie valide trouvée"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Detect missing category IDs
    found_ids = set(categories.values_list('id', flat=True))
    missing_ids = set(categories_ids) - found_ids

    if missing_ids:
        return Response(
            {
                "message": "Certaines catégories n'existent pas",
                "missing_category_ids": list(missing_ids)
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # Add only categories not already linked
    existing_ids = set(
        article.categories.values_list('id', flat=True)
    )

    to_add = [cat for cat in categories if cat.id not in existing_ids]

    if to_add:
        article.categories.add(*to_add)

    return Response(
        {
            "message": "Catégories associées avec succès",
            "article_id": article.id_article,
            "added_categories": [cat.id for cat in to_add],
            "already_linked": list(existing_ids & set(categories_ids))
        },
        status=status.HTTP_200_OK
    )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_remove_category_from_article(request):
    data = request.data

    article_id = data.get('article_id')
    category_id = data.get('category_id')

    if not article_id:
        return Response(
            {"message": "article_id est requis"},
            status=status.HTTP_400_BAD_REQUEST
        )

    if not category_id:
        return Response(
            {"message": "category_id est requis"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Check article exists
    article = get_object_or_404(Article, id_article=article_id)

    # Check category exists
    category = get_object_or_404(Categorie, id=category_id)

    # If relation does not exist
    if not article.categories.filter(id=category.id).exists():
        return Response(
            {
                "message": "Cette catégorie n'est pas associée à l'article",
                "article_id": article.id_article,
                "category_id": category.id
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # Remove relation
    article.categories.remove(category)

    return Response(
        {
            "message": "Catégorie supprimée de l'article avec succès",
            "article_id": article.id_article,
            "category_id": category.id
        },
        status=status.HTTP_200_OK
    )