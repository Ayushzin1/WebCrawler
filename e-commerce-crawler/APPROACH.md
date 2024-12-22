# E-commerce Product Crawler: Approach Documentation

## Overview

The E-commerce Product Crawler is designed to efficiently discover and extract product URLs from various e-commerce websites. It uses a combination of asynchronous programming, browser automation, and intelligent parsing to navigate through web pages and identify product links.

## Key Components

1. **Asynchronous Crawler (crawler.py)**
   - Utilizes `asyncio` for concurrent crawling
   - Implements rate limiting and respects `robots.txt`
   - Handles pagination and infinite scrolling

2. **HTML Parser (parser.py)**
   - Extracts links and identifies potential product URLs
   - Utilizes BeautifulSoup for efficient HTML parsing

3. **Utility Functions (utils.py)**
   - URL normalization and validation
   - Product URL pattern matching
   - Domain-specific helper functions

4. **Main Script (main.py)**
   - Orchestrates the crawling process
   - Manages browser instances using Playwright

## Crawling Process

1. **Initialization**
   - Create a browser context with Playwright
   - Initialize the `EcommerceCrawler` with target domains

2. **Domain Crawling**
   - For each domain, start with the homepage
   - Extract and follow links that match product patterns
   - Handle pagination and infinite scrolling

3. **URL Processing**
   - Normalize discovered URLs
   - Check against `robots.txt` rules
   - Validate as product URLs using predefined patterns

4. **Data Collection**
   - Store unique product URLs for each domain
   - Handle retries and errors gracefully

5. **Result Generation**
   - Compile discovered product URLs into a structured format
   - Output results to `discovered_products.json`

## Output Structure

The discovered product URLs are stored in a JSON format, where each domain is mapped to an array of unique product URLs:

```json
{
  "domain1.com": [
    "https://domain1.com/product1",
    "https://domain1.com/product2",
    ...
  ],
  "domain2.com": [
    "https://domain2.com/item1",
    "https://domain2.com/item2",
    ...
  ]
}

