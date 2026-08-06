import { toValue } from 'vue'
import type { FormRules } from '@pulse/styleguide/types'
import { validationRules } from '@pulse/styleguide/utils/validators'
import type { Contact } from '../../add-customer-drawer.types'
import type { AddCustomerStepInformationValidationParams } from './add-customer-step-information.types'

export function useAddCustomerStepInformationValidation({
  formRef,
  customerTitleOptions,
  requiredFieldMessage,
  invalidPhoneNumberMessage,
}: AddCustomerStepInformationValidationParams) {
  const rules: FormRules<Contact> = {
    title: [
      validationRules.requiredSelect(requiredFieldMessage),
      validationRules.custom(
        title => title === '' || toValue(customerTitleOptions).some(({ pValue }) => pValue === title),
        requiredFieldMessage,
        'change',
      ),
    ],
    mobilePhone: [
      validationRules.requiredTextInput(requiredFieldMessage),
      validationRules.phoneNumber(invalidPhoneNumberMessage),
    ],
  }

  async function validate(): Promise<boolean> {
    if (formRef.value === null) {
      return true
    }
    try {
      await formRef.value.validate()
      return true
    } catch {
      return false
    }
  }

  return {
    rules,
    validate,
  }
}
