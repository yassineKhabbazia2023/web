import { ref, computed, watch } from 'vue'
import { logger } from '@pulse/toolbox'
import { AzureDevOpsService } from '@backoffice/services/azure-devops/azure-devops.service'
import { useAzureDevOpsStore } from '@backoffice/stores/azure-devops.store'
import { validateCommitId, isValidCommitId } from '@backoffice/utils/git.util'
import type {
  WorkItemsByTeam,
  WorkItemsByRepository,
  MepTag,
  HeadInfo,
  MultiRepoWorkItemsResult,
} from '@backoffice/types/azure-devops.type'

export function useAzureDevOpsWorkItems() {
  const azureDevOpsStore = useAzureDevOpsStore()

  // State
  const fromCommitId = ref<string>('')
  const toCommitId = ref<string>('')
  const workItemsByTeam = ref<WorkItemsByTeam>({})
  const workItemsByRepository = ref<WorkItemsByRepository>({})
  const failedWorkItemIds = ref<number[]>([])
  const warnings = ref<string[]>([])
  const reposWithoutMepTag = ref<string[]>([])
  const reposWithFetchError = ref<string[]>([])
  const reposWithNoWorkItems = ref<string[]>([])
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const latestMepTag = ref<MepTag | null>(null)
  const isLoadingMepTag = ref<boolean>(false)
  const headInfo = ref<HeadInfo | null>(null)
  const isLoadingHead = ref<boolean>(false)
  const backofficeOnly = ref<boolean>(false)
  // Narrows the search to a single repository among the globally selected ones,
  // without changing the global selection itself.
  const repositoryFilter = ref<string>('')

  // Repository selection computed
  const selectedRepository = computed(() => azureDevOpsStore.selectedRepository)
  const selectedRepositories = computed(() => azureDevOpsStore.selectedRepositories)
  const effectiveSearchRepositories = computed(() => (
    repositoryFilter.value !== '' ? [repositoryFilter.value] : azureDevOpsStore.getEffectiveRepositories
  ))
  // Active whenever the search is driven by the repository filter (always shows the repository
  // as a tree header) or the global selection covers more than one repository.
  const isMultiRepoMode = computed(() => (
    repositoryFilter.value !== '' || azureDevOpsStore.hasMultipleRepositoriesSelected
  ))

  // Computed
  const hasResults = computed(() => {
    if (isMultiRepoMode.value) {
      return (
        Object.keys(workItemsByRepository.value).length > 0
        || reposWithoutMepTag.value.length > 0
        || reposWithFetchError.value.length > 0
        || reposWithNoWorkItems.value.length > 0
      )
    }
    return Object.keys(workItemsByTeam.value).length > 0
  })

  const totalWorkItems = computed(() => {
    if (isMultiRepoMode.value) {
      return Object.values(workItemsByRepository.value).reduce(
        (repoSum, teamItems) =>
          repoSum + Object.values(teamItems).reduce((teamSum, items) => teamSum + items.length, 0),
        0,
      )
    }
    return Object.values(workItemsByTeam.value).reduce((sum, items) => sum + items.length, 0)
  })

  const sortedTeamNames = computed(() => {
    return Object.keys(workItemsByTeam.value).sort((a, b) => {
      const countA = workItemsByTeam.value[a].length
      const countB = workItemsByTeam.value[b].length
      return countB - countA
    })
  })

  const sortedRepositoryNames = computed(() => {
    return Object.keys(workItemsByRepository.value).sort((a, b) => {
      const countA = Object.values(workItemsByRepository.value[a]).reduce(
        (sum, items) => sum + items.length,
        0,
      )
      const countB = Object.values(workItemsByRepository.value[b]).reduce(
        (sum, items) => sum + items.length,
        0,
      )
      return countB - countA
    })
  })

  const canSearch = computed(() => {
    if (azureDevOpsStore.hasPat === false) {
      return false
    }

    const effectiveRepos = effectiveSearchRepositories.value
    if (effectiveRepos.length === 0) {
      return false
    }

    // Several repositories targeted: each one resolves its own commit range automatically,
    // so no manual "from"/"to" commit is required here.
    if (effectiveRepos.length > 1) {
      return true
    }

    // Exactly one targeted repository (via the filter, or the only one globally selected):
    // the search uses the commit range currently in the fields (auto-populated, editable).
    const fromTrimmed = fromCommitId.value.trim()
    const toTrimmed = toCommitId.value.trim()
    return (
      fromTrimmed.length > 0
      && toTrimmed.length > 0
      && isValidCommitId(fromTrimmed)
      && isValidCommitId(toTrimmed)
    )
  })

  /**
   * Clear the previous search results, keeping the commit range/filter fields untouched.
   */
  const resetResults = (): void => {
    workItemsByTeam.value = {}
    workItemsByRepository.value = {}
    failedWorkItemIds.value = []
    warnings.value = []
    reposWithoutMepTag.value = []
    reposWithFetchError.value = []
    reposWithNoWorkItems.value = []
    error.value = null
  }

  const hasPartialErrors = computed(() => failedWorkItemIds.value.length > 0)

  const hasWarnings = computed(() => warnings.value.length > 0)

  // Validation
  const fromCommitIdError = computed(() => validateCommitId(fromCommitId.value, 'Commit de départ'))
  const toCommitIdError = computed(() => validateCommitId(toCommitId.value, 'Commit de fin'))
  const hasValidationErrors = computed(
    () => fromCommitIdError.value !== null || toCommitIdError.value !== null,
  )

  /**
   * Fetch repositories for the current PAT
   */
  const fetchRepositories = async (): Promise<void> => {
    if (azureDevOpsStore.hasPat === false) {
      return
    }

    azureDevOpsStore.setIsLoadingRepositories(true)

    try {
      const repos = await AzureDevOpsService.getRepositories(azureDevOpsStore.pat)
      azureDevOpsStore.setRepositories(repos)
    } catch (err) {
      logger.error('Failed to fetch repositories:', err)
      azureDevOpsStore.setRepositories([])
    } finally {
      azureDevOpsStore.setIsLoadingRepositories(false)
    }
  }

  /**
   * Fetch work items for the specified commit range (single repository)
   */
  const fetchWorkItems = async (): Promise<void> => {
    if (canSearch.value === false) {
      return
    }

    isLoading.value = true
    resetResults()

    try {
      const effectiveRepos = effectiveSearchRepositories.value
      if (effectiveRepos.length === 0) {
        error.value = 'Aucun repository sélectionné.'
        return
      }

      if (effectiveRepos.length > 1) {
        // Several repositories targeted: each one resolves its own REC/PROD commit range,
        // shown as repo → team → items.
        const result: MultiRepoWorkItemsResult = await AzureDevOpsService.getWorkItemsForMultipleRepos(
          azureDevOpsStore.pat,
          effectiveRepos,
          backofficeOnly.value,
        )

        workItemsByRepository.value = result.workItemsByRepository
        failedWorkItemIds.value = result.failedIds
        warnings.value = result.warnings
        reposWithoutMepTag.value = result.reposWithoutMepTag
        reposWithFetchError.value = result.reposWithFetchError
        reposWithNoWorkItems.value = result.reposWithNoWorkItems
      } else {
        // Exactly one targeted repository: use the commit range currently in the fields
        // (auto-populated when the repository was selected, editable by the user before searching).
        const result = await AzureDevOpsService.getWorkItemsForCommitRange(
          azureDevOpsStore.pat,
          effectiveRepos[0],
          fromCommitId.value.trim(),
          toCommitId.value.trim(),
          backofficeOnly.value,
        )

        if (isMultiRepoMode.value) {
          // A repository filter is active: keep showing it as a repo-tree with a single section.
          workItemsByRepository.value = Object.keys(result.workItemsByTeam).length > 0
            ? { [effectiveRepos[0]]: result.workItemsByTeam }
            : {}
        } else {
          workItemsByTeam.value = result.workItemsByTeam
        }
        failedWorkItemIds.value = result.failedIds
        warnings.value = result.warnings
      }

      if (totalWorkItems.value === 0 && failedWorkItemIds.value.length === 0) {
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
   * Fetch the MEP tag (PROD) and HEAD info (REC) displayed as "Dernière MEP" / "Tag le plus récent"
   * for one specific repository.
   */
  const fetchDisplayVersions = async (repository: string): Promise<void> => {
    isLoadingMepTag.value = true
    isLoadingHead.value = true

    try {
      latestMepTag.value = await AzureDevOpsService.getLatestMepTag(
        azureDevOpsStore.pat,
        repository,
        backofficeOnly.value,
      )
      headInfo.value = await AzureDevOpsService.getHeadInfo(
        azureDevOpsStore.pat,
        repository,
      )
    } catch (err) {
      logger.error('Failed to fetch versions for repository:', err)
    } finally {
      isLoadingMepTag.value = false
      isLoadingHead.value = false
    }
  }

  /**
   * Fetch versions (MEP and REC) for all selected repositories
   */
  const fetchVersionsForSelectedRepos = async (): Promise<void> => {
    if (azureDevOpsStore.hasPat === false) {
      return
    }

    const effectiveRepos = azureDevOpsStore.getEffectiveRepositories
    if (effectiveRepos.length === 0) {
      return
    }

    // Fetch MEP tag and HEAD info for the first selected repository (for display purposes only:
    // in multi-repository mode, fetchWorkItems resolves each repository's own commit range).
    await fetchDisplayVersions(effectiveRepos[0])

    if (effectiveRepos.length > 1) {
      await fetchWorkItems()
      return
    }

    // Single repository: auto-populate the manual commit fields and search
    if (latestMepTag.value !== null) {
      fromCommitId.value = latestMepTag.value.commitId
    }
    if (headInfo.value !== null) {
      toCommitId.value = headInfo.value.commitId
    }

    if (fromCommitId.value.trim().length > 0 && toCommitId.value.trim().length > 0) {
      await fetchWorkItems()
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
      latestMepTag.value = await AzureDevOpsService.getLatestMepTag(
        azureDevOpsStore.pat,
        selectedRepository.value,
        backofficeOnly.value,
      )
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
      headInfo.value = await AzureDevOpsService.getHeadInfo(
        azureDevOpsStore.pat,
        selectedRepository.value,
      )
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

  // Auto-fetch repositories, then versions (and auto-search) for the selected repositories when PAT is available.
  // Repositories must be fetched first so "All" resolves to the full repository list.
  watch(
    () => azureDevOpsStore.hasPat,
    async (hasPat) => {
      if (hasPat) {
        await fetchRepositories()
        await fetchVersionsForSelectedRepos()
      } else {
        latestMepTag.value = null
        headInfo.value = null
        azureDevOpsStore.resetRepositories()
      }
    },
    { immediate: true },
  )

  // Re-fetch MEP tag and HEAD info when selected repository changes
  watch(
    () => azureDevOpsStore.selectedRepository,
    () => {
      if (azureDevOpsStore.hasPat) {
        resetResults()
        fromCommitId.value = ''
        toCommitId.value = ''

        fetchLatestMepTag()
        fetchHeadInfo()
      }
    },
  )

  // Auto-fetch versions and search work items when multi-select repositories change
  watch(
    () => azureDevOpsStore.selectedRepositories,
    () => {
      // The filter may no longer point to a repository that is still selected globally.
      repositoryFilter.value = ''

      if (azureDevOpsStore.hasPat) {
        resetResults()
        fetchVersionsForSelectedRepos()
      }
    },
  )

  // Re-search when the repository filter changes, narrowing the search to that one repository.
  // "Dernière MEP" / "Tag le plus récent" (and the commit fields) must reflect that same repository
  // (or the first globally selected one once the filter is cleared), not whichever was shown before.
  watch(repositoryFilter, async (filterValue) => {
    if (azureDevOpsStore.hasPat === false) {
      return
    }

    resetResults()
    fromCommitId.value = ''
    toCommitId.value = ''

    const displayRepository = filterValue || azureDevOpsStore.getEffectiveRepositories[0]
    if (displayRepository === undefined) {
      return
    }

    await fetchDisplayVersions(displayRepository)

    // Auto-populate the commit fields with that repository's own PROD/REC versions; the user can
    // still edit them before clicking "Rechercher" to search a different, manually chosen range.
    if (latestMepTag.value !== null) {
      fromCommitId.value = latestMepTag.value.commitId
    }
    if (headInfo.value !== null) {
      toCommitId.value = headInfo.value.commitId
    }

    fetchWorkItems()
  })

  return {
    fromCommitId,
    toCommitId,
    backofficeOnly,
    repositoryFilter,
    workItemsByTeam,
    workItemsByRepository,
    failedWorkItemIds,
    warnings,
    reposWithoutMepTag,
    reposWithFetchError,
    reposWithNoWorkItems,
    isLoading,
    error,
    hasResults,
    totalWorkItems,
    sortedTeamNames,
    sortedRepositoryNames,
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
    isMultiRepoMode,
    selectedRepositories,
    resetResults,
    fetchWorkItems,
    fetchLatestMepTag,
    fetchVersionsForSelectedRepos,
    applyMepTagToFromCommit,
    applyHeadToToCommit,
  }
}
