'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { X, Play } from 'lucide-react'
import { isValidProductUrl } from '@/lib/utils'

interface UrlInputProps {
  onAddUrl: (url: string) => void
  onRemoveUrl: (url: string) => void
  onCrawl: () => void
  urls: string[]
  isLoading: boolean
}

export default function UrlInput({ onAddUrl, onRemoveUrl, onCrawl, urls, isLoading }: UrlInputProps) {
  const [inputUrl, setInputUrl] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const url = inputUrl.trim()

    if (!url) {
      setError('Please enter a URL')
      return
    }

    if (!isValidProductUrl(url)) {
      setError('Please enter a valid product URL')
      return
    }

    onAddUrl(url)
    setInputUrl('')
    setError('')
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1">
          <Input
            type="url"
            placeholder="Enter product URL (e.g., https://www.example.com/products/123)"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            aria-label="Product URL"
          />
          {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        </div>
        <Button type="submit" disabled={isLoading}>Add URL</Button>
      </form>

      <ScrollArea className="h-[200px] rounded-md border p-4">
        <div className="space-y-2">
          {urls.map((url, index) => (
            <div key={index} className="flex items-center gap-2 group">
              <span className="flex-1 text-sm truncate" title={url}>
                {url}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemoveUrl(url)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove URL"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {urls.length === 0 && (
            <p className="text-sm text-muted-foreground text-center">
              No URLs added yet
            </p>
          )}
        </div>
      </ScrollArea>

      <div className="flex justify-end">
        <Button
          onClick={onCrawl}
          disabled={urls.length === 0 || isLoading}
          className="w-full sm:w-auto"
        >
          {isLoading ? (
            <>Processing...</>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Start Crawling
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

