import type { AgentLockItem } from '@backoffice/types/agents-dashboard.type'

export interface AgentsDashboardTableProps {
  locks: AgentLockItem[]
  totalCount: number
  currentPage: number
  pageSize: number
  isLoading: boolean
  unlockingLockId: string | null
}
