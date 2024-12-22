import asyncio
from urllib.parse import urljoin, urlparse
from bs4 import BeautifulSoup
from playwright.async_api import Page, TimeoutError as PlaywrightTimeoutError
from utils import is_product_url, is_allowed_by_robots, normalize_url
from parser import extract_product_urls
import logging

class EcommerceCrawler:
    def __init__(self, domains, max_concurrent_requests=5, max_retries=3, delay=1):
        self.domains = domains
        self.max_concurrent_requests = max_concurrent_requests
        self.max_retries = max_retries
        self.delay = delay
        self.visited_urls = set()
        self.product_urls = {domain: set() for domain in domains}
        self.semaphore = asyncio.Semaphore(max_concurrent_requests)
        self.logger = logging.getLogger(__name__)

    async def crawl(self, browser):
        tasks = [self.crawl_domain(browser, domain) for domain in self.domains]
        await asyncio.gather(*tasks)

    async def crawl_domain(self, browser, domain):
        start_url = f"https://{domain}"
        async with self.semaphore:
            page = await browser.new_page()
            try:
                await self.crawl_url(page, start_url, domain)
            finally:
                await page.close()

    async def crawl_url(self, page: Page, url: str, domain: str):
        if url in self.visited_urls:
            self.logger.debug(f"Skipping already visited URL: {url}")
            return

        self.visited_urls.add(url)

        if not is_allowed_by_robots(domain, url):
            self.logger.info(f"Skipping {url} as per robots.txt")
            return

        for attempt in range(self.max_retries):
            try:
                self.logger.info(f"Crawling {url}")
                await page.goto(url, wait_until="networkidle", timeout=30000)
                
                # Scroll to handle infinite scrolling
                last_height = await page.evaluate("document.body.scrollHeight")
                scroll_attempts = 0
                while scroll_attempts < 3:  # Limit scroll attempts
                    await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
                    await page.wait_for_timeout(1000)
                    new_height = await page.evaluate("document.body.scrollHeight")
                    if new_height == last_height:
                        break
                    last_height = new_height
                    scroll_attempts += 1
                    self.logger.debug(f"Scrolled page, new height: {new_height}")

                content = await page.content()
                soup = BeautifulSoup(content, 'html.parser')
                
                self.logger.info(f"Retrieved content for {url}")

                if is_product_url(url):
                    self.product_urls[domain].add(normalize_url(url))
                    self.logger.info(f"Found product URL: {url}")
                
                new_urls = extract_product_urls(soup, url)
                self.logger.info(f"Found {len(new_urls)} new URLs to crawl from {url}")
                tasks = []
                for new_url in new_urls:
                    if urlparse(new_url).netloc == domain:
                        tasks.append(self.crawl_url(page, new_url, domain))
                
                await asyncio.gather(*tasks)
                break
            except PlaywrightTimeoutError:
                self.logger.warning(f"Timeout while loading {url}")
                if attempt < self.max_retries - 1:
                    await asyncio.sleep(self.delay * (attempt + 1))
                else:
                    return
            except Exception as e:
                self.logger.error(f"Error while crawling {url}: {str(e)}")
                if attempt < self.max_retries - 1:
                    await asyncio.sleep(self.delay * (attempt + 1))
                else:
                    return

        await asyncio.sleep(self.delay)
        self.logger.info(f"Finished crawling {url}")

    def get_results(self):
        return {domain: list(urls) for domain, urls in self.product_urls.items()}

