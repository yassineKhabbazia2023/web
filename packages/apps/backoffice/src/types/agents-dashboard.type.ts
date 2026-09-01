export interface AgentLockItem {
  id: string
  environment: string
  environmentName: string
  createdAt: string
  expiresAt: string | null
  lockedAt: string | null
  lockedBy: string | null
  reason: string | null
  isLocked: boolean
  unlockedAt: string | null
  unlockedBy: string | null
  unlockedReason: string | null
}

export interface AgentLocksResponse {
  items: AgentLockItem[]
  totalCount: number
  page: number
  pageSize: number
}

export interface GetAgentLocksParams {
  page?: number
  pageSize?: number
  createdAtFrom?: string
  createdAtTo?: string
  environmentId?: number
  lockedBy?: string
}

export interface AgentLocksRequestPayload {
  createdAtFrom?: string
  createdAtTo?: string
  environmentId?: number
  lockedBy?: string
}

export interface CreateAgentLockPayload {
  environmentId: number
  reason: string
}

export interface AgentLocksFiltersState {
  dateRange: [Date, Date] | null
  environmentId: number | null
  lockedBy: string | null
}

export interface AgentLockEnvironmentItem {
  id: number
  name: string
  poolName: string
}
