import { createInvoicesSecondStepFormRules } from './invoices-second-step.form.validation'
import type { InvoicesSecondStepFormModel } from './invoices-second-step.form.types'

vi.mock('@pulse/styleguide/utils/validators', () => ({
  validationRules: {
    requiredSelect: vi.fn((message: string) => ({ type: 'required', message, trigger: 'change' })),
  },
}))

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

    it('should use provided translation for contact required rule', () => {
      const rules = createInvoicesSecondStepFormRules(translations)
      const contactRules = rules.selectedContactId as Array<{ message: string }>

      expect(contactRules[0].message).toBe(translations.contactRequired)
    })

    it('should have trigger set to change', () => {
      const rules = createInvoicesSecondStepFormRules(translations)
      const contactRules = rules.selectedContactId as Array<{ trigger: string }>

      expect(contactRules[0].trigger).toBe('change')
    })
  })
})
