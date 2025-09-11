import type { Deployment, Address, Office, Subscription, Entity } from '@common/types'

export interface EntitySummary extends Entity {
  accountGlobalUniqueId: string
  missionType: string
  officeId: number
  office: Office
  address: Address,
  deployment: Deployment
  subscriptions: Subscription[]
}
