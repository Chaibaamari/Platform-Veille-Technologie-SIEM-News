from threading import Thread
import logging
from .scraping_module import launch_web_scrapping  # your function
import json

# Global flag to indicate scraping status
is_scraping = False

def start_scraping_background():
    global is_scraping

    if is_scraping:
        logging.warning("Scraping already in progress. Skipping this request.")
        return False  # indicate it was already running

    def wrapper():
        global is_scraping
        is_scraping = True
        try:
            launch_web_scrapping()
        finally:
            is_scraping = False

    thread = Thread(target=wrapper, daemon=True)
    thread.start()
    logging.info("Scraping started in the background")
    return True  # indicate scraping started successfully
