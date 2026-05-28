import type { SubscriptionContact } from '@entities/services/subscription/subscriptionTypes'
import type { CollaboratorRole } from '@entities/types'

export interface CollaboratorsDetailsProps {
  collaborators: SubscriptionContact[]
  collaboratorRoles: CollaboratorRole[]
}
