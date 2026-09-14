import type { Entity, QueryResult } from '@pulse/common/types'
import type { AccountRow } from '@entities/services/account'

export interface WalletResponse {
  accounts: QueryResult<AccountRow>
  favorites: Entity[] | null
}
