import type { PTagProps } from '@pulse/styleguide/types'
import type { ProspectListType } from '@entities/modules/wallet/enums'
import type { ProspectWalletData } from '@entities/modules/wallet/types/wallet-data.types'
import type { SortingCriteria } from '@pulse/common/types'

export interface StepConfig {
  label: string
  color: PTagProps['pColor']
}

export interface EntitiesListProspectsProps {
  data: ProspectWalletData[]
  prospectListType: ProspectListType
}

export type EntitiesListProspectsEmit = {
  (e: 'sort-account', sortingCriteria: SortingCriteria): void
  (e: 'prospect-archived'): void
  (e: 'access', accountId: number): void
}
