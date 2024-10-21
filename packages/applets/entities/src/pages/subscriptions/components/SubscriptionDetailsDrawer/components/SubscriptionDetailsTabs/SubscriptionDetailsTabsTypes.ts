import type { SubscriptionDetails } from '@entities/services/subscription'

/* eslint-disable no-unused-vars */
export enum RecapTabs {
  SERVICES = 'services',
  CUSTOMER_USERS = 'customerUsers',
  COLLABORATORS = 'collaborators',
  INFORMATION = 'information'
}
/* eslint-enable no-unused-vars */
export interface SubscriptionDetailsTab {
  index: number
  name: `${RecapTabs}`
  label: string
}
export interface SubscriptionDetailsTabsProps {
  subscriptionDetails: SubscriptionDetails | undefined
}
