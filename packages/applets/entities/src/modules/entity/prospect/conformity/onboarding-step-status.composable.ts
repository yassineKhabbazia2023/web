import { onMounted, ref } from 'vue'
import type { Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { logger, isNotNullNorEmpty } from '@pulse/toolbox'
import { useCurrentEntityStore } from '@pulse/common/stores'
import { ProspectsService } from '@entities/services/prospects/prospects.service'
import type { OnboardingStep, OnboardingStepStatus } from './prospect-conformity.enums'

// Each conformity section owns its own status: the /steps (plural) call only feeds the stepper,
// while every section that needs its status fetches it from the individual /step endpoint.
export function useOnboardingStepStatus(stepId: OnboardingStep) {
  const { currentEntityId } = storeToRefs(useCurrentEntityStore())

  const status = ref<OnboardingStepStatus>()
  // Initial mount → drives the section skeleton. Never re-toggled afterwards.
  const isLoadingStatus = ref(true)
  // Post-action reloads → drives a PLoader, so the section refreshes in place without flashing its skeleton.
  const isRefreshingStatus = ref(false)

  const loadStatus = async (loadingFlag: Ref<boolean>): Promise<void> => {
    if (isNotNullNorEmpty(currentEntityId.value) === false) {
      loadingFlag.value = false
      return
    }
    loadingFlag.value = true
    try {
      const response = await ProspectsService.fetchOnboardingStep(currentEntityId.value, stepId)
      status.value = response?.status
    } catch (error) {
      logger.error('Failed to load onboarding step status', error)
    } finally {
      loadingFlag.value = false
    }
  }

  const reloadStatus = (): Promise<void> => loadStatus(isRefreshingStatus)

  onMounted(() => loadStatus(isLoadingStatus))

  return {
    status,
    isLoadingStatus,
    isRefreshingStatus,
    reloadStatus,
  }
}
