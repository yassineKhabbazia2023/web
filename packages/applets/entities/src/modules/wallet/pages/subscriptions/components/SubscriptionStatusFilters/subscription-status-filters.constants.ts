import type { PFilterOptionProps, IconName } from '@pulse/styleguide/types'
import { SubscriptionStatusCode } from '@entities/services/subscription/subscriptionTypes'

type UsedSubscriptionStatusCode =
  | SubscriptionStatusCode.PENDING
  | SubscriptionStatusCode.PENNYLANE_TO_VERIFY
  | SubscriptionStatusCode.PENNYLANE_CREATED
  | SubscriptionStatusCode.VALIDATED

type SubscriptionStatusColorMap = Record<UsedSubscriptionStatusCode, PFilterOptionProps['pColor']>
type SubscriptionStatusIconMap = Record<UsedSubscriptionStatusCode, IconName>

export const SUBSCRIPTION_STATUS_COLOR: SubscriptionStatusColorMap = {
  [SubscriptionStatusCode.PENDING]: 'warning',
  [SubscriptionStatusCode.PENNYLANE_TO_VERIFY]: 'light-blue',
  [SubscriptionStatusCode.PENNYLANE_CREATED]: 'purple',
  [SubscriptionStatusCode.VALIDATED]: 'gray',
}

export const SUBSCRIPTION_STATUS_ICON: SubscriptionStatusIconMap = {
  [SubscriptionStatusCode.PENDING]: 'arrowUpCircle',
  [SubscriptionStatusCode.PENNYLANE_TO_VERIFY]: 'search',
  [SubscriptionStatusCode.PENNYLANE_CREATED]: 'arrowRepeat',
  [SubscriptionStatusCode.VALIDATED]: 'checkCircle',
}
