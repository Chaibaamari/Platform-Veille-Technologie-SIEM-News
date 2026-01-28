import requests
from bs4 import BeautifulSoup
import xml.etree.ElementTree as ET
from email.utils import parsedate_to_datetime
import logging
from backend.models import Source

# Configure basic logging to the console
logger = logging.getLogger('backend')

namespaces = {'dc': 'http://purl.org/dc/elements/1.1/'}

def strip_html_tags(html_string):
    """Strips all HTML tags and returns plain text."""
    # Create a BeautifulSoup object and specify the parser
    soup = BeautifulSoup(html_string, "html.parser")
    # Get all text without the tags
    clean_text = soup.get_text(strip=True) # strip=True removes extra whitespace
    return clean_text

def extract_rss_item_categories(item: ET.Element):
    return [category.text for category in item.iter('category')]

def filter_rss_item_description(description: ET.Element | None):
    if description is None or description.text is None:
        return ""
    
    text = description.text.split('<p>Article URL:')[0].split('<p>Comments URL:')[0].strip()
    return strip_html_tags(text)

def parse_rss_pubdate(date_elem: ET.Element | None):
    if date_elem is None or not date_elem.text:
        return None
    try:
        return parsedate_to_datetime(date_elem.text)
    except Exception:
        return None
    
def parse_rss_item(
        item: ET.Element, 
        default_category = "",
        source = "Other"
    ):
    description = item.find('description')
    title = item.find('title')
    link = item.find('link')
    date_elem = item.find('pubDate')
    author_elem = item.find("dc:creator", namespaces)

    publication_date = parse_rss_pubdate(date_elem)
    #date_str = date_elem.text if date_elem is not None else ""
    #publication_date = datetime.strptime(date_str, "%a, %d %b %Y %H:%M:%S %z") if date_str else None

    categories = extract_rss_item_categories(item)
    if default_category and default_category not in categories:
        categories.insert(0, default_category)

    return {
        "title": title.text if title is not None else "",
        "description": filter_rss_item_description(description),
        "link": link.text if link is not None else "",
        "author": author_elem.text if author_elem is not None else "",
        "publication_date": publication_date.isoformat() if publication_date else None,
        "categories": categories,
        "source": source
    }

headers = {
    "User-Agent": "Mozilla/5.0 (Android 4.4; Mobile; rv:41.0) Gecko/41.0 Firefox/41.0",
    'Accept': 'application/rss+xml'
}

def read_feed(
        rss_url: str,
        source: str,
        category = ""
    ):
    response = requests.get(rss_url, headers=headers)
    response.raise_for_status()

    root = ET.fromstring(response.text)
    rss_articles = []

    for item in root.iter('item'):
        parsed = parse_rss_item(
            item, 
            default_category=category, 
            source=source
        )

        rss_articles.append(parsed)

    return rss_articles

def read_rss_feeds():

    logging.info("Reading RSS Source File")
    sources = Source.objects.all()

    articles = []
    for source in sources:

        if not source.active:
            continue
    
        url = source.flux_rss
        name = source.nom_source

        try:
            
            result = read_feed(
                url, 
                name
            )

            articles.extend(result)
        except Exception:
            logging.warning(f"Couldn't read RSS feed: {url}")

    logging.info(f"Reading RSS Feeds is Done: {len(sources)} Total")
    return articles