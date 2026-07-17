import type { FormItemRule } from 'element-plus'
import { createInvoicesSecondStepFormRules } from './invoices-second-step.form.validation'
import type { InvoicesSecondStepFormModel } from './invoices-second-step.form.types'

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

describe('invoices-second-step.form.validation', () => {
  describe('InvoicesSecondStepFormModel interface', () => {
    it('should allow creating a valid form model with selectedContactId', () => {
      const model: InvoicesSecondStepFormModel = {
        selectedContactId: 'contact-123',
      }

      expect(model.selectedContactId).toBe('contact-123')
    })

    it('should allow creating a form model with null selectedContactId', () => {
      const model: InvoicesSecondStepFormModel = {
        selectedContactId: null,
      }

      expect(model.selectedContactId).toBeNull()
    })
  })

  describe('createInvoicesSecondStepFormRules', () => {
    const translations = {
      contactRequired: 'Please select a contact',
    }

    it('should create rules with selectedContactId validation', () => {
      const rules = createInvoicesSecondStepFormRules(translations)

      expect(rules.selectedContactId).toBeDefined()
      expect(rules.selectedContactId).toHaveLength(1)
    })

    it('should reject a missing contact with the provided translation', () => {
      const rules = createInvoicesSecondStepFormRules(translations)
      const contactRules = rules.selectedContactId as FormItemRule[]

      expect(runRule(contactRules[0], null)).toEqual(new Error(translations.contactRequired))
    })

    it('should accept a selected contact', () => {
      const rules = createInvoicesSecondStepFormRules(translations)
      const contactRules = rules.selectedContactId as FormItemRule[]

      expect(runRule(contactRules[0], 'contact-123')).toBeUndefined()
    })

    it('should have trigger set to change', () => {
      const rules = createInvoicesSecondStepFormRules(translations)
      const contactRules = rules.selectedContactId as FormItemRule[]

      expect(contactRules[0].trigger).toBe('change')
    })
  })
})
