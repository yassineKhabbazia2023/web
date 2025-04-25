import type { Contact } from '@entities/services/contact/contactTypes'
import type { CollaboratorRole } from '@entities/pages/entities/components/SubscriptionOffers/SubscriptionOffersTypes'

export interface ContactWithRoles {
  contactId: number
  roleIds: number[]
}

export interface ManageCollaboratorsProps {
  selectedCollaboratorsWithRoles: ContactWithRoles[]
  knownCollaborators: Contact[]
  collaboratorRoles: CollaboratorRole[]
}
