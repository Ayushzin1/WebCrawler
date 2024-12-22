import re
from urllib.parse import urlparse, urljoin
from urllib.robotparser import RobotFileParser
import logging

logger = logging.getLogger(__name__)

def is_product_url(url):
    patterns = [
        r'/product/',
        r'/item/',
        r'/p/',
        r'/products/',
        r'/shop/',
        r'/goods/',
        r'/catalog/',
        r'\.html$',  # Many product pages end with .html
        r'\d+$'  # URLs ending with numbers are often product pages
    ]
    return any(re.search(pattern, url, re.IGNORECASE) for pattern in patterns)

def normalize_url(url):
    parsed = urlparse(url)
    return f"{parsed.scheme}://{parsed.netloc}{parsed.path}"

def is_allowed_by_robots(domain, url):
    robots_url = f"https://{domain}/robots.txt"
    rp = RobotFileParser()
    rp.set_url(robots_url)
    try:
        rp.read()
        allowed = rp.can_fetch("*", url)
        if not allowed:
            logger.info(f"URL {url} is disallowed by robots.txt for {domain}")
        return allowed
    except Exception as e:
        logger.warning(f"Error reading robots.txt for {domain}: {str(e)}")
        return True  # Assume allowed if we can't read robots.txt

