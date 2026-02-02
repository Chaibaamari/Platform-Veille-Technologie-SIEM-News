from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from backend.permissions import IsAnalyste
from backend.models import Article, Categorie

@api_view(["POST"])
@permission_classes([IsAuthenticated, IsAnalyste])
def api_update_article_categories(request, article_id):
    """
    Update the categories of an article to match the given list.
    Adds missing categories and removes categories not in the list.
    """
    data = request.data
    article_id = data.get("id_article")
    categories_ids = data.get("categories_ids")

    if not article_id:
        return Response({"message": "article_id est requis"}, status=status.HTTP_400_BAD_REQUEST)

    print(type(categories_ids))
    if not isinstance(categories_ids, list):
        return Response({"message": "categories_ids doit être une liste"}, status=status.HTTP_400_BAD_REQUEST)

    # Fetch article
    article = get_object_or_404(Article, id_article=article_id)

    # Fetch categories that exist
    categories = Categorie.objects.filter(id__in=categories_ids)
    found_ids = set(categories.values_list("id", flat=True))
    missing_ids = set(categories_ids) - found_ids

    if missing_ids:
        return Response(
            {
                "message": "Certaines catégories n'existent pas",
                "missing_category_ids": list(missing_ids),
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Current linked categories
    current_ids = set(article.categories.values_list("id", flat=True))

    # Categories to add
    to_add = [cat for cat in categories if cat.id not in current_ids]

    # Categories to remove
    to_remove = article.categories.filter(id__in=(current_ids - set(categories_ids)))

    # Update article
    if to_add:
        article.categories.add(*to_add)
    if to_remove.exists():
        article.categories.remove(*to_remove)

    return Response(
        {
            "message": "Catégories mises à jour avec succès",
            "article_id": article.id_article,
            "added_categories": [cat.id for cat in to_add],
            "removed_categories": list(to_remove.values_list("id", flat=True)),
            "already_linked": list(current_ids & set(categories_ids)),
        },
        status=status.HTTP_200_OK,
    )

@api_view(['DELETE'])
@permission_classes([IsAuthenticated, IsAnalyste])
def api_delete_article(request, article_id):
    """
    Delete an article by ID
    """
    article = get_object_or_404(Article, id_article=article_id)

    article.delete()

    return Response(
        {
            "message": "Article supprimé avec succès",
            "article_id": article_id
        },
        status=status.HTTP_200_OK
    )