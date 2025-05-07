import type { SubscriptionContact } from '@entities/services/subscription/subscriptionTypes'
import type { CollaboratorRole } from '@entities/pages/entities/components/SubscriptionOffers/SubscriptionOffersTypes'

export interface CollaboratorsDetailsProps {
  collaborators: SubscriptionContact[]
  collaboratorRoles: CollaboratorRole[]
}
