import type { Contact } from '@entities/services/contact/contactTypes'
import type { UserInfo } from '@pulse/common/types'

export interface ManageCollaboratorsProps {
  collaborators: Contact[]
  defaultCollaborator: UserInfo
}
