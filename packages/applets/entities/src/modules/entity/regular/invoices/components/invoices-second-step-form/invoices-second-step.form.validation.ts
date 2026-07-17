import type { FormRules } from '@pulse/styleguide/types'
import { validationRules } from '@pulse/styleguide/utils/validators'
import type { InvoicesSecondStepFormModel } from './invoices-second-step.form.types'

export function createInvoicesSecondStepFormRules(translations: {
  contactRequired: string
}): FormRules<InvoicesSecondStepFormModel> {
  return {
    selectedContactId: [
      validationRules.requiredSelect(translations.contactRequired),
    ],
  }
}
