import type { FormRules } from '@pulse/styleguide/types'
import { validationRules } from '@pulse/styleguide/utils/validators'
import type { InvoicesFormModel } from '../../types'

export function createInvoicesFormRules(translations: {
  emailRequired: string
  emailInvalid: string
  acceptTermsRequired: string
}): FormRules<InvoicesFormModel> {
  return {
    email: [
      validationRules.requiredTextInput(translations.emailRequired),
      validationRules.email(translations.emailInvalid),
    ],
    acceptTerms: [
      validationRules.custom(
        (value: boolean) => value === true,
        translations.acceptTermsRequired,
        'change',
      ),
    ],
  }
}
