import type { Ref } from 'vue'
import type { CollaboratorTargetRole, ProspectFormData } from '@entities/modules/wallet/types'

export interface ProspectCreationStepContactProps {
  collaboratorTargetRoles: CollaboratorTargetRole[]
}

export interface ProspectCreationStepContactValidationParams {
  prospectFormData: Ref<ProspectFormData>
  collaboratorTargetRoles: Ref<CollaboratorTargetRole[]>
}
