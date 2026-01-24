"""
Vues API pour la génération de rapports
"""
from django.http import HttpResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
import logging

from ..reports_service import ReportGenerator

logger = logging.getLogger(__name__)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def generate_articles_pdf(request):
    """
    Génère un rapport PDF des articles
    Query params: ?days=30 (par défaut 30 jours)
    """
    try:
        days = int(request.query_params.get('days', 30))
        if days < 1 or days > 365:
            days = 30
        
        buffer = ReportGenerator.generate_articles_pdf(days=days)
        
        response = HttpResponse(
            buffer.getvalue(),
            content_type='application/pdf'
        )
        response['Content-Disposition'] = f'attachment; filename="rapport_articles_{days}j.pdf"'
        
        logger.info(f"Rapport PDF articles généré par {request.user}")
        return response
    
    except Exception as e:
        logger.error(f"Erreur lors de la génération du rapport articles PDF: {str(e)}")
        return Response(
            {"error": "Erreur lors de la génération du rapport"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def generate_vulnerabilities_pdf(request):
    """
    Génère un rapport PDF des vulnérabilités
    Query params: ?days=30 (par défaut 30 jours)
    """
    try:
        days = int(request.query_params.get('days', 30))
        if days < 1 or days > 365:
            days = 30
        
        buffer = ReportGenerator.generate_vulnerabilities_pdf(days=days)
        
        response = HttpResponse(
            buffer.getvalue(),
            content_type='application/pdf'
        )
        response['Content-Disposition'] = f'attachment; filename="rapport_vulnerabilites_{days}j.pdf"'
        
        logger.info(f"Rapport PDF vulnérabilités généré par {request.user}")
        return response
    
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        logger.error(f"Erreur lors de la génération du rapport vulnérabilités PDF: {str(e)}\n{error_details}")
        return Response(
            {"error": f"Erreur: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
#@permission_classes([IsAuthenticated])
def generate_articles_excel(request):
    """
    Génère un rapport Excel des articles
    Query params: ?days=30 (par défaut 30 jours)
    """
    try:
        days = int(request.query_params.get('days', 30))
        if days < 1 or days > 365:
            days = 30
        
        buffer = ReportGenerator.generate_articles_excel(days=days)
        
        response = HttpResponse(
            buffer.getvalue(),
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response['Content-Disposition'] = f'attachment; filename="rapport_articles_{days}j.xlsx"'
        
        logger.info(f"Rapport Excel articles généré par {request.user}")
        return response
    
    except Exception as e:
        logger.error(f"Erreur lors de la génération du rapport articles Excel: {str(e)}")
        return Response(
            {"error": "Erreur lors de la génération du rapport"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def generate_vulnerabilities_excel(request):
    """
    Génère un rapport Excel des vulnérabilités
    Query params: ?days=30 (par défaut 30 jours)
    """
    try:
        days = int(request.query_params.get('days', 30))
        if days < 1 or days > 365:
            days = 30
        
        buffer = ReportGenerator.generate_vulnerabilities_excel(days=days)
        
        response = HttpResponse(
            buffer.getvalue(),
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response['Content-Disposition'] = f'attachment; filename="rapport_vulnerabilites_{days}j.xlsx"'
        
        logger.info(f"Rapport Excel vulnérabilités généré par {request.user}")
        return response
    
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        logger.error(f"Erreur lors de la génération du rapport vulnérabilités Excel: {str(e)}\n{error_details}")
        return Response(
            {"error": f"Erreur: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def generate_comprehensive_report(request):
    """
    Génère un rapport complet PDF
    Query params: ?days=30 (par défaut 30 jours)
    """
    try:
        days = int(request.query_params.get('days', 30))
        if days < 1 or days > 365:
            days = 30
        
        buffer = ReportGenerator.generate_comprehensive_report_pdf(days=days)
        
        response = HttpResponse(
            buffer.getvalue(),
            content_type='application/pdf'
        )
        response['Content-Disposition'] = f'attachment; filename="rapport_complet_{days}j.pdf"'
        
        logger.info(f"Rapport complet généré par {request.user}")
        return response
    
    except Exception as e:
        logger.error(f"Erreur lors de la génération du rapport complet: {str(e)}")
        return Response(
            {"error": "Erreur lors de la génération du rapport"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
