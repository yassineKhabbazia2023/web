import { computed, ref } from 'vue'
import type { InvoicesFullFormModel } from '@entities/modules/entity/types'
import { InvoicesFormStep } from '../../invoices.enums'
import { INVOICES_STEPS_ORDER, TOTAL_STEPS } from '../../invoices.constants'


export function useInvoicesForm() {
  const currentStep = ref<InvoicesFormStep>(INVOICES_STEPS_ORDER[0])

  const currentStepIndex = computed(() =>
    INVOICES_STEPS_ORDER.indexOf(currentStep.value),
  )

  const formData = ref<InvoicesFullFormModel>({
    email: '',
    acceptTerms: false,
    selectedContactId: null,
  })

  const goToNextStep = () => {
    const nextIndex = currentStepIndex.value + 1
    if (nextIndex < INVOICES_STEPS_ORDER.length) {
      currentStep.value = INVOICES_STEPS_ORDER[nextIndex]
    }
  }

  const goToPreviousStep = () => {
    const prevIndex = currentStepIndex.value - 1
    if (prevIndex >= 0) {
      currentStep.value = INVOICES_STEPS_ORDER[prevIndex]
    }
  }

  const goToVaultBeingCreated = () => {
    currentStep.value = InvoicesFormStep.VAULT_BEING_CREATED
  }

  return {
    TOTAL_STEPS,
    currentStep,
    formData,
    goToNextStep,
    goToPreviousStep,
    goToVaultBeingCreated,
  }
}
