from .rss import read_rss_feeds
from .utils import filter_new_articles, filter_new_categories, save_articles_to_database, save_categories_to_database, save_vulnerabilites_to_database
from .articles import scrape_rss_feeds_articles, summarize_articles
from .vulnerability import extract_vulnerabilities
from backend.faiss_service import faiss_service
import logging

# Configure basic logging to the console
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def launch_web_scrapping():
    

    logging.info("Scheduled Scraping")

    # Extracting vulnerabilities from NVD API
    logging.info("Extracting Vulnerabilities from NVD API")
    vulnerabilities = extract_vulnerabilities()
    save_vulnerabilites_to_database(vulnerabilities)
    logging.info("Done extracting Vulnerabilities from NVD API")

    # Read RSS feeds and filter new articles
    rss_items = read_rss_feeds()
    new_articles = filter_new_articles(rss_items)

    if not new_articles:
        logging.warning("No new articles found. Exiting.")
        return

    # Scrape the articles
    scrapped_articles = scrape_rss_feeds_articles(new_articles)

    unique_articles = []
    all_categories = []

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
        summarized_articles = summarize_articles(unique_articles)
        # Save unique articles to database
        save_articles_to_database(summarized_articles)

        # Save FAISS index once after all additions
        faiss_service.save_index()

    logging.info(f"Web scraping finished. Total unique articles added: {len(summarized_articles)}")