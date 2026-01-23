from bs4 import BeautifulSoup
from urllib.parse import urljoin
import requests, bleach
from readability import Document
import logging
import os
from dotenv import load_dotenv
import time

load_dotenv()

# Configure basic logging to the console
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

headers = {
    "User-Agent": "Mozilla/5.0 (Android 4.4; Mobile; rv:41.0) Gecko/41.0 Firefox/41.0",
}

ALLOWED_TAGS = {
    "h1", "h2", "h3", "h4", "h5", "h6",
    "p", "span", "strong", "b", "em", "ul", "ol", "li", "br", "a"
}

def extract_article_thumbnail(article_url: str, article_html: str):
    images = article_html.find_all("img")

    for img in images:
        src = img.get("src")
        width = img.get("width")
        height = img.get("height")

        if not src:
            continue

        # skip icons / tracking pixels
        if width and height:
            if int(width) < 100 or int(height) < 100:
                continue

        image_url = urljoin(article_url, src)
        return image_url
    
    return None


def scrape_article(article: object):
    response = requests.get(
        article['link'],
        timeout=10,
        headers=headers
    )

    response.raise_for_status()

    html = response.text

    soup = BeautifulSoup(html, "html.parser")
    og = lambda p: soup.find("meta", property=p)
    
    # extract article thumbnail
    article["thumbnail"] = og("og:image")["content"] if og("og:image") else None

    # content extraction
    doc = Document(html)
    article_html = doc.summary()

    article_soup = BeautifulSoup(article_html, "html.parser")

    clean_html = bleach.clean(
        str(article_soup),
        tags=[
            "h1","h2","h3","h4","h5","h6",
            "p","span","strong","b","em",
            "ul","ol","li","br","blockquote"
        ],
        strip=True
    )

    article["content"] = clean_html
    return article

def scrape_rss_feeds_articles(articles):
    logging.info(f"Started Article Scrapping: {len(articles)}")
    scrapped_articles = []

    for article in articles:
        try:
            article = scrape_article(article)
            scrapped_articles.append(article)

        except Exception:
            logging.warning(f"Exception reading {article['link']}")

    logging.info("Artcile Scrapping is Done")
    return scrapped_articles

# LLM_BASE_URL = os.getenv("LLM_API_URL")
# POLL_INTERVAL = 35  # seconds
# MAX_WAIT_TIME = 4 * 60 * 60  # 4 hours

# def submit_summarization_job(articles):
#     payload = {
#         "articles": [
#             {
#                 "title": article["title"],
#                 "content": article["content"]
#             }
#             for article in articles
#         ]
#     }

#     logging.info("Submitting summarization job to LLM")

#     response = requests.post(
#         f"{LLM_BASE_URL}/summarize/submit",
#         json=payload,
#         timeout=100
#     )
#     response.raise_for_status()

#     job_id = response.json()["job_id"]
#     logging.info(f"Summarization job submitted. job_id={job_id}")

#     return job_id


# def wait_for_job_completion(job_id):
#     start_time = time.time()

#     while True:
#         elapsed = time.time() - start_time
#         if elapsed > MAX_WAIT_TIME:
#             raise TimeoutError("Summarization job timed out")

#         response = requests.get(
#             f"{LLM_BASE_URL}/summarize/status/{job_id}",
#             timeout=30
#         )
#         response.raise_for_status()

#         job = response.json()
#         status = job.get("status")

#         if status == "completed":
#             return job.get("results", [])

#         if status == "failed":
#             raise RuntimeError(job.get("error", "Unknown error"))

#         time.sleep(POLL_INTERVAL)


# # def send_request_to_LLM(request_body):
# #     url = "https://8391528ca33a.ngrok-free.app/summarize"

# #     logging.info("Request sent to LLM to generate summaries")
# #     response = requests.post(
# #         url,
# #         json=request_body
# #     )

# #     response.raise_for_status()
# #     result = response.json()

# #     return result.get("results", [])

# def summarize_articles(articles):
#     if not articles:
#         return []

#     try:
#         # Submit job
#         job_id = submit_summarization_job(articles)

#         # Wait asynchronously (polling)
#         results = wait_for_job_completion(job_id)

#         # Merge summaries back
#         for item in results:
#             idx = item["index"]
#             summary = item.get("summary")

#             if summary:
#                 articles[idx]["summary"] = summary

#         logging.info("Generated articles' summaries successfully")
#         return articles

#     except Exception as e:
#         logging.warning(f"Couldn't generate summaries: {e}")
#         return []


LLM_BASE_URL = os.getenv("LLM_API_URL")
POLL_INTERVAL = 40  # seconds
MAX_WAIT_TIME = 4 * 60 * 60  # 4 hours
BATCH_SIZE = 2  # Reduce batch size to avoid GPU OOM


def submit_summarization_job(batch_articles):
    payload = {
        "articles": [
            {"title": a["title"], "content": a["content"]} 
            for a in batch_articles
        ]
    }

    logging.info(f"Submitting batch of {len(batch_articles)} articles to LLM")

    response = requests.post(
        f"{LLM_BASE_URL}/summarize/submit",
        json=payload,
        timeout=30  # short timeout to just submit job
    )
    response.raise_for_status()

    job_id = response.json()["job_id"]
    logging.info(f"Batch submitted with job_id={job_id}")
    return job_id


def wait_for_job_completion(job_id):
    start_time = time.time()
    while True:
        elapsed = time.time() - start_time
        if elapsed > MAX_WAIT_TIME:
            raise TimeoutError("Summarization job timed out")

        response = requests.get(
            f"{LLM_BASE_URL}/summarize/status/{job_id}",
            timeout=30
        )
        response.raise_for_status()
        job = response.json()
        status = job.get("status")

        logging.info(f"Job {job_id} status: {status}")

        if status == "completed":
            return job.get("results", [])
        if status == "failed":
            raise RuntimeError(job.get("error", "Unknown error"))

        time.sleep(POLL_INTERVAL)


def summarize_articles(articles):
    """Summarize articles in batches, continue on batch failure."""
    if not articles:
        return []

    summarized_articles = []

    for i in range(0, len(articles), BATCH_SIZE):
        batch = articles[i:i + BATCH_SIZE]
        try:
            # Submit batch
            job_id = submit_summarization_job(batch)
            results = wait_for_job_completion(job_id)

            # Merge results into original articles list
            for item in results:
                idx = i + item["index"]  # global index
                summary = item.get("summary")
                if summary:
                    articles[idx]['summary'] = summary
                    summarized_articles.append(articles[idx])

            logging.info(f"Batch {i//BATCH_SIZE + 1} completed successfully")

        except Exception as e:
            # Log batch failure and continue with next batch
            logging.warning(f"Batch {i//BATCH_SIZE + 1} failed: {e}")

    logging.info(f"Summarization done: {len(summarized_articles)} articles processed")
    return summarized_articles
