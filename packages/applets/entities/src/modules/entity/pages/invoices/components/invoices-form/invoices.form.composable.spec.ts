import { useInvoicesForm } from './invoices.form.composable'
import type { InvoicesFormModel } from '@entities/modules/entity/types'

describe('useInvoicesForm', () => {
  describe('initial state', () => {
    it('should return currentStep with initial value of 1', () => {
      const { currentStep } = useInvoicesForm()

      expect(currentStep.value).toBe(1)
    })

    it('should return formData with initial value of null', () => {
      const { formData } = useInvoicesForm()

      expect(formData.value).toBeNull()
    })

    it('should return handleNext function', () => {
      const { handleNext } = useInvoicesForm()

      expect(handleNext).toBeInstanceOf(Function)
    })

    it('should return handleBack function', () => {
      const { handleBack } = useInvoicesForm()

      expect(handleBack).toBeInstanceOf(Function)
    })
  })

  describe('handleNext', () => {
    it('should set formData with provided data', () => {
      const { formData, handleNext } = useInvoicesForm()
      const data: InvoicesFormModel = {
        email: 'test@example.com',
        acceptTerms: true,
      }

      handleNext(data)

      expect(formData.value).toEqual(data)
    })

    it('should set currentStep to 2', () => {
      const { currentStep, handleNext } = useInvoicesForm()
      const data: InvoicesFormModel = {
        email: 'test@example.com',
        acceptTerms: true,
      }

      handleNext(data)

      expect(currentStep.value).toBe(2)
    })

    it('should preserve previous formData when called again', () => {
      const { formData, handleNext } = useInvoicesForm()
      const firstData: InvoicesFormModel = {
        email: 'first@example.com',
        acceptTerms: true,
      }
      const secondData: InvoicesFormModel = {
        email: 'second@example.com',
        acceptTerms: false,
      }

      handleNext(firstData)
      handleNext(secondData)

      expect(formData.value).toEqual(secondData)
    })
  })

  describe('handleBack', () => {
    it('should set currentStep to 1', () => {
      const { currentStep, handleNext, handleBack } = useInvoicesForm()
      const data: InvoicesFormModel = {
        email: 'test@example.com',
        acceptTerms: true,
      }

      handleNext(data)
      expect(currentStep.value).toBe(2)

      handleBack()
      expect(currentStep.value).toBe(1)
    })

    it('should not change formData when going back', () => {
      const { formData, handleNext, handleBack } = useInvoicesForm()
      const data: InvoicesFormModel = {
        email: 'test@example.com',
        acceptTerms: true,
      }

      handleNext(data)
      handleBack()

      expect(formData.value).toEqual(data)
    })

    it('should work even when already on step 1', () => {
      const { currentStep, handleBack } = useInvoicesForm()

      handleBack()

      expect(currentStep.value).toBe(1)
    })
  })
})
