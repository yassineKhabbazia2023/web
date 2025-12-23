import type { SubscriptionOfferServices } from '@entities/types'
import { SubscriptionDetailsContext } from '@entities/modules/wallet/enums'

export interface InformationDetailsProps {
  subscriptionOfferDetails: SubscriptionOfferServices
  accountId: number
  pageContext?: SubscriptionDetailsContext
}
