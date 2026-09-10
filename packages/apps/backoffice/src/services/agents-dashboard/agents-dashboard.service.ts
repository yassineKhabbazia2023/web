import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '@backoffice/constants/backoffice.const'
import { backofficeApi } from '@backoffice/api/backoffice.api'
import type {
  AgentLocksRequestPayload,
  AgentLocksResponse,
  AgentLockEnvironmentItem,
  CreateAgentLockPayload,
  GetAgentLocksParams,
} from '@backoffice/types/agents-dashboard.type'

export class AgentsDashboardService {
  static async getLocks(params: GetAgentLocksParams = {}): Promise<AgentLocksResponse> {
    const {
      page = DEFAULT_PAGE_NUMBER,
      pageSize = DEFAULT_PAGE_SIZE,
      createdAtFrom,
      createdAtTo,
      environmentId,
      lockedBy,
    } = params

    const urlParams = new URLSearchParams({
      pageNumber: page.toString(),
      pageSize: pageSize.toString(),
    })

    const payload: AgentLocksRequestPayload = {}

    if (createdAtFrom !== undefined) {
      payload.createdAtFrom = createdAtFrom
    }

    if (createdAtTo !== undefined) {
      payload.createdAtTo = createdAtTo
    }

    if (environmentId !== undefined) {
      payload.environmentId = environmentId
    }

    if (lockedBy !== undefined && lockedBy !== '') {
      payload.lockedBy = lockedBy
    }

    const response = await backofficeApi.post<AgentLocksResponse>(`/locks?${urlParams.toString()}`, payload)
    return response.data
  }

  static async getEnvironments(): Promise<AgentLockEnvironmentItem[]> {
    const response = await backofficeApi.get<AgentLockEnvironmentItem[] | string>('/locks/environments')

    if (typeof response.data === 'string') {
      return JSON.parse(response.data) as AgentLockEnvironmentItem[]
    }

    return response.data
  }

  static async createLock(payload: CreateAgentLockPayload): Promise<void> {
    await backofficeApi.post('/lock', payload)
  }

  static async unlockLock(lockId: string): Promise<void> {
    await backofficeApi.delete(`/unlock/${lockId}`)
  }
}
