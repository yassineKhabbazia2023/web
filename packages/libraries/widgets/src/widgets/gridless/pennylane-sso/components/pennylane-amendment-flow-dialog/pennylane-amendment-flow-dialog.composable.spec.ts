import { usePennylaneAmendmentFlow } from './pennylane-amendment-flow-dialog.composable'
import { PennylaneAmendmentStep } from './pennylane-amendment-flow-dialog.enum'
import { PENNYLANE_AMENDMENT_STEPS } from './pennylane-amendment-flow-dialog.const'

describe('usePennylaneAmendmentFlow', () => {
  describe('initial state', () => {
    it('should start at step index 0', () => {
      const { currentStepIndex } = usePennylaneAmendmentFlow()
      expect(currentStepIndex.value).toBe(0)
    })

    it('should have terms not accepted initially', () => {
      const { isTermsAccepted } = usePennylaneAmendmentFlow()
      expect(isTermsAccepted.value).toBe(false)
    })

    it('should return INFORMATION as current step initially', () => {
      const { currentStep } = usePennylaneAmendmentFlow()
      expect(currentStep.value).toBe(PennylaneAmendmentStep.INFORMATION)
    })

    it('should be first step initially', () => {
      const { isFirstStep } = usePennylaneAmendmentFlow()
      expect(isFirstStep.value).toBe(true)
    })

    it('should not be last step initially', () => {
      const { isLastStep } = usePennylaneAmendmentFlow()
      expect(isLastStep.value).toBe(false)
    })
  })

  describe('goNext', () => {
    it('should increment step index', () => {
      const { currentStepIndex, goNext } = usePennylaneAmendmentFlow()

      goNext()

      expect(currentStepIndex.value).toBe(1)
    })

    it('should update currentStep after goNext', () => {
      const { currentStep, goNext } = usePennylaneAmendmentFlow()

      goNext()

      expect(currentStep.value).toBe(PennylaneAmendmentStep.ACCOUNTS_PRICING)
    })

    it('should not go past last step', () => {
      const { currentStepIndex, goNext, isLastStep } = usePennylaneAmendmentFlow()

      for (let i = 0; i < PENNYLANE_AMENDMENT_STEPS.length; i++) {
        goNext()
      }

      expect(isLastStep.value).toBe(true)
      expect(currentStepIndex.value).toBe(PENNYLANE_AMENDMENT_STEPS.length - 1)
    })

    it('should update isFirstStep to false after goNext', () => {
      const { isFirstStep, goNext } = usePennylaneAmendmentFlow()

      goNext()

      expect(isFirstStep.value).toBe(false)
    })
  })

  describe('goPrevious', () => {
    it('should decrement step index', () => {
      const { currentStepIndex, goNext, goPrevious } = usePennylaneAmendmentFlow()

      goNext()
      goNext()
      goPrevious()

      expect(currentStepIndex.value).toBe(1)
    })

    it('should not go before first step', () => {
      const { currentStepIndex, goPrevious, isFirstStep } = usePennylaneAmendmentFlow()

      goPrevious()
      goPrevious()

      expect(isFirstStep.value).toBe(true)
      expect(currentStepIndex.value).toBe(0)
    })

    it('should update currentStep after goPrevious', () => {
      const { currentStep, goNext, goPrevious } = usePennylaneAmendmentFlow()

      goNext()
      goNext()
      goPrevious()

      expect(currentStep.value).toBe(PennylaneAmendmentStep.ACCOUNTS_PRICING)
    })
  })

  describe('reset', () => {
    it('should reset step index to 0', () => {
      const { currentStepIndex, goNext, reset } = usePennylaneAmendmentFlow()

      goNext()
      goNext()
      reset()

      expect(currentStepIndex.value).toBe(0)
    })

    it('should reset terms accepted to false', () => {
      const { isTermsAccepted, reset } = usePennylaneAmendmentFlow()

      isTermsAccepted.value = true
      reset()

      expect(isTermsAccepted.value).toBe(false)
    })

    it('should return to first step after reset', () => {
      const { isFirstStep, goNext, reset } = usePennylaneAmendmentFlow()

      goNext()
      goNext()
      reset()

      expect(isFirstStep.value).toBe(true)
    })
  })

  describe('isNextButtonDisabled', () => {
    it('should return false for INFORMATION step', () => {
      const { isNextButtonDisabled, currentStep } = usePennylaneAmendmentFlow()

      expect(currentStep.value).toBe(PennylaneAmendmentStep.INFORMATION)
      expect(isNextButtonDisabled.value).toBe(false)
    })

    it('should return false for ACCOUNTS_PRICING step', () => {
      const { isNextButtonDisabled, goNext, currentStep } = usePennylaneAmendmentFlow()

      goNext()

      expect(currentStep.value).toBe(PennylaneAmendmentStep.ACCOUNTS_PRICING)
      expect(isNextButtonDisabled.value).toBe(false)
    })

    it('should return false for TERMS_PREVIEW step', () => {
      const { isNextButtonDisabled, goNext, currentStep } = usePennylaneAmendmentFlow()

      goNext()
      goNext()

      expect(currentStep.value).toBe(PennylaneAmendmentStep.TERMS_PREVIEW)
      expect(isNextButtonDisabled.value).toBe(false)
    })

    it('should return true for ACCEPTANCE step when terms not accepted', () => {
      const { isNextButtonDisabled, goNext, currentStep, isTermsAccepted } = usePennylaneAmendmentFlow()

      goNext()
      goNext()
      goNext()

      expect(currentStep.value).toBe(PennylaneAmendmentStep.ACCEPTANCE)
      expect(isTermsAccepted.value).toBe(false)
      expect(isNextButtonDisabled.value).toBe(true)
    })

    it('should return false for ACCEPTANCE step when terms accepted', () => {
      const { isNextButtonDisabled, goNext, currentStep, isTermsAccepted } = usePennylaneAmendmentFlow()

      goNext()
      goNext()
      goNext()
      isTermsAccepted.value = true

      expect(currentStep.value).toBe(PennylaneAmendmentStep.ACCEPTANCE)
      expect(isNextButtonDisabled.value).toBe(false)
    })
  })

  describe('isLastStep', () => {
    it('should return true when at last step', () => {
      const { isLastStep, goNext } = usePennylaneAmendmentFlow()

      for (let i = 0; i < PENNYLANE_AMENDMENT_STEPS.length - 1; i++) {
        goNext()
      }

      expect(isLastStep.value).toBe(true)
    })

    it('should return false when not at last step', () => {
      const { isLastStep, goNext } = usePennylaneAmendmentFlow()

      goNext()

      expect(isLastStep.value).toBe(false)
    })
  })

  describe('currentStep computed', () => {
    it('should return correct step for each index', () => {
      const { currentStep, goNext } = usePennylaneAmendmentFlow()

      expect(currentStep.value).toBe(PennylaneAmendmentStep.INFORMATION)

      goNext()
      expect(currentStep.value).toBe(PennylaneAmendmentStep.ACCOUNTS_PRICING)

      goNext()
      expect(currentStep.value).toBe(PennylaneAmendmentStep.TERMS_PREVIEW)

      goNext()
      expect(currentStep.value).toBe(PennylaneAmendmentStep.ACCEPTANCE)
    })
  })
})
