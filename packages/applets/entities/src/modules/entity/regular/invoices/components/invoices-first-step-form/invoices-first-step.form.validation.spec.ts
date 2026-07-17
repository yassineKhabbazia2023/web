import type { FormItemRule } from 'element-plus'
import { createInvoicesFormRules } from './invoices-first-step.form.validation'
import type { InvoicesFormModel } from '../../types'

// The real validationRules carry their message inside the validator callback,
// not on the rule object: run the rule to know what it accepts and rejects.
const runRule = (rule: FormItemRule, value: unknown): Error | undefined => {
  let error: Error | undefined
  const validator = rule.validator as (
    rule: unknown,
    value: unknown,
    callback: (error?: Error) => void,
  ) => void
  validator({}, value, (callbackError?: Error) => {
    error = callbackError
  })
  return error
}

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

    it('should reject an empty email with the provided translation', () => {
      const rules = createInvoicesFormRules(translations)
      const emailRules = rules.email as FormItemRule[]

      expect(runRule(emailRules[0], '')).toEqual(new Error(translations.emailRequired))
    })

    it('should accept a filled email on the required rule', () => {
      const rules = createInvoicesFormRules(translations)
      const emailRules = rules.email as FormItemRule[]

      expect(runRule(emailRules[0], 'test@example.com')).toBeUndefined()
    })

    it('should reject a malformed email with the provided translation', () => {
      const rules = createInvoicesFormRules(translations)
      const emailRules = rules.email as FormItemRule[]

      expect(runRule(emailRules[1], 'not-an-email')).toEqual(new Error(translations.emailInvalid))
    })

    it('should accept a well-formed email on the format rule', () => {
      const rules = createInvoicesFormRules(translations)
      const emailRules = rules.email as FormItemRule[]

      expect(runRule(emailRules[1], 'test@example.com')).toBeUndefined()
    })

    it('should accept acceptTerms when true', () => {
      const rules = createInvoicesFormRules(translations)
      const acceptTermsRules = rules.acceptTerms as FormItemRule[]

      expect(runRule(acceptTermsRules[0], true)).toBeUndefined()
    })

    it('should reject acceptTerms when false with the provided translation', () => {
      const rules = createInvoicesFormRules(translations)
      const acceptTermsRules = rules.acceptTerms as FormItemRule[]

      expect(runRule(acceptTermsRules[0], false)).toEqual(new Error(translations.acceptTermsRequired))
    })
  })
})
