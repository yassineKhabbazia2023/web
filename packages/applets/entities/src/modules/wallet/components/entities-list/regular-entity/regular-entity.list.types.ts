import type { RegularWalletData } from '@entities/modules/wallet/types'
import type { SortingCriteria } from '@pulse/common/types'

export interface EntitiesListRegularProps {
  data: RegularWalletData[]
  searchValue?: string
}

export type EntitiesListRegularEmit = {
  (e: 'click-deploy', accountId: number, accountNumber: string, name: string): void
  (e: 'access', accountId: number): void
  (e: 'add-favorite', accountId: number, isFavorite: boolean): void
  (e: 'displayResendActivationEmailDrawer', row: RegularWalletData): void
  (e: 'displayDeclareCustomerRelationDrawer', row: RegularWalletData): void
  (e: 'displayDelegationDrawer', row: RegularWalletData): void
  (e: 'displayRemoveCurrentUserFromFolderModal', row: RegularWalletData): void
  (e: 'sort-account', sortingCriteria: SortingCriteria): void
}

export interface MenuTranslations {
  accessThisFolder: string
  deployThisFolder: string
  delegateThisFolder: string
  resendActivationEmail: string
  declareCustomerRelation: string
  removeCurrentUserFromThisFolder: string
  toDeploy: string
}
