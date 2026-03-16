import type { IconName, PTagProps } from '@pulse/styleguide/types'
import type { SortingCriteria } from '@pulse/common/types'
import type { SubscriptionStatusCode } from '@entities/services/subscription/subscriptionTypes'

export interface StatusDetails {
  text: string
  color: PTagProps['pColor']
  iconName: IconName
}

export interface SubscriptionSearchCriteria {
  currentPage: number
  limit: number
  statusCodes: SubscriptionStatusCode[]
  offerCodes: string[]
  sorting: SortingCriteria
}
