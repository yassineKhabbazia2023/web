import type { Ref } from 'vue'
import type { FormInstance } from 'element-plus'
import type { ProspectCreationDropdownContent, ProspectFormData } from '@entities/modules/wallet/types'

export interface ProspectCreationStepInformationProps {
  dropdownsContent: ProspectCreationDropdownContent
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
