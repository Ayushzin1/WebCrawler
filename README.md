# E-commerce Product Crawler

This project consists of two main components:
1. A Python-based web crawler for e-commerce product pages
2. A Next.js frontend for interacting with the crawler and visualizing results

## Python Crawler

The Python crawler is designed to crawl e-commerce websites and extract product information. It uses asyncio for concurrent crawling and Playwright for browser automation.

### Key Features

- Asynchronous crawling with configurable concurrency
- Respects robots.txt rules
- Handles infinite scrolling
- Retries on failures
- Extracts product URLs

### Files

- `crawler.py`: Main crawler logic
- `parser.py`: HTML parsing utilities
- `utils.py`: Helper functions
- `main.py`: Entry point for running the crawler

### Setup

1. Install Python 3.7+
2. Install dependencies:
   \`\`\`
   pip install asyncio beautifulsoup4 playwright
   \`\`\`
3. Install Playwright browsers:
   \`\`\`
   playwright install
   \`\`\`

### Usage

Run the crawler:

\`\`\`
python main.py
\`\`\`

The results will be saved in \`results.json\`.

## Next.js Frontend

The frontend provides a user interface for interacting with the crawler and visualizing the results.

### Key Features

- Add and remove URLs to crawl
- Start crawling process
- View crawl results and statistics
- Responsive design

### Files

- \`app/page.tsx\`: Main page component
- \`components/CrawlerDashboard.tsx\`: Main dashboard component
- \`components/UrlInput.tsx\`: URL input and management
- \`components/CrawlResults.tsx\`: Display crawl results
- \`components/CrawlerStats.tsx\`: Display crawl statistics
- \`lib/crawler.ts\`: Simulated crawler logic for frontend
- \`lib/utils.ts\`: Utility functions
- \`lib/types.ts\`: TypeScript type definitions

### Setup

1. Install Node.js 14+
2. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

### Usage

Run the development server:

\`\`\`
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Integration

Currently, the Python crawler and Next.js frontend are not directly integrated. To use them together:

1. Run the Python crawler to generate \`results.json\`
2. Implement an API endpoint in the Next.js app to read and serve the \`results.json\` file
3. Update the frontend to fetch data from this API endpoint instead of using the simulated crawler

## Future Improvements

- Integrate the Python crawler with the Next.js frontend
- Add more detailed product information extraction
- Implement data storage (e.g., database) for crawled results
- Add user authentication and multi-user support
- Improve error handling and reporting

## License

This project is licensed under the MIT License.
