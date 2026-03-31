import { ref, computed } from 'vue'
import type { ProspectCreationDrawerStep } from '@entities/modules/wallet/enums'
import type { ProspectFormData } from './prospect-creation-drawer.type'

export function useProspectCreationDrawer(steps: ProspectCreationDrawerStep[]) {
  const stepIndex = ref(0)

  const formData = ref<ProspectFormData>({
    information: '',
    company: '',
    contact: '',
  })

  const currentStep = computed(() => steps[stepIndex.value])
  const isFirstStep = computed(() => stepIndex.value === 0)
  const isLastStep = computed(() => stepIndex.value >= steps.length - 1)

  function goNextStep() {
    if (isLastStep.value) {
      return
    }
    stepIndex.value = stepIndex.value + 1
  }

  function goPreviousStep() {
    if (isFirstStep.value) {
      return
    }
    stepIndex.value = stepIndex.value - 1
  }

  return {
    stepIndex,
    formData,
    currentStep,
    isFirstStep,
    isLastStep,
    goNextStep,
    goPreviousStep,
  }
}
