import { computed, onMounted, ref } from 'vue'
import { logger } from '@pulse/toolbox'
import { ProspectsService } from '@entities/services/prospects/prospects.service'
import type { OnboardingStepResponse } from '@entities/services/prospects/prospects.types'
import { OnboardingStep, OnboardingStepStatus } from './prospect-conformity.enums'
import { PROSPECT_CONFORMITY_STEPS } from './prospect-conformity.consts'

export function useOnboardingSteps(getAccountId: () => number | null | undefined) {
  const onboardingSteps = ref<OnboardingStepResponse[]>([])
  const isLoadingSteps = ref(true)

  const stepStatusById = computed(() => {
    const statusById = new Map<OnboardingStep, OnboardingStepStatus>()
    onboardingSteps.value.forEach((step) => statusById.set(step.id, step.status))
    return statusById
  })

  // Steps to render, in front-defined display order: only the steps the API
  // returned exist for this prospect. Empty while loading and after a failed fetch.
  const availableSteps = computed(() =>
    PROSPECT_CONFORMITY_STEPS.filter((step) => stepStatusById.value.has(step.id)),
  )

  const completedCount = computed(
    () => onboardingSteps.value.filter((step) => step.status === OnboardingStepStatus.Completed).length,
  )
  const totalCount = computed(() => onboardingSteps.value.length)

  // False while loading and after a failed fetch (empty array): an unknown
  // dossier must not be presented as complete.
  const areAllStepsCompleted = computed(
    () => onboardingSteps.value.length > 0 &&
      onboardingSteps.value.every((step) => step.status === OnboardingStepStatus.Completed),
  )

  const reload = async (): Promise<void> => {
    const accountId = getAccountId()
    if (accountId === undefined || accountId === null) {
      isLoadingSteps.value = false
      return
    }
    try {
      const steps = await ProspectsService.fetchOnboardingSteps(accountId)
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
    availableSteps,
    completedCount,
    totalCount,
    areAllStepsCompleted,
    isLoadingSteps,
    reload,
  }
}
