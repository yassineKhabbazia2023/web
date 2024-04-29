import type { SubscriptionDetails } from '@/services/subscription'

export interface SubscriptionDetailsTab {
  index: number
  name: 'services' | 'customerUsers' | 'kpmgCollaborators' | 'information'
  label: string
}
export interface SubscriptionDetailsTabsProps {
  subscriptionDetails: SubscriptionDetails | undefined
}
