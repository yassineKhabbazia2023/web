import { computed, onMounted, ref } from 'vue'
import { logger } from '@pulse/toolbox'
import { ProspectsService } from '@entities/services/prospects/prospects.service'
import type { OnboardingStepResponse } from '@entities/services/prospects/prospects.types'
import { OnboardingStep, OnboardingStepStatus } from './prospect-conformity.enums'

export function useOnboardingSteps(getProspectId: () => number | null | undefined) {
  const onboardingSteps = ref<OnboardingStepResponse[]>([])
  const isLoadingSteps = ref(true)

  const stepStatusById = computed(() => {
    const statusById = new Map<OnboardingStep, OnboardingStepStatus>()
    onboardingSteps.value.forEach((step) => statusById.set(step.id, step.status))
    return statusById
  })

  const completedCount = computed(
    () => onboardingSteps.value.filter((step) => step.status === OnboardingStepStatus.Completed).length,
  )
  const totalCount = computed(() => onboardingSteps.value.length)

  const reload = async (): Promise<void> => {
    const prospectId = getProspectId()
    if (prospectId === undefined || prospectId === null) {
      isLoadingSteps.value = false
      return
    }
    try {
      const steps = await ProspectsService.fetchOnboardingSteps(prospectId)
      if (steps !== undefined) {
        onboardingSteps.value = steps
      }
    } catch (error) {
      logger.error('Failed to load onboarding steps', error)
    } finally {
      isLoadingSteps.value = false
    }
  }

  onMounted(reload)

  return {
    stepStatusById,
    completedCount,
    totalCount,
    isLoadingSteps,
    reload,
  }
}
