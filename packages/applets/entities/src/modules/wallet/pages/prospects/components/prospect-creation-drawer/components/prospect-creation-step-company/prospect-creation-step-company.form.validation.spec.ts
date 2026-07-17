import { ref } from 'vue'
import type { FormInstance, FormItemRule } from 'element-plus'
import { useProspectCreationStepCompanyValidation } from './prospect-creation-step-company.form.validation'

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

const getParamsMock = (
  formRef: FormInstance | null = null,
) => ({
  formRef: ref<FormInstance | null>(formRef),
})

describe('prospect-creation-step-company.form.validation', () => {
  describe('rules', () => {
    const requiredFields = ['legalForm', 'legalStructure'] as const

    describe.each(requiredFields)('%s validation', (field) => {
      it('should have a rule defined', () => {
        const { rules } = useProspectCreationStepCompanyValidation(getParamsMock())

        expect(rules.value[field]).toBeDefined()
      })

      it('should pass validation for a selected value', async () => {
        const { rules } = useProspectCreationStepCompanyValidation(getParamsMock())
        const rule = getRuleAt(rules.value[field])

        const error = await runValidator(rule, 'SAS')
        expect(error).toBeUndefined()
      })

      it('should fail validation for an empty value', async () => {
        const { rules } = useProspectCreationStepCompanyValidation(getParamsMock())
        const rule = getRuleAt(rules.value[field])

        const error = await runValidator(rule, '')
        expect(error).toBeInstanceOf(Error)
      })

      it('should fail validation for null or undefined', async () => {
        const { rules } = useProspectCreationStepCompanyValidation(getParamsMock())
        const rule = getRuleAt(rules.value[field])

        expect(await runValidator(rule, null)).toBeInstanceOf(Error)
        expect(await runValidator(rule, undefined)).toBeInstanceOf(Error)
      })
    })
  })

  describe('validate', () => {
    it('should return true and clear the error message when formRef is null', async () => {
      const { validate, validationErrorMessageKey } = useProspectCreationStepCompanyValidation(getParamsMock())
      validationErrorMessageKey.value = REQUIRED_FIELDS_ALERT_KEY

      const result = await validate()

      expect(result).toBe(true)
      expect(validationErrorMessageKey.value).toBe(null)
    })

    it('should return true and clear the error message when form passes', async () => {
      const formRef = {
        validate: vi.fn(() => Promise.resolve(true)),
      } as unknown as FormInstance
      const { validate, validationErrorMessageKey } = useProspectCreationStepCompanyValidation(getParamsMock(formRef))
      validationErrorMessageKey.value = REQUIRED_FIELDS_ALERT_KEY

      const result = await validate()

      expect(result).toBe(true)
      expect(validationErrorMessageKey.value).toBe(null)
    })

    it('should return false and set requiredFieldsAlert when form fails', async () => {
      const formRef = {
        validate: vi.fn(() => Promise.reject(new Error('invalid'))),
      } as unknown as FormInstance
      const { validate, validationErrorMessageKey } = useProspectCreationStepCompanyValidation(getParamsMock(formRef))

      const result = await validate()

      expect(result).toBe(false)
      expect(validationErrorMessageKey.value).toBe(REQUIRED_FIELDS_ALERT_KEY)
    })
  })
})
