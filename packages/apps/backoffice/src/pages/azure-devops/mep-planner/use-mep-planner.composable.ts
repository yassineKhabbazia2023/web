import { ref, computed, watch } from 'vue'
import { logger } from '@pulse/toolbox'
import { useAzureDevOpsStore } from '@backoffice/stores/azure-devops.store'
import type { AzureDevOpsBuildDefinition } from '@backoffice/types/azure-devops.type'
import type {
  MepPlannerLoadingProgress,
  MepPlannerTicketsResult,
  MepReadinessResult,
} from './mep-planner.type'
import { MepPlannerManager } from './mep-planner.manager'

export function useMepPlanner() {
  const store = useAzureDevOpsStore()

  // State
  const workItemIdsInput = ref<string>('')
  const deliveryPipelines = ref<AzureDevOpsBuildDefinition[]>([])
  const isLoading = ref<boolean>(false)
  const loadingProgress = ref<MepPlannerLoadingProgress>({
    current: 0,
    total: 0,
    step: '',
  })
  const error = ref<string | null>(null)
  const ticketsResult = ref<MepPlannerTicketsResult | null>(null)
  const mepReadiness = ref<MepReadinessResult | null>(null)
  const isCheckingReadiness = ref<boolean>(false)

  // Computed
  const parsedWorkItemIds = computed<number[]>(() => {
    const raw = workItemIdsInput.value.trim()
    if (raw === '') {
      return []
    }

    const ids = raw
      .split(/[,;\s]+/)
      .map((s) => Number.parseInt(s.trim(), 10))
      .filter((id) => Number.isNaN(id) === false)

    return [...new Set(ids)].sort((a, b) => a - b)
  })

  const canSearchTickets = computed(() => {
    return parsedWorkItemIds.value.length > 0 && store.hasPat === true
  })

  // Methods

  const fetchDeliveryPipelines = async (): Promise<void> => {
    if (store.hasPat === false) {
      return
    }

    try {
      deliveryPipelines.value = await MepPlannerManager.fetchDeliveryPipelines(store.pat)
    } catch (err) {
      logger.error('Failed to fetch delivery pipelines:', err)
      deliveryPipelines.value = []
    }
  }

  const searchTicketsToRepos = async (): Promise<void> => {
    if (canSearchTickets.value === false) {
      return
    }

    isLoading.value = true
    error.value = null
    ticketsResult.value = null
    mepReadiness.value = null

    try {
      ticketsResult.value = await MepPlannerManager.searchTicketsToRepos(
        store.pat,
        parsedWorkItemIds.value,
        (progress) => {
          loadingProgress.value = progress
        },
      )
    } catch (err) {
      logger.error('Failed to search tickets to repos:', err)
      error.value = 'Impossible d\'analyser les work items. Vérifiez votre PAT et les IDs.'
    } finally {
      isLoading.value = false
    }
  }

  const checkMepReadiness = async (): Promise<void> => {
    const result = ticketsResult.value
    if (result === null || store.hasPat === false) {
      return
    }

    isCheckingReadiness.value = true
    mepReadiness.value = null

    try {
      if (deliveryPipelines.value.length === 0) {
        await fetchDeliveryPipelines()
      }

      mepReadiness.value = await MepPlannerManager.checkReadiness(
        store.pat,
        result,
        deliveryPipelines.value,
      )
    } catch (err) {
      logger.error('Failed to check MEP readiness:', err)
    } finally {
      isCheckingReadiness.value = false
    }
  }

  // Auto-fetch delivery pipelines when PAT is available
  watch(
    () => store.hasPat,
    (hasPat) => {
      if (hasPat === true) {
        fetchDeliveryPipelines()
      } else {
        deliveryPipelines.value = []
      }
    },
    { immediate: true },
  )

  return {
    workItemIdsInput,
    isLoading,
    loadingProgress,
    error,
    ticketsResult,
    canSearchTickets,
    searchTicketsToRepos,
    mepReadiness,
    isCheckingReadiness,
    checkMepReadiness,
  }
}
