from threading import Thread
import logging
from .scraping_module import launch_web_scrapping, scraping_progress

# Global flag to indicate scraping status
is_scraping = False

def start_scraping_background():
    global is_scraping

    if is_scraping:
        return False

    def wrapper():
        global is_scraping
        is_scraping = True
        scraping_progress["is_running"] = True

        try:
            launch_web_scrapping()
        finally:
            scraping_progress["is_running"] = False
            is_scraping = False

    Thread(target=wrapper, daemon=True).start()
    return True

