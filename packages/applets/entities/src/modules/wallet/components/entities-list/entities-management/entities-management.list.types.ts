import type { RegularWalletData } from '@entities/modules/wallet/types/wallet-data.types'
import type { SortingCriteria } from '@pulse/common/types'

export interface EntitiesManagementListProps {
  data: RegularWalletData[]
}

export type EntitiesManagementListEmit = {
  (e: 'access', accountId: number): void
  (e: 'sort-account', sortingCriteria: SortingCriteria): void
  (e: 'displayAccountRightsDrawer', row: RegularWalletData): void
  (e: 'displayResendActivationEmailDrawer', row: RegularWalletData): void
}
