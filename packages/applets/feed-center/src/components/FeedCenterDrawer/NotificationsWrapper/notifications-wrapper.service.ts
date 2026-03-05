import { api } from '@pulse/common/api'
import type { AccountRow } from '@pulse/common/types'

export async function fetchUserEntities(): Promise<AccountRow[]> {
  const { data } = await api.gateway.get('account/api/accounts/currentuser')
  return data.items
}
