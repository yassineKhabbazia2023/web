import { InvoicesFormStep } from '../../invoices.enums'
import { useInvoicesForm } from './invoices.form.composable'

describe('useInvoicesForm', () => {
  describe('initial state', () => {
    it('should return currentStep with initial value of EMAIL_AND_TERMS', () => {
      const { currentStep } = useInvoicesForm()

      expect(currentStep.value).toBe(InvoicesFormStep.EMAIL_AND_TERMS)
    })

    it('should return formData with initial empty values', () => {
      const { formData } = useInvoicesForm()

      expect(formData.value).toEqual({
        email: '',
        acceptTerms: false,
        selectedContactId: null,
      })
    })

    it('should return goToNextStep function', () => {
      const { goToNextStep } = useInvoicesForm()

      expect(goToNextStep).toBeInstanceOf(Function)
    })

    it('should return goToPreviousStep function', () => {
      const { goToPreviousStep } = useInvoicesForm()

      expect(goToPreviousStep).toBeInstanceOf(Function)
    })

    it('should return goToVaultBeingCreated function', () => {
      const { goToVaultBeingCreated } = useInvoicesForm()

      expect(goToVaultBeingCreated).toBeInstanceOf(Function)
    })
  })

  describe('goToNextStep', () => {
    it('should set currentStep to SELECT_CONTACT', () => {
      const { currentStep, goToNextStep } = useInvoicesForm()

      goToNextStep()

      expect(currentStep.value).toBe(InvoicesFormStep.SELECT_CONTACT)
    })

    it('should not go beyond the last step', () => {
      const { currentStep, goToNextStep } = useInvoicesForm()

      goToNextStep()
      goToNextStep()

      expect(currentStep.value).toBe(InvoicesFormStep.SELECT_CONTACT)
    })
  })

  describe('goToPreviousStep', () => {
    it('should set currentStep to EMAIL_AND_TERMS', () => {
      const { currentStep, goToNextStep, goToPreviousStep } = useInvoicesForm()

      goToNextStep()
      expect(currentStep.value).toBe(InvoicesFormStep.SELECT_CONTACT)

      goToPreviousStep()
      expect(currentStep.value).toBe(InvoicesFormStep.EMAIL_AND_TERMS)
    })

    it('should not go below the first step', () => {
      const { currentStep, goToPreviousStep } = useInvoicesForm()

      goToPreviousStep()

      expect(currentStep.value).toBe(InvoicesFormStep.EMAIL_AND_TERMS)
    })
  })

  describe('goToVaultBeingCreated', () => {
    it('should set currentStep to VAULT_BEING_CREATED', () => {
      const { currentStep, goToVaultBeingCreated } = useInvoicesForm()

      goToVaultBeingCreated()

      expect(currentStep.value).toBe(InvoicesFormStep.VAULT_BEING_CREATED)
    })

    it('should set currentStep to VAULT_BEING_CREATED from any step', () => {
      const { currentStep, goToNextStep, goToVaultBeingCreated } = useInvoicesForm()

      goToNextStep()
      expect(currentStep.value).toBe(InvoicesFormStep.SELECT_CONTACT)

      goToVaultBeingCreated()

      expect(currentStep.value).toBe(InvoicesFormStep.VAULT_BEING_CREATED)
    })
  })

  describe('formData persistence', () => {
    it('should preserve formData when navigating between steps', () => {
      const { formData, goToNextStep, goToPreviousStep } = useInvoicesForm()

      formData.value.email = 'test@example.com'
      formData.value.acceptTerms = true

      goToNextStep()

      formData.value.selectedContactId = 12345

      goToPreviousStep()

      expect(formData.value).toEqual({
        email: 'test@example.com',
        acceptTerms: true,
        selectedContactId: 12345,
      })
    })
  })
})
