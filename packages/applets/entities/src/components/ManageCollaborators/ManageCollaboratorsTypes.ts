import type { Contact } from '@entities/services/contact/contactTypes'
import type { CollaboratorRole, ContactWithRoles } from '@entities/types'

export interface ManageCollaboratorsProps {
  selectedCollaboratorsWithRoles: ContactWithRoles[]
  knownCollaborators: Contact[]
  collaboratorRoles: CollaboratorRole[]
}
