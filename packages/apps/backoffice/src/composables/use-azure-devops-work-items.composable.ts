import { ref, computed, watch } from 'vue'
import { logger } from '@pulse/toolbox'
import { AzureDevOpsService } from '@backoffice/services/azure-devops/azure-devops.service'
import { useAzureDevOpsStore } from '@backoffice/stores/azure-devops.store'
import { validateCommitId, isValidCommitId } from '@backoffice/utils/git.util'
import type { WorkItemsByTeam, MepTag, HeadInfo } from '@backoffice/types/azure-devops.type'

export function useAzureDevOpsWorkItems() {
  const azureDevOpsStore = useAzureDevOpsStore()

  // State
  const fromCommitId = ref<string>('')
  const toCommitId = ref<string>('')
  const workItemsByTeam = ref<WorkItemsByTeam>({})
  const failedWorkItemIds = ref<number[]>([])
  const warnings = ref<string[]>([])
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const latestMepTag = ref<MepTag | null>(null)
  const isLoadingMepTag = ref<boolean>(false)
  const headInfo = ref<HeadInfo | null>(null)
  const isLoadingHead = ref<boolean>(false)

  // Computed
  const hasResults = computed(() => Object.keys(workItemsByTeam.value).length > 0)

  const totalWorkItems = computed(() => {
    return Object.values(workItemsByTeam.value).reduce((sum, items) => sum + items.length, 0)
  })

  const sortedTeamNames = computed(() => {
    return Object.keys(workItemsByTeam.value).sort((a, b) => {
      const countA = workItemsByTeam.value[a].length
      const countB = workItemsByTeam.value[b].length
      return countB - countA // Descending order (most work items first)
    })
  })

  const canSearch = computed(() => {
    const fromTrimmed = fromCommitId.value.trim()
    const toTrimmed = toCommitId.value.trim()
    return fromTrimmed.length > 0
      && toTrimmed.length > 0
      && azureDevOpsStore.hasPat
      && isValidCommitId(fromTrimmed)
      && isValidCommitId(toTrimmed)
  })

  const hasPartialErrors = computed(() => failedWorkItemIds.value.length > 0)

  const hasWarnings = computed(() => warnings.value.length > 0)

  // Validation
  const fromCommitIdError = computed(() => validateCommitId(fromCommitId.value, 'Commit de départ'))
  const toCommitIdError = computed(() => validateCommitId(toCommitId.value, 'Commit de fin'))
  const hasValidationErrors = computed(() =>
    fromCommitIdError.value !== null || toCommitIdError.value !== null,
  )

  /**
   * Fetch work items for the specified commit range
   */
  const fetchWorkItems = async (): Promise<void> => {
    if (canSearch.value === false) {
      return
    }

    isLoading.value = true
    error.value = null
    workItemsByTeam.value = {}
    failedWorkItemIds.value = []
    warnings.value = []

    try {
      const result = await AzureDevOpsService.getWorkItemsForCommitRange(
        azureDevOpsStore.pat,
        fromCommitId.value.trim(),
        toCommitId.value.trim(),
      )

      workItemsByTeam.value = result.workItemsByTeam
      failedWorkItemIds.value = result.failedIds
      warnings.value = result.warnings

      if (Object.keys(result.workItemsByTeam).length === 0 && result.failedIds.length === 0) {
        logger.info('No work items found for the specified commit range')
      }
    } catch (err) {
      logger.error('Failed to fetch work items:', err)
      error.value = 'Impossible de récupérer les work items. Vérifiez votre PAT et les IDs de commits.'
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetch the latest MEP tag from Azure DevOps
   */
  const fetchLatestMepTag = async (): Promise<void> => {
    if (azureDevOpsStore.hasPat === false) {
      return
    }

    isLoadingMepTag.value = true

    try {
      latestMepTag.value = await AzureDevOpsService.getLatestMepTag(azureDevOpsStore.pat)
    } catch (err) {
      logger.error('Failed to fetch latest MEP tag:', err)
      latestMepTag.value = null
    } finally {
      isLoadingMepTag.value = false
    }
  }

  /**
   * Apply the latest MEP tag commit ID to the fromCommitId field
   */
  const applyMepTagToFromCommit = (): void => {
    if (latestMepTag.value !== null) {
      fromCommitId.value = latestMepTag.value.commitId
    }
  }

  /**
   * Fetch the HEAD info from main branch
   */
  const fetchHeadInfo = async (): Promise<void> => {
    if (azureDevOpsStore.hasPat === false) {
      return
    }

    isLoadingHead.value = true

    try {
      headInfo.value = await AzureDevOpsService.getHeadInfo(azureDevOpsStore.pat)
    } catch (err) {
      logger.error('Failed to fetch HEAD info:', err)
      headInfo.value = null
    } finally {
      isLoadingHead.value = false
    }
  }

  /**
   * Apply the HEAD commit ID to the toCommitId field
   */
  const applyHeadToToCommit = (): void => {
    if (headInfo.value !== null) {
      toCommitId.value = headInfo.value.commitId
    }
  }

  // Auto-fetch latest MEP tag and HEAD info when PAT is available
  watch(
    () => azureDevOpsStore.hasPat,
    (hasPat) => {
      if (hasPat) {
        fetchLatestMepTag()
        fetchHeadInfo()
      } else {
        latestMepTag.value = null
        headInfo.value = null
      }
    },
    { immediate: true },
  )

  return {
    fromCommitId,
    toCommitId,
    workItemsByTeam,
    failedWorkItemIds,
    warnings,
    isLoading,
    error,
    hasResults,
    totalWorkItems,
    sortedTeamNames,
    canSearch,
    hasPartialErrors,
    hasWarnings,
    fromCommitIdError,
    toCommitIdError,
    hasValidationErrors,
    latestMepTag,
    isLoadingMepTag,
    headInfo,
    isLoadingHead,
    fetchWorkItems,
    applyMepTagToFromCommit,
    applyHeadToToCommit,
  }
}
