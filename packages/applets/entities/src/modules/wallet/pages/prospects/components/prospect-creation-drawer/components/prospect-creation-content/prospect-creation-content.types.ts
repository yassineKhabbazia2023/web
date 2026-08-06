import type { CollaboratorTargetRole } from '@entities/modules/wallet/types'
import type { CreationDropdownContent } from '@entities/services/creation-referential'

export interface ProspectCreationContentProps {
  stepIndex: number
  dropdownsContent: CreationDropdownContent
  collaboratorTargetRoles: CollaboratorTargetRole[]
}
