import type { Ref } from 'vue'
import type { FormInstance } from '@pulse/styleguide/types'
import type { ProspectCreationDropdownContent } from '@entities/modules/wallet/types'

export interface ProspectCreationStepCompanyProps {
  dropdownsContent: ProspectCreationDropdownContent
}

export interface ProspectCreationStepCompanyValidationParams {
  formRef: Ref<FormInstance | null>
}
