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
    # Extracting vulnerabilities from NVD API
    vulnerabilities = extract_vulnerabilities()
    update_progress('Vulnérabilités', 10, 'Extraction des vulnérabilités depuis le NVD')
    save_vulnerabilites_to_database(vulnerabilities)

    # Read RSS feeds and filter new articles
    update_progress("RSS", 20, "Lecture des flux RSS")
    rss_items = read_rss_feeds()
    new_articles = filter_new_articles(rss_items)

    if not new_articles:
        update_progress("Fait", 100, "Aucun nouvel article trouvé")
        logging.warning("No new articles found. Exiting.")
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
            continue  # skip empty content

        if not faiss_service.is_duplicate(article_content):
            unique_articles.append(article)
            faiss_service.add_article(article_content)
        else:
            logging.info("Duplicate article skipped:", article.get('title', 'No Title'))

        # Collect categories for later
        all_categories.extend(article.get('categories', []))

    if not unique_articles:
        logging.info("No unique articles to save.")
    else:
        # Filter and save new categories
        new_categories = filter_new_categories(all_categories)
        if new_categories:
            save_categories_to_database(new_categories)

        logging.info("summarization Scrapped Articles")
        # Summarize the articles
        update_progress("Résumé des articles", 80, f"Résumé des articles: {len(unique_articles)} Total")
        summarized_articles = summarize_articles(unique_articles)
        # Save unique articles to database
        save_articles_to_database(summarized_articles)

        # Save FAISS index once after all additions
        faiss_service.save_index()

    update_progress("Fait", 100, f"Veille terminée avec succès: {len(unique_articles)} Total")
    logging.info(f"Web scraping finished. Total unique articles added: {len(summarized_articles)}")