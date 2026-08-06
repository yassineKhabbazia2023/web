import type { Ref } from 'vue'
import type { FormInstance } from '@pulse/styleguide/types'
import type { ProspectFormData } from '@entities/modules/wallet/types'
import type { CreationDropdownContent } from '@entities/services/creation-referential'

export interface ProspectCreationStepInformationProps {
  dropdownsContent: CreationDropdownContent
}

export interface EntityEligibilityResult {
  ok: boolean
  errorMessageKey: string | null
}

export interface ProspectCreationStepInformationValidationParams {
  prospectFormData: Ref<ProspectFormData>
  formRef: Ref<FormInstance | null>
  validateEntitySelection: () => boolean
  checkEntityEligibility: () => Promise<EntityEligibilityResult>
}
