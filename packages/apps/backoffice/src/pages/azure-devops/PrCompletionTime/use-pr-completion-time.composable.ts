import { ref, computed } from 'vue'
import { logger } from '@pulse/toolbox'
import { AzureDevOpsService } from '@backoffice/services/azure-devops/azure-devops.service'
import { useAzureDevOpsStore } from '@backoffice/stores/azure-devops.store'
import type { PrCompletionItem } from '@backoffice/types/azure-devops.type'
import {
  buildPrCompletionItems,
  computeOverallAverageHours,
  computeStatsByRepository,
  computeFrontBackStats,
  formatDuration,
} from './pr-completion-time.helper'
import type { RepoCompletionStats, FrontBackStats } from './pr-completion-time.types'

const computeDefaultDateRange = (): [Date, Date] => {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1)
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
  return [start, end]
}

export const usePrCompletionTime = () => {
  const store = useAzureDevOpsStore()

  const allPrItems = ref<PrCompletionItem[]>([])
  const isLoading = ref(false)
  const loadingProgress = ref<{ loaded: number; total: number }>({ loaded: 0, total: 0 })
  const error = ref<string | null>(null)
  const dateRange = ref<[Date, Date]>(computeDefaultDateRange())
  const includeActivePrs = ref(false)
  const myPrsOnly = ref(true)

  const displayedPrItems = computed(() => {
    if (myPrsOnly.value === false || store.currentUserProfile === null) {
      return allPrItems.value
    }
    const email = store.currentUserProfile.emailAddress.toLowerCase()
    return allPrItems.value.filter((item) => item.authorEmail.toLowerCase() === email)
  })

  const overallAverageHours = computed(() => computeOverallAverageHours(displayedPrItems.value))
  const overallAverageFormatted = computed(() => formatDuration(overallAverageHours.value))
  const totalPrCount = computed(() => displayedPrItems.value.length)
  const statsByRepository = computed<RepoCompletionStats[]>(() => computeStatsByRepository(displayedPrItems.value))
  const frontBackStats = computed<FrontBackStats>(() => computeFrontBackStats(displayedPrItems.value))
  const canFilterMyPrs = computed(() => store.currentUserProfile !== null)

  const loadCurrentUserProfile = async (): Promise<void> => {
    if (store.currentUserProfile !== null) {
      return
    }

    try {
      const profile = await AzureDevOpsService.getCurrentUserProfile(store.pat)
      store.setCurrentUserProfile(profile)
    } catch (err) {
      logger.warn('Failed to load user profile for PR filter:', err)
    }
  }

  const load = async (): Promise<void> => {
    if (store.hasPat === false) {
      error.value = 'PAT non configuré'
      return
    }

    if (store.hasRepositories === false) {
      error.value = 'Aucun repository disponible'
      return
    }

    isLoading.value = true
    error.value = null
    allPrItems.value = []
    loadingProgress.value = { loaded: 0, total: store.repositories.length }

    try {
      await loadCurrentUserProfile()

      const [fromDate, toDate] = dateRange.value

      const pullRequests = await AzureDevOpsService.getPullRequestsAcrossRepos(
        store.pat,
        store.repositories,
        fromDate,
        toDate,
        includeActivePrs.value,
        (loaded, total) => {
          loadingProgress.value = { loaded, total }
        },
      )

      allPrItems.value = buildPrCompletionItems(pullRequests)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue'
      error.value = `Erreur lors du chargement des PRs: ${errorMessage}`
      logger.error('Failed to load PR completion data:', err)
    } finally {
      isLoading.value = false
    }
  }

  const reset = (): void => {
    allPrItems.value = []
    isLoading.value = false
    loadingProgress.value = { loaded: 0, total: 0 }
    error.value = null
    includeActivePrs.value = false
    myPrsOnly.value = true
    dateRange.value = computeDefaultDateRange()
  }

  return {
    allPrItems,
    displayedPrItems,
    isLoading,
    loadingProgress,
    error,
    dateRange,
    includeActivePrs,
    myPrsOnly,
    canFilterMyPrs,
    overallAverageHours,
    overallAverageFormatted,
    totalPrCount,
    statsByRepository,
    frontBackStats,
    load,
    reset,
  }
}
