import { commonApi } from '@pulse/common'
import type { AccountRow } from '@pulse/common/types'

export async function fetchUserEntities(): Promise<AccountRow[]> {
  const { data } = await commonApi().gateway.get('account/api/accounts/currentuser')
  return data.items
}
