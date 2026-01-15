import { ref, computed } from 'vue'
import { PennylaneAmendmentStep } from './pennylane-amendment-flow-dialog.enum'
import { PENNYLANE_AMENDMENT_STEPS } from './pennylane-amendment-flow-dialog.const'

export function usePennylaneAmendmentFlow() {
  const currentStepIndex = ref(0)
  const isTermsAccepted = ref(false)

  const currentStep = computed(() => PENNYLANE_AMENDMENT_STEPS[currentStepIndex.value])

  const isFirstStep = computed(() => currentStepIndex.value === 0)

  const isLastStep = computed(() => {
    return currentStepIndex.value >= PENNYLANE_AMENDMENT_STEPS.length - 1
  })

  const isNextButtonDisabled = computed(() => {
    switch (currentStep.value) {
      case PennylaneAmendmentStep.INFORMATION:
      case PennylaneAmendmentStep.ACCOUNTS_PRICING:
      case PennylaneAmendmentStep.TERMS_PREVIEW:
        return false

      case PennylaneAmendmentStep.ACCEPTANCE:
        return isTermsAccepted.value === false

      default:
        return false
    }
  })

  function goNext() {
    if (isLastStep.value === true) {
      return
    }
    currentStepIndex.value += 1
  }

  function goPrevious() {
    if (isFirstStep.value === true) {
      return
    }
    currentStepIndex.value -= 1
  }

  function reset() {
    currentStepIndex.value = 0
    isTermsAccepted.value = false
  }

  return {
    currentStepIndex,
    currentStep,
    isFirstStep,
    isLastStep,
    isNextButtonDisabled,
    isTermsAccepted,
    goNext,
    goPrevious,
    reset,
  }
}
