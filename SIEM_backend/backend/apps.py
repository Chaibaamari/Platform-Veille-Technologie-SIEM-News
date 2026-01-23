from django.apps import AppConfig
import logging

logger = logging.getLogger(__name__)

class BackendConfig(AppConfig):
    name = 'backend'

    def ready(self):
        from .faiss_service import FaissService

        FaissService()
        logger.info("FAISS service initialized at Django startup")