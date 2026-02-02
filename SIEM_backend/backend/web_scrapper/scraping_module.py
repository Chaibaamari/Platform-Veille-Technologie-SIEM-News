from .rss import read_rss_feeds
from .utils import filter_new_articles, filter_new_categories, save_articles_to_database, save_categories_to_database, save_vulnerabilites_to_database
from .articles import scrape_rss_feeds_articles, summarize_articles
from .vulnerability import extract_vulnerabilities
from backend.faiss_service import faiss_service
import logging

# Configure basic logging to the console
logger = logging.getLogger('backend')

scraping_progress = {
    "is_running": False,
    "percentage": 0,
    "message": "",
    "step": ""
}

def update_progress(step="", percentage=0, message=""):
    scraping_progress["step"] = step
    scraping_progress["percentage"] = percentage
    scraping_progress["message"] = message


def launch_web_scrapping():
    update_progress('Démarrage...', 0, 'La veille a démarré')
    logging.info("Scheduled Scraping")
    
    # Listes pour suivre les nouveaux éléments
    new_vulnerabilities_ids = []
    new_articles_ids = []
    
    # Extracting vulnerabilities from NVD API
    try:
        vulnerabilities = extract_vulnerabilities()
        update_progress('Vulnérabilités', 10, 'Extraction des vulnérabilités depuis le NVD')
        
        # Sauvegarder et récupérer les CVE IDs des nouvelles vulnérabilités
        new_vulnerabilities_ids = save_vulnerabilites_to_database(vulnerabilities)
        logging.info(f"Nouvelles vulnérabilités trouvées: {len(new_vulnerabilities_ids)}")
    except Exception as e:
        logging.error(f"Erreur lors de l'extraction des vulnérabilités: {str(e)}")
    
    # Read RSS feeds and filter new articles
    update_progress("RSS", 20, "Lecture des flux RSS")
    rss_items = read_rss_feeds()
    new_articles = filter_new_articles(rss_items)
    
    if not new_articles:
        update_progress("RSS", 50, "Aucun nouvel article trouvé")
        logging.warning("No new articles found.")
        
        # Envoyer quand même notification si nouvelles vulnérabilités
        if new_vulnerabilities_ids:
            update_progress("Notifications", 90, "Envoi des notifications")
            try:
                from backend.web_scrapper.utils import send_scraping_notifications_to_all_users
                result = send_scraping_notifications_to_all_users(new_vulnerabilities_ids, [])
                logging.info(f"Notifications envoyées: {result['sent']}/{result['total']}")
            except Exception as e:
                logging.error(f"Erreur lors de l'envoi des notifications: {str(e)}")
        
        update_progress("Fait", 100, "Veille terminée - Aucun nouvel article")
        return
    
    # Scrape the articles
    update_progress("Collecte des articles", 30, f"Collecte des articles: {len(new_articles)} Total")
    scrapped_articles = scrape_rss_feeds_articles(new_articles)
    
    unique_articles = []
    all_categories = []
    update_progress("Suppression des doublons", 50, "Détection et suppression des doublons")
    
    # Check duplicates with FAISS and add new articles
    for article in scrapped_articles:
        article_content = article.get('content', '').strip()
        if not article_content:
            continue
        
        if not faiss_service.is_duplicate(article_content):
            unique_articles.append(article)
            faiss_service.add_article(article_content)
        else:
            logging.info(f"Duplicate article skipped: {article.get('title', 'No Title')}")
        
        all_categories.extend(article.get('categories', []))
    
    if not unique_articles:
        logging.info("No unique articles to save.")
        
        # Envoyer notification si nouvelles vulnérabilités
        if new_vulnerabilities_ids:
            update_progress("Notifications", 90, "Envoi des notifications")
            try:
                from backend.web_scrapper.utils import send_scraping_notifications_to_all_users
                result = send_scraping_notifications_to_all_users(new_vulnerabilities_ids, [])
                logging.info(f"Notifications envoyées: {result['sent']}/{result['total']}")
            except Exception as e:
                logging.error(f"Erreur lors de l'envoi des notifications: {str(e)}")
        
        update_progress("Fait", 100, "Veille terminée - Tous les articles étaient des doublons")
        return
    
    # Filter and save new categories
    new_categories = filter_new_categories(all_categories)
    if new_categories:
        save_categories_to_database(new_categories)
        logging.info(f"Nouvelles catégories sauvegardées: {len(new_categories)}")
    
    # Summarize the articles
    logging.info("Summarization of scrapped articles")
    update_progress("Résumé des articles", 70, f"Résumé des articles: {len(unique_articles)} Total")
    
    try:
        summarized_articles = summarize_articles(unique_articles)
    except Exception as e:
        logging.error(f"Erreur lors du résumé des articles: {str(e)}")
        summarized_articles = unique_articles  # Fallback aux articles non résumés
    
    # Save unique articles to database and get their IDs
    update_progress("Sauvegarde des articles", 80, f"Sauvegarde de {len(summarized_articles)} articles")
    new_articles_ids = save_articles_to_database(summarized_articles)
    
    # Save FAISS index once after all additions
    try:
        faiss_service.save_index()
        logging.info("Index FAISS sauvegardé avec succès")
    except Exception as e:
        logging.error(f"Erreur lors de la sauvegarde de l'index FAISS: {str(e)}")
    
    update_progress("Veille terminée", 90, f"Veille terminée: {len(new_articles_ids)} articles ajoutés")
    logging.info(f"Web scraping finished. Total unique articles added: {len(new_articles_ids)}")
    
    # Envoyer les notifications par email
    if new_vulnerabilities_ids or new_articles_ids:
        update_progress("Notifications", 95, "Envoi des notifications par email")
        try:
            from backend.web_scrapper.utils import send_scraping_notifications_to_all_users
            result = send_scraping_notifications_to_all_users(new_vulnerabilities_ids, new_articles_ids)
            logging.info(f"Notifications email - Envoyées: {result['sent']}/{result['total']} (Échecs: {result['failed']})")
        except Exception as e:
            logging.error(f"Erreur lors de l'envoi des notifications: {str(e)}")
    else:
        logging.info("Aucune notification à envoyer (pas de nouveau contenu)")
    
    update_progress("Terminé", 100, f"Veille et notifications terminées - {len(new_articles_ids)} articles, {len(new_vulnerabilities_ids)} vulnérabilités")