from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from backend.permissions import IsVeilleur
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from backend.models import Source
from backend.web_scrapper.scraping_runner import start_scraping_background
from .utils import paginate_queryset

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsVeilleur])
# endpoing to trigger the scrapping
def api_start_scrapping(request):
    started = start_scraping_background()
    if started:
        return JsonResponse({'status': 'success', 'message': 'Scraping started in background'})
    else:
        return JsonResponse({'status': 'error', 'message': 'Scraping already running'})
    

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsVeilleur])
def api_list_sources(request):
    sources = Source.objects.all().order_by('nom_source')

    paginated = paginate_queryset(sources, request, page_size=10)

    sources_data = []
    for source in paginated['items']:
        sources_data.append({
            'id': source.id_source,
            'nom_source': source.nom_source,
            'flux_rss': source.flux_rss,
        })

    return JsonResponse({
        'pagination': paginated['pagination'],
        'sources': sources_data
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsVeilleur])
def api_add_source(request):
    try:
        data = request.data

        nom_source = data.get('nom_source')
        flux_rss = data.get('flux_rss')

        if not nom_source:
            raise KeyError("nom_source")
        if not flux_rss:
            raise KeyError("flux_rss")

        source = Source.objects.create(
            nom_source=nom_source,
            flux_rss=flux_rss
        )

        return JsonResponse({
            'message': 'Source ajoutée avec succès',
            'source': {
                'id': source.id_source,
                'nom_source': source.nom_source,
                'flux_rss': source.flux_rss
            }
        }, status=201)

    except KeyError as e:
        return JsonResponse({
            'status': 'error',
            'message': f'Champ manquant: {str(e)}'
        }, status=400)

    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=400)

from django.shortcuts import get_object_or_404

@api_view(['DELETE'])
@permission_classes([IsAuthenticated, IsVeilleur])
def api_delete_source(request, source_id):
    source = get_object_or_404(Source, id_source=source_id)

    source.delete()

    return JsonResponse({
        'message': 'Source supprimée avec succès'
    }, status=200)