import type { FormRules } from '@pulse/styleguide/types'
import { validationRules } from '@pulse/styleguide/utils/validators'
import type { DematMailFormModel, DematMailRulesTranslations } from './demat-mail-dialog.types'

export function createDematMailRules(
  translations: DematMailRulesTranslations,
): FormRules<DematMailFormModel> {
  return {
    email: [
      validationRules.requiredTextInput(translations.emailRequired),
      validationRules.email(translations.emailInvalid),
    ],
  }
}
