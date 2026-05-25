import type { CollaboratorTargetRole, ProspectCreationDropdownContent } from '@entities/modules/wallet/types'

export interface ProspectCreationContentProps {
  stepIndex: number
  dropdownsContent: ProspectCreationDropdownContent
  collaboratorTargetRoles: CollaboratorTargetRole[]
}
