import { normalizeUrl, getProductId, getMarketplace } from './utils'
import type { CrawlResult } from './types'

export async function processUrls(urls: string[]): Promise<CrawlResult> {
  const results: CrawlResult = {}

  for (const url of urls) {
    const normalizedUrl = normalizeUrl(url)
    results[normalizedUrl] = await generateRelatedUrls(normalizedUrl)
  }

  return results
}

async function generateRelatedUrls(url: string): Promise<string[]> {
  try {
    const urlObj = new URL(url)
    const productId = getProductId(url)
    const marketplace = getMarketplace(url)
    const baseUrl = urlObj.origin

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    switch (marketplace) {
      case 'amazon':
        return [
          // Related product variant
          `${baseUrl}/dp/${productId}?th=2`,
          // Reviews page
          `${baseUrl}/product-reviews/${productId}`,
          // Related products
          `${baseUrl}/gp/product/ajax/related/${productId}`
        ]
      
      case 'flipkart':
        return [
          // Related product variant
          `${baseUrl}${urlObj.pathname.replace(/\/p\//, '/product-variant/p/')}`,
          // Reviews page
          `${baseUrl}${urlObj.pathname.replace(/\/p\//, '/reviews/p/')}`,
          // Accessories page
          `${baseUrl}${urlObj.pathname.replace(/\/p\/[^/]+$/, '/accessories/c/' + productId)}`
        ]
      
      default:
        // Generic product related URLs
        return [
          `${baseUrl}/products/${productId}/variant`,
          `${baseUrl}/products/${productId}/reviews`,
          `${baseUrl}/products/${productId}/related`
        ]
    }
  } catch (error) {
    console.error('Error generating related URLs:', error)
    return []
  }
}

