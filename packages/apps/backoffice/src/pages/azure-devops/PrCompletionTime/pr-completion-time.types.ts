import type { PrCompletionItem } from '@backoffice/types/azure-devops.type'

export interface PrCompletionTimeTableProps {
  items: PrCompletionItem[]
}

export interface RepoCompletionStats {
  repositoryName: string
  prCount: number
  averageHours: number
  averageFormatted: string
}

export interface FrontBackStats {
  front: RepoCompletionStats
  back: RepoCompletionStats
}
