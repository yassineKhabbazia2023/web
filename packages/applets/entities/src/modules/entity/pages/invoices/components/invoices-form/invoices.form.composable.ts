import { ref } from 'vue'
import type { InvoicesFormModel } from '@entities/modules/entity/types'


export function useInvoicesForm() {
  const TOTAL_STEPS = 2

  const currentStep = ref(1)
  const formData = ref<InvoicesFormModel | null>(null)

  const handleNext = (data: InvoicesFormModel) => {
    formData.value = data
    currentStep.value = 2
  }

  const handleBack = () => {
    currentStep.value = 1
  }

  return {
    TOTAL_STEPS,
    currentStep,
    formData,
    handleNext,
    handleBack,
  }
}
