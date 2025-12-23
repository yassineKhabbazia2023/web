import { SubscriptionOfferServices } from '@entities/types'
import type { SubscriptionDetails } from '@entities/services/subscription/subscriptionTypes'
import { RecapTabs, SubscriptionDetailsContext } from '@entities/modules/wallet/enums'

export interface SubscriptionDetailsTab {
  index: number
  name: `${RecapTabs}`
  label: string
}
export interface SubscriptionDetailsTabsProps {
  subscriptionDetails?: SubscriptionDetails
  currentSubscriptionOffer?: SubscriptionOfferServices
  pageContext?: SubscriptionDetailsContext
}
