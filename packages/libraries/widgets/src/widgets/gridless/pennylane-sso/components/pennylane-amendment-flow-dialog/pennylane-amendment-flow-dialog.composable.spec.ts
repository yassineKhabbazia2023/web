import { usePennylaneAmendmentSteps } from './pennylane-amendment-flow-dialog.composable'
import { PennylaneAmendmentStep } from './pennylane-amendment-flow-dialog.enum'
import { PENNYLANE_AMENDMENT_STEPS } from './pennylane-amendment-flow-dialog.const'

describe('usePennylaneAmendmentSteps', () => {
  describe('initial state', () => {
    it('should start at step index 0', () => {
      const { currentStepIndex } = usePennylaneAmendmentSteps()
      expect(currentStepIndex.value).toBe(0)
    })

    it('should have terms not accepted initially', () => {
      const { isTermsAccepted } = usePennylaneAmendmentSteps()
      expect(isTermsAccepted.value).toBe(false)
    })

    it('should return INFORMATION as current step initially', () => {
      const { currentStep } = usePennylaneAmendmentSteps()
      expect(currentStep.value).toBe(PennylaneAmendmentStep.INFORMATION)
    })

    it('should be first step initially', () => {
      const { isFirstStep } = usePennylaneAmendmentSteps()
      expect(isFirstStep.value).toBe(true)
    })

    it('should not be last step initially', () => {
      const { isLastStep } = usePennylaneAmendmentSteps()
      expect(isLastStep.value).toBe(false)
    })
  })

  describe('handleNext', () => {
    it('should increment step index', () => {
      const { currentStepIndex, handleNext } = usePennylaneAmendmentSteps()

      handleNext()

      expect(currentStepIndex.value).toBe(1)
    })

    it('should update currentStep after handleNext', () => {
      const { currentStep, handleNext } = usePennylaneAmendmentSteps()

      handleNext()

      expect(currentStep.value).toBe(PennylaneAmendmentStep.ACCOUNTS_PRICING)
    })

    it('should not go past last step', () => {
      const { currentStepIndex, handleNext, isLastStep } = usePennylaneAmendmentSteps()

      for (let i = 0; i < PENNYLANE_AMENDMENT_STEPS.length; i++) {
        handleNext()
      }

      expect(isLastStep.value).toBe(true)
      expect(currentStepIndex.value).toBe(PENNYLANE_AMENDMENT_STEPS.length - 1)
    })

    it('should update isFirstStep to false after handleNext', () => {
      const { isFirstStep, handleNext } = usePennylaneAmendmentSteps()

      handleNext()

      expect(isFirstStep.value).toBe(false)
    })
  })

  describe('handlePrevious', () => {
    it('should decrement step index', () => {
      const { currentStepIndex, handleNext, handlePrevious } = usePennylaneAmendmentSteps()

      handleNext()
      handleNext()
      handlePrevious()

      expect(currentStepIndex.value).toBe(1)
    })

    it('should not go before first step', () => {
      const { currentStepIndex, handlePrevious, isFirstStep } = usePennylaneAmendmentSteps()

      handlePrevious()
      handlePrevious()

      expect(isFirstStep.value).toBe(true)
      expect(currentStepIndex.value).toBe(0)
    })

    it('should update currentStep after handlePrevious', () => {
      const { currentStep, handleNext, handlePrevious } = usePennylaneAmendmentSteps()

      handleNext()
      handleNext()
      handlePrevious()

      expect(currentStep.value).toBe(PennylaneAmendmentStep.ACCOUNTS_PRICING)
    })
  })

  describe('reset', () => {
    it('should reset step index to 0', () => {
      const { currentStepIndex, handleNext, reset } = usePennylaneAmendmentSteps()

      handleNext()
      handleNext()
      reset()

      expect(currentStepIndex.value).toBe(0)
    })

    it('should reset terms accepted to false', () => {
      const { isTermsAccepted, reset } = usePennylaneAmendmentSteps()

      isTermsAccepted.value = true
      reset()

      expect(isTermsAccepted.value).toBe(false)
    })

    it('should return to first step after reset', () => {
      const { isFirstStep, handleNext, reset } = usePennylaneAmendmentSteps()

      handleNext()
      handleNext()
      reset()

      expect(isFirstStep.value).toBe(true)
    })
  })

  describe('isNextButtonDisabled', () => {
    it('should return false for INFORMATION step', () => {
      const { isNextButtonDisabled, currentStep } = usePennylaneAmendmentSteps()

      expect(currentStep.value).toBe(PennylaneAmendmentStep.INFORMATION)
      expect(isNextButtonDisabled.value).toBe(false)
    })

    it('should return false for ACCOUNTS_PRICING step', () => {
      const { isNextButtonDisabled, handleNext, currentStep } = usePennylaneAmendmentSteps()

      handleNext()

      expect(currentStep.value).toBe(PennylaneAmendmentStep.ACCOUNTS_PRICING)
      expect(isNextButtonDisabled.value).toBe(false)
    })

    it('should return true for TERMS_PREVIEW step when not scrolled to bottom', () => {
      const { isNextButtonDisabled, handleNext, currentStep } = usePennylaneAmendmentSteps()

      handleNext()
      handleNext()

      expect(currentStep.value).toBe(PennylaneAmendmentStep.TERMS_PREVIEW)
      expect(isNextButtonDisabled.value).toBe(true)
    })

    it('should return false for TERMS_PREVIEW step when scrolled to bottom', () => {
      const { isNextButtonDisabled, handleNext, currentStep, setTermsScrollComplete } = usePennylaneAmendmentSteps()

      handleNext()
      handleNext()
      setTermsScrollComplete()

      expect(currentStep.value).toBe(PennylaneAmendmentStep.TERMS_PREVIEW)
      expect(isNextButtonDisabled.value).toBe(false)
    })

    it('should return true for ACCEPTANCE step when terms not accepted', () => {
      const { isNextButtonDisabled, handleNext, currentStep, isTermsAccepted } = usePennylaneAmendmentSteps()

      handleNext()
      handleNext()
      handleNext()

      expect(currentStep.value).toBe(PennylaneAmendmentStep.ACCEPTANCE)
      expect(isTermsAccepted.value).toBe(false)
      expect(isNextButtonDisabled.value).toBe(true)
    })

    it('should return false for ACCEPTANCE step when terms accepted', () => {
      const { isNextButtonDisabled, handleNext, currentStep, isTermsAccepted } = usePennylaneAmendmentSteps()

      handleNext()
      handleNext()
      handleNext()
      isTermsAccepted.value = true

      expect(currentStep.value).toBe(PennylaneAmendmentStep.ACCEPTANCE)
      expect(isNextButtonDisabled.value).toBe(false)
    })
  })

  describe('isLastStep', () => {
    it('should return true when at last step', () => {
      const { isLastStep, handleNext } = usePennylaneAmendmentSteps()

      for (let i = 0; i < PENNYLANE_AMENDMENT_STEPS.length - 1; i++) {
        handleNext()
      }

      expect(isLastStep.value).toBe(true)
    })

    it('should return false when not at last step', () => {
      const { isLastStep, handleNext } = usePennylaneAmendmentSteps()

      handleNext()

      expect(isLastStep.value).toBe(false)
    })
  })

  describe('currentStep computed', () => {
    it('should return correct step for each index', () => {
      const { currentStep, handleNext } = usePennylaneAmendmentSteps()

      expect(currentStep.value).toBe(PennylaneAmendmentStep.INFORMATION)

      handleNext()
      expect(currentStep.value).toBe(PennylaneAmendmentStep.ACCOUNTS_PRICING)

      handleNext()
      expect(currentStep.value).toBe(PennylaneAmendmentStep.TERMS_PREVIEW)

      handleNext()
      expect(currentStep.value).toBe(PennylaneAmendmentStep.ACCEPTANCE)
    })
  })

  describe('setTermsAccepted', () => {
    it('should set terms accepted to true', () => {
      const { isTermsAccepted, setTermsAccepted } = usePennylaneAmendmentSteps()

      expect(isTermsAccepted.value).toBe(false)

      setTermsAccepted(true)

      expect(isTermsAccepted.value).toBe(true)
    })

    it('should set terms accepted to false', () => {
      const { isTermsAccepted, setTermsAccepted } = usePennylaneAmendmentSteps()

      setTermsAccepted(true)
      expect(isTermsAccepted.value).toBe(true)

      setTermsAccepted(false)
      expect(isTermsAccepted.value).toBe(false)
    })
  })

  describe('setTermsScrollComplete', () => {
    it('should set isTermsScrolledToBottom to true', () => {
      const { setTermsScrollComplete, handleNext, currentStep, isNextButtonDisabled } = usePennylaneAmendmentSteps()

      handleNext()
      handleNext()

      expect(currentStep.value).toBe(PennylaneAmendmentStep.TERMS_PREVIEW)
      expect(isNextButtonDisabled.value).toBe(true)

      setTermsScrollComplete()

      expect(isNextButtonDisabled.value).toBe(false)
    })
  })

  describe('handlePrevious resets state', () => {
    it('should reset isTermsScrolledToBottom when going back', () => {
      const { handleNext, handlePrevious, setTermsScrollComplete, isNextButtonDisabled, currentStep } = usePennylaneAmendmentSteps()

      handleNext()
      handleNext()
      setTermsScrollComplete()

      expect(currentStep.value).toBe(PennylaneAmendmentStep.TERMS_PREVIEW)
      expect(isNextButtonDisabled.value).toBe(false)

      handlePrevious()
      handleNext()

      expect(currentStep.value).toBe(PennylaneAmendmentStep.TERMS_PREVIEW)
      expect(isNextButtonDisabled.value).toBe(true)
    })

    it('should reset isTermsAccepted when going back', () => {
      const { handleNext, handlePrevious, setTermsAccepted, isTermsAccepted, currentStep } = usePennylaneAmendmentSteps()

      handleNext()
      handleNext()
      handleNext()
      setTermsAccepted(true)

      expect(currentStep.value).toBe(PennylaneAmendmentStep.ACCEPTANCE)
      expect(isTermsAccepted.value).toBe(true)

      handlePrevious()

      expect(isTermsAccepted.value).toBe(false)
    })
  })

  describe('handleNext resets scroll state', () => {
    it('should reset isTermsScrolledToBottom when advancing', () => {
      const { handleNext, handlePrevious, setTermsScrollComplete, isNextButtonDisabled, currentStep } = usePennylaneAmendmentSteps()

      handleNext()
      handleNext()
      setTermsScrollComplete()

      expect(currentStep.value).toBe(PennylaneAmendmentStep.TERMS_PREVIEW)
      expect(isNextButtonDisabled.value).toBe(false)

      handleNext()
      handlePrevious()

      expect(currentStep.value).toBe(PennylaneAmendmentStep.TERMS_PREVIEW)
      expect(isNextButtonDisabled.value).toBe(true)
    })
  })
})
