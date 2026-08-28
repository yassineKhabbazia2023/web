import type { AgentLockEnvironmentItem, AgentLocksFiltersState } from '@backoffice/types/agents-dashboard.type'

export interface AgentsDashboardFiltersProps {
  filters: AgentLocksFiltersState
  environments: AgentLockEnvironmentItem[]
  isLoading: boolean
  isLoadingFilters: boolean
}
