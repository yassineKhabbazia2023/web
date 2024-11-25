import type { SubscriptionDetails } from '@entities/services/subscription'

 
export enum RecapTabs {
  SERVICES = 'services',
  CUSTOMER_USERS = 'customerUsers',
  COLLABORATORS = 'collaborators',
  INFORMATION = 'information'
}
 
export interface SubscriptionDetailsTab {
  index: number
  name: `${RecapTabs}`
  label: string
}
export interface SubscriptionDetailsTabsProps {
  subscriptionDetails: SubscriptionDetails | undefined
}
