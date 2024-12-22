import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { CrawlResult } from '@/lib/types'

interface CrawlerStatsProps {
  results: CrawlResult
}

export function CrawlerStats({ results }: CrawlerStatsProps) {
  const totalSourceUrls = Object.keys(results).length
  const totalRelatedUrls = Object.values(results).reduce((acc, urls) => acc + urls.length, 0)
  const averageRelatedUrls = totalSourceUrls > 0 ? totalRelatedUrls / totalSourceUrls : 0

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Source URLs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalSourceUrls}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Related URLs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalRelatedUrls}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg. Related URLs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageRelatedUrls.toFixed(1)}</div>
        </CardContent>
      </Card>
    </div>
  )
}

