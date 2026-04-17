import type { RegularWalletData } from '@entities/modules/wallet/types'
import type { SortingCriteria } from '@pulse/common/types'
import type { SelectedFolder } from '@entities/modules/wallet/pages/folders/components/DelegationDrawer/DelegationDrawerTypes'

export interface EntitiesListRegularProps {
  data: RegularWalletData[]
  searchValue?: string
}

export type EntitiesListRegularEmit = {
  (e: 'click-deploy', accountId: number, accountNumber: string, name: string): void
  (e: 'access', accountId: number): void
  (e: 'add-favorite', accountId: number, isFavorite: boolean): void
  (e: 'selectedFolder', folder: SelectedFolder): void
  (e: 'displayResendActivationEmailDrawer', row: RegularWalletData): void
  (e: 'displayDeclareCustomerRelationDrawer', row: RegularWalletData): void
  (e: 'sort-account', sortingCriteria: SortingCriteria): void
}

export interface MenuTranslations {
  accessThisFolder: string
  deployThisFolder: string
  resendActivationEmail: string
  declareCustomerRelation: string
  toDeploy: string
}
