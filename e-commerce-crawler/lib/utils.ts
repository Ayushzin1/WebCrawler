export function isValidProductUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)
    // Match both Amazon and Flipkart URL patterns
    return (
      urlObj.pathname.includes('/dp/') || // Amazon pattern
      urlObj.pathname.includes('/p/') ||  // Flipkart pattern
      urlObj.pathname.includes('/product/') // Generic pattern
    )
  } catch {
    return false
  }
}

export function normalizeUrl(url: string): string {
  try {
    const urlObj = new URL(url)
    // Remove tracking parameters and clean up the URL
    const cleanUrl = new URL(url)
    
    // Remove common tracking parameters
    const paramsToRemove = [
      'ref', 'tag', 'linkCode', 'dib', 'keywords',
      'pf_rd_r', 'pf_rd_p', 'pf_rd_s', 'pf_rd_t',
      'sr', 'qid', 'th', 'psc'
    ]
    
    paramsToRemove.forEach(param => {
      cleanUrl.searchParams.delete(param)
    })
    
    return cleanUrl.toString().replace(/([^:]\/)\/+/g, "$1")
  } catch {
    return url
  }
}

export function getProductId(url: string): string {
  try {
    const urlObj = new URL(url)
    
    // Extract product ID from Amazon URL
    if (urlObj.hostname.includes('amazon')) {
      const dpMatch = urlObj.pathname.match(/\/dp\/([A-Z0-9]+)/)
      if (dpMatch) return dpMatch[1]
    }
    
    // Extract product ID from Flipkart URL
    if (urlObj.hostname.includes('flipkart')) {
      const pidParam = urlObj.searchParams.get('pid')
      if (pidParam) return pidParam
      
      const pMatch = urlObj.pathname.match(/\/p\/([a-zA-Z0-9]+)/)
      if (pMatch) return pMatch[1]
    }
    
    // Generic product ID extraction
    const pathParts = urlObj.pathname.split('/')
    return pathParts[pathParts.length - 1]
  } catch {
    return ''
  }
}

export function getMarketplace(url: string): 'amazon' | 'flipkart' | 'unknown' {
  try {
    const urlObj = new URL(url)
    if (urlObj.hostname.includes('amazon')) return 'amazon'
    if (urlObj.hostname.includes('flipkart')) return 'flipkart'
    return 'unknown'
  } catch {
    return 'unknown'
  }
}

