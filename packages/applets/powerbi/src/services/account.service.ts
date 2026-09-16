import { api } from '@pulse/common/api'
import { API_PREFIXES } from '@pulse/common/constants'
import type { AccountResponse } from '@powerbi/types/account.types'

export const fetchAccount = async (accountId: number): Promise<AccountResponse> => {
  const { data } = await api.gateway.get<AccountResponse>(`${API_PREFIXES.ACCOUNT}/accounts/${accountId}/currentuser`)

  return data
}
