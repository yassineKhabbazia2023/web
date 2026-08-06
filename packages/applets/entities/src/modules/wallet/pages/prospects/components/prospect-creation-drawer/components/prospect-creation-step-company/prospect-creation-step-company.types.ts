import type { Ref } from 'vue'
import type { FormInstance } from '@pulse/styleguide/types'
import type { CreationDropdownContent } from '@entities/services/creation-referential'

export interface ProspectCreationStepCompanyProps {
  dropdownsContent: CreationDropdownContent
}

export interface ProspectCreationStepCompanyValidationParams {
  formRef: Ref<FormInstance | null>
}
