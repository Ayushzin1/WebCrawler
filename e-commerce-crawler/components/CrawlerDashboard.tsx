'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Loader2 } from 'lucide-react'
import UrlInput from './UrlInput'
import CrawlResults from './CrawlResults'
import { CrawlerStats } from './CrawlerStats'
import { processUrls } from '@/lib/crawler'
import type { CrawlResult } from '@/lib/types'

export default function CrawlerDashboard() {
  const [urls, setUrls] = useState<string[]>([])
  const [results, setResults] = useState<CrawlResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAddUrl = (url: string) => {
    if (!urls.includes(url)) {
      setUrls([...urls, url])
      setError(null)
    }
  }

  const handleRemoveUrl = (urlToRemove: string) => {
    setUrls(urls.filter(url => url !== urlToRemove))
  }

  const handleCrawl = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const crawlResults = await processUrls(urls)
      setResults(crawlResults)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while crawling')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-7xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>E-commerce Product Crawler</CardTitle>
          <CardDescription>
            Add product URLs to discover related products and generate insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="input" className="space-y-4">
            <TabsList>
              <TabsTrigger value="input">URL Input</TabsTrigger>
              <TabsTrigger value="results" disabled={!results}>Results</TabsTrigger>
              <TabsTrigger value="stats" disabled={!results}>Statistics</TabsTrigger>
            </TabsList>

            <TabsContent value="input" className="space-y-4">
              <UrlInput 
                onAddUrl={handleAddUrl}
                onRemoveUrl={handleRemoveUrl}
                urls={urls}
                onCrawl={handleCrawl}
                isLoading={isLoading}
              />
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </TabsContent>

            <TabsContent value="results">
              {results && <CrawlResults results={results} />}
            </TabsContent>

            <TabsContent value="stats">
              {results && <CrawlerStats results={results} />}
            </TabsContent>
          </Tabs>

          {isLoading && (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

