import { validationRules } from '@pulse/styleguide/utils/validators'
import type { BeneficiaryFormRules } from './beneficiaries.types'

export function buildBeneficiaryFormRules(requiredErrorMessage: string): BeneficiaryFormRules {
  return {
    documentType: [validationRules.requiredSelect(requiredErrorMessage)],
    lastName: [validationRules.requiredTextInput(requiredErrorMessage)],
    firstName: [validationRules.requiredTextInput(requiredErrorMessage)],
  }
}
