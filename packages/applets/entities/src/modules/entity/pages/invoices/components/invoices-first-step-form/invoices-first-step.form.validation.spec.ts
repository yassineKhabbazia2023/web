import { createInvoicesFormRules } from './invoices-first-step.form.validation'
import type { InvoicesFormModel } from '@entities/modules/entity/types'

vi.mock('@pulse/styleguide/utils/validators', () => ({
  validationRules: {
    requiredTextInput: vi.fn((message: string) => ({ type: 'required', message })),
    email: vi.fn((message: string) => ({ type: 'email', message })),
    custom: vi.fn((validator: Function, message: string, trigger: string) => ({
      type: 'custom',
      validator,
      message,
      trigger,
    })),
  },
}))

describe('invoices-first-step.form.validation', () => {
  describe('InvoicesFormModel interface', () => {
    it('should allow creating a valid form model', () => {
      const model: InvoicesFormModel = {
        email: 'test@example.com',
        acceptTerms: true,
      }

      expect(model.email).toBe('test@example.com')
      expect(model.acceptTerms).toBe(true)
    })
  })

  describe('createInvoicesFormRules', () => {
    const translations = {
      emailRequired: 'Email is required',
      emailInvalid: 'Email is invalid',
      acceptTermsRequired: 'You must accept the terms',
    }

    it('should create rules with email validation', () => {
      const rules = createInvoicesFormRules(translations)

      expect(rules.email).toBeDefined()
      expect(rules.email).toHaveLength(2)
    })

    it('should create rules with acceptTerms validation', () => {
      const rules = createInvoicesFormRules(translations)

      expect(rules.acceptTerms).toBeDefined()
      expect(rules.acceptTerms).toHaveLength(1)
    })

    it('should use provided translations for email required rule', () => {
      const rules = createInvoicesFormRules(translations)
      const emailRules = rules.email as Array<{ message: string }>

      expect(emailRules[0].message).toBe(translations.emailRequired)
    })

    it('should use provided translations for email invalid rule', () => {
      const rules = createInvoicesFormRules(translations)
      const emailRules = rules.email as Array<{ message: string }>

      expect(emailRules[1].message).toBe(translations.emailInvalid)
    })

    it('should use provided translations for acceptTerms rule', () => {
      const rules = createInvoicesFormRules(translations)
      const acceptTermsRules = rules.acceptTerms as Array<{ message: string }>

      expect(acceptTermsRules[0].message).toBe(translations.acceptTermsRequired)
    })

    it('should create acceptTerms custom validator that returns true for true value', () => {
      const rules = createInvoicesFormRules(translations)
      const acceptTermsRules = rules.acceptTerms as Array<{ validator: (value: boolean) => boolean }>
      const validator = acceptTermsRules[0].validator

      expect(validator(true)).toBe(true)
    })

    it('should create acceptTerms custom validator that returns false for false value', () => {
      const rules = createInvoicesFormRules(translations)
      const acceptTermsRules = rules.acceptTerms as Array<{ validator: (value: boolean) => boolean }>
      const validator = acceptTermsRules[0].validator

      expect(validator(false)).toBe(false)
    })
  })
})
