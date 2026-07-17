import { ref, type Ref } from 'vue'
import type { FormRules } from '@pulse/styleguide/types'
import { validationRules } from '@pulse/styleguide/utils/validators'
import type { ProspectFormData } from '@entities/modules/wallet/types'
import type { ProspectCreationStepCompanyValidationParams } from './prospect-creation-step-company.types'

const REQUIRED_FIELDS_ALERT_KEY = 'entities.wallet.prospect.form.requiredFieldsAlert'

// Explicit return type required: the inferred FormRules<ProspectFormData>
// type exceeds the compiler's serialization limit (TS7056) and breaks build:types.
export function useProspectCreationStepCompanyValidation(
  params: ProspectCreationStepCompanyValidationParams,
): {
  rules: Ref<FormRules<ProspectFormData>>
  validationErrorMessageKey: Ref<string | null>
  validate: () => Promise<boolean>
} {
  const validationErrorMessageKey = ref<string | null>(null)

  const rules = ref<FormRules<ProspectFormData>>({
    legalForm: [validationRules.requiredSelect('')],
    legalStructure: [validationRules.requiredSelect('')],
  })

  async function validate(): Promise<boolean> {
    if (params.formRef.value === null) {
      validationErrorMessageKey.value = null
      return true
    }
    try {
      await params.formRef.value.validate()
      validationErrorMessageKey.value = null
      return true
    } catch {
      validationErrorMessageKey.value = REQUIRED_FIELDS_ALERT_KEY
      return false
    }
  }

  return {
    rules,
    validationErrorMessageKey,
    validate,
  }
}
