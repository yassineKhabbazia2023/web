import { ref, computed } from 'vue'
import { PennylaneAmendmentStep } from './pennylane-amendment-flow-dialog.enum'
import { PENNYLANE_AMENDMENT_STEPS } from './pennylane-amendment-flow-dialog.const'

export function usePennylaneAmendmentSteps() {
  const currentStepIndex = ref(0)
  const isTermsAccepted = ref(false)
  const isTermsScrolledToBottom = ref(false)

  const currentStep = computed(() => PENNYLANE_AMENDMENT_STEPS[currentStepIndex.value])

  const isFirstStep = computed(() => currentStepIndex.value === 0)

  const isLastStep = computed(() => {
    return currentStepIndex.value >= PENNYLANE_AMENDMENT_STEPS.length - 1
  })

  const isNextButtonDisabled = computed(() => {
    switch (currentStep.value) {
      case PennylaneAmendmentStep.INFORMATION:
      case PennylaneAmendmentStep.ACCOUNTS_PRICING:
        return false

      case PennylaneAmendmentStep.TERMS_PREVIEW:
        return isTermsScrolledToBottom.value === false

      case PennylaneAmendmentStep.ACCEPTANCE:
        return isTermsAccepted.value === false

      default:
        return false
    }
  })

  function handleNext() {
    if (isLastStep.value) {
      return
    }
    isTermsScrolledToBottom.value = false
    currentStepIndex.value += 1
  }

  function handlePrevious() {
    if (isFirstStep.value === true) {
      return
    }
    isTermsScrolledToBottom.value = false
    isTermsAccepted.value = false
    currentStepIndex.value -= 1
  }

  function setTermsScrollComplete() {
    isTermsScrolledToBottom.value = true
  }

  function setTermsAccepted(value: boolean) {
    isTermsAccepted.value = value
  }

  function reset() {
    currentStepIndex.value = 0
    isTermsAccepted.value = false
    isTermsScrolledToBottom.value = false
  }

  return {
    currentStep,
    currentStepIndex,
    isFirstStep,
    isLastStep,
    isNextButtonDisabled,
    isTermsAccepted,
    handleNext,
    handlePrevious,
    setTermsScrollComplete,
    setTermsAccepted,
    reset,
  }
}
