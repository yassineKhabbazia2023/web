import { onMounted, ref } from 'vue'
import type { Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { logger, isNotNullNorEmpty } from '@pulse/toolbox'
import { useCurrentEntityStore } from '@pulse/common/stores'
import { ProspectsService } from '@entities/services/prospects/prospects.service'
import type { OnboardingStep, OnboardingStepStatus } from './prospect-conformity.enums'

// Each conformity section owns its own status: the /steps (plural) call only feeds the stepper,
// while every section that needs its status fetches it from the individual /step endpoint.
// Sections denied by permissions are not mounted by the parent, so they never reach this fetch.
// isEnabled is only for a section that stays mounted without access or while its step may not
// exist (conformity-documents): a denied or nonexistent step has no status to fetch.
export function useOnboardingStepStatus(stepId: OnboardingStep, isEnabled?: Ref<boolean>) {
  const { currentEntityId } = storeToRefs(useCurrentEntityStore())

  const status = ref<OnboardingStepStatus>()
  // Initial mount → drives the section skeleton. Never re-toggled afterwards.
  const isLoadingStatus = ref(true)
  // Post-action reloads → drives a PLoader, so the section refreshes in place without flashing its skeleton.
  const isRefreshingStatus = ref(false)
  const hasStatusError = ref(false)

  const loadStatus = async (loadingFlag: Ref<boolean>): Promise<void> => {
    // A disabled section never renders its status, so it must not be fetched.
    if (isEnabled?.value === false) {
      loadingFlag.value = false
      return
    }
    if (isNotNullNorEmpty(currentEntityId.value) === false) {
      loadingFlag.value = false
      return
    }
    loadingFlag.value = true
    hasStatusError.value = false
    try {
      const response = await ProspectsService.fetchOnboardingStep(currentEntityId.value, stepId)
      status.value = response?.status
    } catch (error) {
      logger.error('Failed to load onboarding step status', error)
      hasStatusError.value = true
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
    hasStatusError,
    reloadStatus,
  }
}
