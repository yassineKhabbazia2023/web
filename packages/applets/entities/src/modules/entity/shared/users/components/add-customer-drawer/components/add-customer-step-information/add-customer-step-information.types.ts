import type { MaybeRefOrGetter, Ref } from 'vue'
import type { Contact } from '../../add-customer-drawer.types'
import type { FormInstance, PDropdownOption } from '@pulse/styleguide/types'

export interface AddCustomerStepInformationProps {
  newContact: Contact
  emailErrorMessage: string
  firstNameErrorMessage: string
  lastNameErrorMessage: string
  customerTitleOptions: PDropdownOption[]
  shouldEnableNames: boolean
}

export interface AddCustomerStepInformationValidationParams {
  formRef: Ref<FormInstance | null>
  customerTitleOptions: MaybeRefOrGetter<PDropdownOption[]>
  requiredFieldMessage: string
  invalidPhoneNumberMessage: string
}
