import { ref, watch, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { FormItemRule, FormRules } from 'element-plus'
import { validationRules } from '@pulse/styleguide/utils/validators'
import type { ProspectFormData, ProspectSignatory } from '@entities/modules/wallet/types'
import type { ProspectCreationStepInformationValidationParams } from './prospect-creation-step-information.types'

const REQUIRED_FIELDS_ALERT_KEY = 'entities.wallet.prospect.form.requiredFieldsAlert'

// Explicit return type required: element-plus's FormRules<ProspectFormData> inferred
// type exceeds the compiler's serialization limit (TS7056) and breaks build:types.
export function useProspectCreationStepInformationValidation(
  params: ProspectCreationStepInformationValidationParams,
): {
  rules: Ref<FormRules<ProspectFormData>>
  validationErrorMessageKey: Ref<string | null>
  validate: () => Promise<boolean>
} {
  const { t } = useI18n({ useScope: 'global' })

  const validationErrorMessageKey = ref<string | null>(null)

  watch(
    () => params.prospectFormData.value.legalName,
    () => {
      validationErrorMessageKey.value = null
    },
  )

  const errorMessage = t('entities.wallet.prospect.form.requiredFieldError')

  // Typed against `keyof ProspectSignatory` so TS catches any renamed or missing field
  // safer than declaring keys as raw strings.
  const signatoryRules: Record<keyof ProspectSignatory, FormItemRule[]> = {
    title: [validationRules.requiredSelect(errorMessage)],
    lastName: [validationRules.requiredTextInput(errorMessage)],
    firstName: [validationRules.requiredTextInput(errorMessage)],
    jobTitle: [validationRules.requiredTextInput(errorMessage)],
    department: [validationRules.requiredSelect(errorMessage)],
    companyRole: [validationRules.requiredSelect(errorMessage)],
    contactTypes: [validationRules.requiredMultiSelect(errorMessage)],
    email: [
      validationRules.requiredTextInput(errorMessage),
      validationRules.email(errorMessage),
    ],
    mobilePhone: [
      validationRules.requiredTextInput(errorMessage),
      validationRules.phoneNumber(errorMessage),
    ],
  }

  // Styleguide form resolves nested form fields via dot-paths (e.g. `signatory.title`)
  // and only accepts them as plain string keys, so the typed rules above are
  // re-keyed with the `signatory.` prefix at build time.
  const rules = ref<FormRules<ProspectFormData>>(
    Object.fromEntries(
      Object.entries(signatoryRules).map(([field, fieldRules]) => [`signatory.${field}`, fieldRules]),
    ),
  )

  async function validate(): Promise<boolean> {
    const isEntitySelected = params.validateEntitySelection()

    let isFormValid = true
    if (params.formRef.value !== null) {
      try {
        await params.formRef.value.validate()
      } catch {
        isFormValid = false
      }
    }

    // Skip the eligibility check while the local form is invalid — eligibility and
    // required-fields alerts must never coexist.
    if (isEntitySelected === false || isFormValid === false) {
      validationErrorMessageKey.value = REQUIRED_FIELDS_ALERT_KEY
      return false
    }

    const eligibility = await params.checkEntityEligibility()
    if (eligibility.ok === false) {
      validationErrorMessageKey.value = eligibility.errorMessageKey
      return false
    }

    validationErrorMessageKey.value = null
    return true
  }

  return {
    rules,
    validationErrorMessageKey,
    validate,
  }
}
