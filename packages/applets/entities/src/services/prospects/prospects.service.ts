import { api } from '@pulse/common/api'
import { API_PREFIXES } from '@pulse/common/constants'
import type { PaginationResponse } from '@pulse/common/types'
import type { ProspectAccountRow } from '@entities/modules/wallet/types'

export class ProspectsService {
  static async fetchProspectsAccounts(searchParams?: URLSearchParams): Promise<PaginationResponse<ProspectAccountRow>> {
    const query = searchParams ? `?${searchParams}` : ''
    const response = await api.gateway.get<PaginationResponse<ProspectAccountRow>>(
      `${API_PREFIXES.WALLET}/prospects/currentuser${query}`,
    )
    return response.data
  }

  static archiveProspect(prospectId: number): Promise<void> {
    return api.gateway.delete(`${API_PREFIXES.WALLET}/prospects/${prospectId}/currentuser`)
  }
}
