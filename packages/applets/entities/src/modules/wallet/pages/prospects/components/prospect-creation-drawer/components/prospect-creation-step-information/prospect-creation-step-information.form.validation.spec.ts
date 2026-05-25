import { nextTick, ref } from 'vue'
import type { FormInstance, FormItemRule } from 'element-plus'
import type { ProspectSignatory } from '@entities/modules/wallet/types'
import { useProspectCreationStepInformationValidation } from './prospect-creation-step-information.form.validation'
import {
  getProspectFormDataMock,
  getValidationParamsMock,
} from '../../__mocks__'

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}))

const ERROR_KEY = 'entities.wallet.prospect.form.requiredFieldError'
const REQUIRED_FIELDS_ALERT_KEY = 'entities.wallet.prospect.form.requiredFieldsAlert'

const getRuleAt = (
  rules: FormItemRule | FormItemRule[] | undefined,
  index = 0,
): FormItemRule | undefined => {
  if (Array.isArray(rules)) {
    return rules[index]
  }
  return index === 0 ? rules : undefined
}

const runValidator = (
  rule: FormItemRule | undefined,
  value: unknown,
): Promise<Error | string | undefined> => {
  return new Promise((resolve) => {
    if (rule?.validator === undefined) {
      resolve(undefined)
      return
    }
    rule.validator({}, value, (error: Error | string | undefined) => {
      resolve(error)
    }, {}, {})
  })
}

describe('prospect-creation-step-information.form.validation', () => {
  describe('required text fields', () => {
    const textFields: Array<keyof ProspectSignatory> = [
      'lastName',
      'firstName',
      'jobTitle',
      'department',
      'companyRole',
    ]

    textFields.forEach((field) => {
      const ruleKey = `signatory.${field}` as const

      describe(`${ruleKey} validation`, () => {
        it('should have a rule defined', () => {
          const { rules } = useProspectCreationStepInformationValidation(getValidationParamsMock())

          expect(rules.value[ruleKey]).toBeDefined()
        })

        it('should pass validation for a non-empty value', async () => {
          const { rules } = useProspectCreationStepInformationValidation(getValidationParamsMock())
          const rule = getRuleAt(rules.value[ruleKey])

          const error = await runValidator(rule, 'some value')
          expect(error).toBeUndefined()
        })

        it('should fail validation for an empty value', async () => {
          const { rules } = useProspectCreationStepInformationValidation(getValidationParamsMock())
          const rule = getRuleAt(rules.value[ruleKey])

          const error = await runValidator(rule, '')
          expect(error).toBeInstanceOf(Error)
          if (error instanceof Error) {
            expect(error.message).toBe(ERROR_KEY)
          }
        })
      })
    })
  })

  describe('signatory.contactTypes validation', () => {
    it('should have a rule defined', () => {
      const { rules } = useProspectCreationStepInformationValidation(getValidationParamsMock())

      expect(rules.value['signatory.contactTypes']).toBeDefined()
    })

    it('should pass validation for a non-empty array', async () => {
      const { rules } = useProspectCreationStepInformationValidation(getValidationParamsMock())
      const rule = getRuleAt(rules.value['signatory.contactTypes'])

      const error = await runValidator(rule, ['isMandateSignatory'])
      expect(error).toBeUndefined()
    })

    it('should fail validation for an empty array', async () => {
      const { rules } = useProspectCreationStepInformationValidation(getValidationParamsMock())
      const rule = getRuleAt(rules.value['signatory.contactTypes'])

      const error = await runValidator(rule, [])
      expect(error).toBeInstanceOf(Error)
    })

    it('should fail validation for null or undefined', async () => {
      const { rules } = useProspectCreationStepInformationValidation(getValidationParamsMock())
      const rule = getRuleAt(rules.value['signatory.contactTypes'])

      expect(await runValidator(rule, null)).toBeInstanceOf(Error)
      expect(await runValidator(rule, undefined)).toBeInstanceOf(Error)
    })
  })

  describe('signatory.title validation', () => {
    it('should have a rule defined', () => {
      const { rules } = useProspectCreationStepInformationValidation(getValidationParamsMock())

      expect(rules.value['signatory.title']).toBeDefined()
    })

    it('should pass validation for a selected value', async () => {
      const { rules } = useProspectCreationStepInformationValidation(getValidationParamsMock())
      const rule = getRuleAt(rules.value['signatory.title'])

      const error = await runValidator(rule, 'Mme')
      expect(error).toBeUndefined()
    })

    it('should fail validation when empty', async () => {
      const { rules } = useProspectCreationStepInformationValidation(getValidationParamsMock())
      const rule = getRuleAt(rules.value['signatory.title'])

      const error = await runValidator(rule, '')
      expect(error).toBeInstanceOf(Error)
    })
  })

  describe('signatory.email validation', () => {
    it('should have two rules defined', () => {
      const { rules } = useProspectCreationStepInformationValidation(getValidationParamsMock())

      expect(Array.isArray(rules.value['signatory.email'])).toBe(true)
      expect((rules.value['signatory.email'] as FormItemRule[]).length).toBe(2)
    })

    it('should fail the required rule when empty', async () => {
      const { rules } = useProspectCreationStepInformationValidation(getValidationParamsMock())
      const requiredRule = getRuleAt(rules.value['signatory.email'], 0)

      const error = await runValidator(requiredRule, '')
      expect(error).toBeInstanceOf(Error)
    })

    it('should fail the format rule for an invalid email', async () => {
      const { rules } = useProspectCreationStepInformationValidation(getValidationParamsMock())
      const formatRule = getRuleAt(rules.value['signatory.email'], 1)

      const error = await runValidator(formatRule, 'not-an-email')
      expect(error).toBeInstanceOf(Error)
    })

    it('should pass the format rule for a valid email', async () => {
      const { rules } = useProspectCreationStepInformationValidation(getValidationParamsMock())
      const formatRule = getRuleAt(rules.value['signatory.email'], 1)

      const error = await runValidator(formatRule, 'john.doe@example.com')
      expect(error).toBeUndefined()
    })
  })

  describe('signatory.mobilePhone validation', () => {
    it('should have two rules defined', () => {
      const { rules } = useProspectCreationStepInformationValidation(getValidationParamsMock())

      expect(Array.isArray(rules.value['signatory.mobilePhone'])).toBe(true)
      expect((rules.value['signatory.mobilePhone'] as FormItemRule[]).length).toBe(2)
    })

    it('should fail the required rule when empty', async () => {
      const { rules } = useProspectCreationStepInformationValidation(getValidationParamsMock())
      const requiredRule = getRuleAt(rules.value['signatory.mobilePhone'], 0)

      const error = await runValidator(requiredRule, '')
      expect(error).toBeInstanceOf(Error)
    })

    it('should fail the format rule for an invalid phone number', async () => {
      const { rules } = useProspectCreationStepInformationValidation(getValidationParamsMock())
      const formatRule = getRuleAt(rules.value['signatory.mobilePhone'], 1)

      const error = await runValidator(formatRule, '123')
      expect(error).toBeInstanceOf(Error)
    })

    it('should pass the format rule for a valid E.164 phone number', async () => {
      const { rules } = useProspectCreationStepInformationValidation(getValidationParamsMock())
      const formatRule = getRuleAt(rules.value['signatory.mobilePhone'], 1)

      const error = await runValidator(formatRule, '+33612345678')
      expect(error).toBeUndefined()
    })
  })

  describe('validate', () => {
    it('should set requiredFieldsAlert and return false when entity is not selected', async () => {
      const checkEntityEligibility = vi.fn(() => Promise.resolve({ ok: true, errorMessageKey: null }))
      const { validate, validationErrorMessageKey } = useProspectCreationStepInformationValidation(
        getValidationParamsMock({
          validateEntitySelection: () => false,
          checkEntityEligibility,
        }),
      )

      const result = await validate()

      expect(result).toBe(false)
      expect(validationErrorMessageKey.value).toBe(REQUIRED_FIELDS_ALERT_KEY)
      expect(checkEntityEligibility).not.toHaveBeenCalled()
    })

    it('should set requiredFieldsAlert and return false when form rules fail', async () => {
      const formRef = ref({
        validate: vi.fn(() => Promise.reject(new Error('invalid'))),
      } as unknown as FormInstance)
      const checkEntityEligibility = vi.fn(() => Promise.resolve({ ok: true, errorMessageKey: null }))
      const { validate, validationErrorMessageKey } = useProspectCreationStepInformationValidation(
        getValidationParamsMock({
          formRef,
          validateEntitySelection: () => true,
          checkEntityEligibility,
        }),
      )

      const result = await validate()

      expect(result).toBe(false)
      expect(validationErrorMessageKey.value).toBe(REQUIRED_FIELDS_ALERT_KEY)
      expect(checkEntityEligibility).not.toHaveBeenCalled()
    })

    it('should propagate eligibility errorMessageKey when eligibility fails', async () => {
      const formRef = ref({
        validate: vi.fn(() => Promise.resolve(true)),
      } as unknown as FormInstance)
      const { validate, validationErrorMessageKey } = useProspectCreationStepInformationValidation(
        getValidationParamsMock({
          formRef,
          validateEntitySelection: () => true,
          checkEntityEligibility: () => Promise.resolve({
            ok: false,
            errorMessageKey: 'entities.wallet.prospect.form.siretAlreadyExistsAlert',
          }),
        }),
      )

      const result = await validate()

      expect(result).toBe(false)
      expect(validationErrorMessageKey.value).toBe('entities.wallet.prospect.form.siretAlreadyExistsAlert')
    })

    it('should set null message when eligibility throws (toast handled upstream)', async () => {
      const formRef = ref({
        validate: vi.fn(() => Promise.resolve(true)),
      } as unknown as FormInstance)
      const { validate, validationErrorMessageKey } = useProspectCreationStepInformationValidation(
        getValidationParamsMock({
          formRef,
          validateEntitySelection: () => true,
          checkEntityEligibility: () => Promise.resolve({ ok: false, errorMessageKey: null }),
        }),
      )

      const result = await validate()

      expect(result).toBe(false)
      expect(validationErrorMessageKey.value).toBe(null)
    })

    it('should return true and clear error when everything passes', async () => {
      const formRef = ref({
        validate: vi.fn(() => Promise.resolve(true)),
      } as unknown as FormInstance)
      const { validate, validationErrorMessageKey } = useProspectCreationStepInformationValidation(
        getValidationParamsMock({
          formRef,
          validateEntitySelection: () => true,
          checkEntityEligibility: () => Promise.resolve({ ok: true, errorMessageKey: null }),
        }),
      )
      validationErrorMessageKey.value = REQUIRED_FIELDS_ALERT_KEY

      const result = await validate()

      expect(result).toBe(true)
      expect(validationErrorMessageKey.value).toBe(null)
    })
  })

  describe('validationErrorMessageKey reset', () => {
    it('should clear when prospectFormData.legalName changes', async () => {
      const prospectFormData = ref(getProspectFormDataMock())
      const { validationErrorMessageKey } = useProspectCreationStepInformationValidation(
        getValidationParamsMock({ prospectFormData }),
      )
      validationErrorMessageKey.value = 'entities.wallet.prospect.form.siretAlreadyExistsAlert'

      prospectFormData.value.legalName = 'New Entity'
      await nextTick()

      expect(validationErrorMessageKey.value).toBe(null)
    })

    it('should clear when prospectFormData.legalName is reset to empty', async () => {
      const prospectFormData = ref(getProspectFormDataMock({ legalName: 'Existing Entity' }))
      const { validationErrorMessageKey } = useProspectCreationStepInformationValidation(
        getValidationParamsMock({ prospectFormData }),
      )
      validationErrorMessageKey.value = 'entities.wallet.prospect.form.siretAlreadyExistsAlert'

      prospectFormData.value.legalName = ''
      await nextTick()

      expect(validationErrorMessageKey.value).toBe(null)
    })
  })
})
