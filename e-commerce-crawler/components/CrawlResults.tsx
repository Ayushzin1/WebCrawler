import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent } from '@/components/ui/card'
import type { CrawlResult } from '@/lib/types'

interface CrawlResultsProps {
  results: CrawlResult
}

export default function CrawlResults({ results }: CrawlResultsProps) {
  return (
    <ScrollArea className="h-[500px] rounded-md">
      <div className="space-y-4 p-4">
        {Object.entries(results).map(([sourceUrl, relatedUrls]) => (
          <Card key={sourceUrl}>
            <CardContent className="p-4">
              <h3 className="font-semibold text-sm mb-2 break-all">{sourceUrl}</h3>
              <ul className="space-y-2">
                {relatedUrls.map((url, index) => (
                  <li key={index} className="text-sm text-muted-foreground break-all">
                    {url}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  )
}

