import asyncio
import json
from crawler import EcommerceCrawler
from playwright.async_api import async_playwright
import logging

async def main(domains):
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
    logger = logging.getLogger(__name__)

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        )
        try:
            crawler = EcommerceCrawler(domains)
            await crawler.crawl(context)
            results = crawler.get_results()
            
            logger.info("Crawling completed. Writing results to file.")
            with open('results.json', 'w') as f:
                json.dump(results, f, indent=2)
            
            logger.info("Results written to results.json")
        finally:
            await context.close()
            await browser.close()

if __name__ == "__main__":
    domains = [
        "www.amazon.com",
        "www.etsy.com",
        "www.ebay.com"
    ]
    asyncio.run(main(domains))

