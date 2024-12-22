from bs4 import BeautifulSoup
from urllib.parse import urljoin
from utils import is_product_url
import logging

logger = logging.getLogger(__name__)

def extract_product_urls(soup, base_url):
    urls = set()
    for a in soup.find_all('a', href=True):
        url = urljoin(base_url, a['href'])
        if is_product_url(url):
            urls.add(url)
            logger.debug(f"Extracted product URL: {url}")
        else:
            logger.debug(f"Non-product URL found: {url}")
    return urls

