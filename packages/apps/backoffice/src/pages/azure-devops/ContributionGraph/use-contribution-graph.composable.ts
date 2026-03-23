import { ref, computed } from 'vue'
import { logger } from '@pulse/toolbox'
import { AzureDevOpsService } from '@backoffice/services/azure-devops/azure-devops.service'
import { useAzureDevOpsStore } from '@backoffice/stores/azure-devops.store'
import {
  CONTRIBUTION_GRAPH_WEEKS,
  CONTRIBUTION_RECENT_ACTIVITY_COUNT,
} from '@backoffice/constants/azure-devops.const'
import type {
  AzureDevOpsUserProfile,
  AzureDevOpsPullRequest,
  ContributionCommit,
  ContributionWorkItem,
  ContributionActivityItem,
} from '@backoffice/types/azure-devops.type'
import {
  toDateKey, formatDate, formatCommitDate, isMergePullRequest,
} from './contribution-graph.helper'

type ActivityFilter = 'commits' | 'workitems' | 'prreviews'

export const useContributionGraph = () => {
  const store = useAzureDevOpsStore()

  const allActivityItems = ref<ContributionActivityItem[]>([])
  const visibleActivityCount = ref(CONTRIBUTION_RECENT_ACTIVITY_COUNT)
  const isLoading = ref(false)
  const loadingProgress = ref<{ loaded: number; total: number }>({ loaded: 0, total: 0 })
  const error = ref<string | null>(null)
  const activeFilters = ref<ActivityFilter[]>(['commits', 'workitems'])

  const startDate = ref<Date>(new Date())
  const endDate = ref<Date>(new Date())

  const currentUserDisplayName = ref<string | null>(null)
  const selectedDate = ref<string | null>(null)

  const commitsCount = computed(() => allActivityItems.value.filter((item) => item.kind === 'commit').length)
  const workItemsCount = computed(() => allActivityItems.value.filter((item) => item.kind === 'workitem').length)
  const prReviewsCount = computed(() => allActivityItems.value.filter((item) => item.kind === 'prreview').length)

  const filteredActivityItems = computed(() => {
    return allActivityItems.value.filter((item) => {
      if (item.kind === 'commit') {
        return activeFilters.value.includes('commits')
      }
      if (item.kind === 'prreview') {
        return activeFilters.value.includes('prreviews')
      }
      return activeFilters.value.includes('workitems')
    })
  })

  const contributionsByDate = computed(() => {
    const map = new Map<string, number>()
    for (const item of filteredActivityItems.value) {
      const dateKey = toDateKey(new Date(item.date))
      const current = map.get(dateKey) ?? 0
      map.set(dateKey, current + 1)
    }
    return map
  })

  const hasContributions = computed(() => contributionsByDate.value.size > 0)

  const dateFilteredActivityItems = computed(() => {
    if (selectedDate.value === null) {
      return filteredActivityItems.value
    }
    return filteredActivityItems.value.filter(
      (item) => toDateKey(new Date(item.date)) === selectedDate.value,
    )
  })

  const recentActivity = computed(() => dateFilteredActivityItems.value.slice(0, visibleActivityCount.value))
  const recentActivityTotal = computed(() => dateFilteredActivityItems.value.length)
  const hasMoreActivity = computed(() => visibleActivityCount.value < dateFilteredActivityItems.value.length)

  const formattedSelectedDate = computed(() => {
    if (selectedDate.value === null) {
      return ''
    }
    const [year, month, day] = selectedDate.value.split('-').map(Number)
    return formatDate(new Date(year, month - 1, day))
  })

  const computeDateRange = () => {
    const now = new Date()

    const start = new Date(now)
    start.setDate(start.getDate() - CONTRIBUTION_GRAPH_WEEKS * 7)
    start.setHours(0, 0, 0, 0)
    // Align to Monday
    const day = start.getDay()
    const diffToMonday = day === 0 ? -6 : 1 - day
    start.setDate(start.getDate() + diffToMonday)

    const end = new Date(now)
    end.setHours(23, 59, 59, 999)

    startDate.value = start
    endDate.value = end
  }

  const buildActivityItems = (
    commits: ContributionCommit[],
    workItems: ContributionWorkItem[],
    prReviews: AzureDevOpsPullRequest[],
    prVoteDates: Map<number, string>,
  ): ContributionActivityItem[] => {
    const commitItems: ContributionActivityItem[] = commits.map((commit) => ({
      kind: 'commit' as const,
      date: commit.author.date,
      formattedDate: formatCommitDate(commit.author.date),
      commitId: commit.commitId,
      shortCommitId: commit.commitId.substring(0, 7),
      comment: commit.comment,
      firstLine: commit.comment.split('\n')[0],
      repositoryName: commit.repositoryName,
    }))

    const workItemItems: ContributionActivityItem[] = workItems.map((wi) => ({
      kind: 'workitem' as const,
      date: wi.createdDate,
      formattedDate: formatCommitDate(wi.createdDate),
      workItemId: wi.id,
      title: wi.title,
      workItemType: wi.type,
      state: wi.state,
      reason: wi.reason,
      webUrl: wi.webUrl,
    }))

    const prReviewItems: ContributionActivityItem[] = prReviews.map((pr) => {
      const voteDate = prVoteDates.get(pr.pullRequestId)
      const reviewDate = voteDate ?? pr.closedDate ?? pr.creationDate

      return {
        kind: 'prreview' as const,
        date: reviewDate,
        formattedDate: formatCommitDate(reviewDate),
        pullRequestId: pr.pullRequestId,
        title: pr.title,
        repositoryName: pr.repository.name,
        author: pr.createdBy.displayName,
        webUrl: AzureDevOpsService.buildPrWebUrl(pr.repository.name, pr.pullRequestId),
      }
    })

    const allItems = [...commitItems, ...workItemItems, ...prReviewItems]
    allItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    return allItems
  }

  const loadCurrentUserProfile = async (): Promise<AzureDevOpsUserProfile> => {
    if (store.currentUserProfile !== null) {
      return store.currentUserProfile
    }

    const profile = await AzureDevOpsService.getCurrentUserProfile(store.pat)
    store.setCurrentUserProfile(profile)
    return profile
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
    allActivityItems.value = []
    visibleActivityCount.value = CONTRIBUTION_RECENT_ACTIVITY_COUNT
    loadingProgress.value = { loaded: 0, total: store.repositories.length }
    computeDateRange()

    try {
      const profile = await loadCurrentUserProfile()
      currentUserDisplayName.value = profile.displayName

      const [allCommits, createdWorkItems, prReviews] = await Promise.all([
        AzureDevOpsService.getCommitsByAuthorAcrossRepos(
          store.pat,
          store.repositories,
          profile.emailAddress,
          startDate.value,
          endDate.value,
          (loaded, total) => {
            loadingProgress.value = { loaded, total }
          },
        ),
        AzureDevOpsService.getWorkItemsForUser(
          store.pat,
          profile.emailAddress,
          startDate.value,
          endDate.value,
        ),
        AzureDevOpsService.getPrReviewsForUserAcrossRepos(
          store.pat,
          store.repositories,
          profile.id,
          startDate.value,
          endDate.value,
        ),
      ])

      // Exclude PR merge evaluation commits generated by Azure DevOps under refs/pull/*/merge
      const filteredCommits = allCommits.filter(
        (commit) => isMergePullRequest(commit.comment) === false,
      )

      // Fetch actual vote dates for each PR review
      const prVoteDates = prReviews.length > 0
        ? await AzureDevOpsService.enrichPrReviewsWithVoteDates(
          store.pat, prReviews, profile.id,
        )
        : new Map<number, string>()

      allActivityItems.value = buildActivityItems(
        filteredCommits, createdWorkItems, prReviews, prVoteDates,
      )
      visibleActivityCount.value = CONTRIBUTION_RECENT_ACTIVITY_COUNT
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue'
      error.value = `Erreur lors du chargement des contributions: ${errorMessage}`
      logger.error('Failed to load contributions:', err)
    } finally {
      isLoading.value = false
    }
  }

  const toggleFilter = (filter: ActivityFilter, value: boolean): void => {
    if (value) {
      if (activeFilters.value.includes(filter) === false) {
        activeFilters.value = [...activeFilters.value, filter]
      }
    } else {
      // Prevent unchecking both
      if (activeFilters.value.length > 1) {
        activeFilters.value = activeFilters.value.filter((f) => f !== filter)
      }
    }
  }

  const showCommits = computed({
    get: () => activeFilters.value.includes('commits'),
    set: (value: boolean) => toggleFilter('commits', value),
  })

  const showWorkItems = computed({
    get: () => activeFilters.value.includes('workitems'),
    set: (value: boolean) => toggleFilter('workitems', value),
  })

  const showPrReviews = computed({
    get: () => activeFilters.value.includes('prreviews'),
    set: (value: boolean) => toggleFilter('prreviews', value),
  })

  const selectDate = (dateKey: string): void => {
    if (selectedDate.value === dateKey) {
      selectedDate.value = null
    } else {
      selectedDate.value = dateKey
    }
    visibleActivityCount.value = CONTRIBUTION_RECENT_ACTIVITY_COUNT
  }

  const clearSelectedDate = (): void => {
    selectedDate.value = null
    visibleActivityCount.value = CONTRIBUTION_RECENT_ACTIVITY_COUNT
  }

  const loadMoreActivity = (): void => {
    visibleActivityCount.value += CONTRIBUTION_RECENT_ACTIVITY_COUNT
  }

  const reset = (): void => {
    allActivityItems.value = []
    visibleActivityCount.value = CONTRIBUTION_RECENT_ACTIVITY_COUNT
    activeFilters.value = ['commits', 'workitems']
    isLoading.value = false
    loadingProgress.value = { loaded: 0, total: 0 }
    error.value = null
  }

  return {
    contributionsByDate,
    recentActivity,
    hasMoreActivity,
    isLoading,
    loadingProgress,
    error,
    startDate,
    endDate,
    hasContributions,
    currentUserDisplayName,
    showCommits,
    showWorkItems,
    showPrReviews,
    commitsCount,
    workItemsCount,
    prReviewsCount,
    selectedDate,
    formattedSelectedDate,
    recentActivityTotal,
    load,
    loadMoreActivity,
    selectDate,
    clearSelectedDate,
    reset,
  }
}
