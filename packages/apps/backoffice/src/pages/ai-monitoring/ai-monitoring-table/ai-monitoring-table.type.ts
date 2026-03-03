import type { AiSearchHistoryItem } from '@backoffice/types/ai-monitoring.type'

export interface AiMonitoringTableProps {
  history: AiSearchHistoryItem[]
  totalItems: number
  currentPage: number
  pageSize: number
  isLoading: boolean
}
