import { ref } from 'vue'
import { logger } from '@pulse/toolbox'
import { AzureDevOpsService } from '@backoffice/services/azure-devops/azure-devops.service'
import { useAzureDevOpsStore } from '@backoffice/stores/azure-devops.store'
import { EXPLORER_PAGE_SIZE } from '@backoffice/constants/azure-devops.const'
import type {
  AzureDevOpsCommit,
  AzureDevOpsRef,
  CommitWithDetails,
  CommitWorkItemInfo,
  WorkItem,
} from '@backoffice/types/azure-devops.type'

const SHORT_COMMIT_ID_LENGTH = 7
const PR_FETCH_CONCURRENCY = 5

const buildTagsMap = (tags: AzureDevOpsRef[]): Map<string, string[]> => {
  const map = new Map<string, string[]>()

  for (const tag of tags) {
    const commitId = tag.peeledObjectId ?? tag.objectId
    const tagName = tag.name.replace('refs/tags/', '')
    const existingTags = map.get(commitId) ?? []
    existingTags.push(tagName)
    map.set(commitId, existingTags)
  }

  return map
}

const buildWorkItemsMap = (workItems: WorkItem[]): Map<number, WorkItem> => {
  const map = new Map<number, WorkItem>()

  for (const workItem of workItems) {
    map.set(workItem.id, workItem)
  }

  return map
}

const toWorkItemInfo = (workItem: WorkItem): CommitWorkItemInfo => ({
  id: workItem.id,
  webUrl: workItem.webUrl,
  state: workItem.state,
  title: workItem.title,
  team: workItem.team,
})

const resolveWorkItemInfos = (
  commitWorkItemIds: number[],
  prWorkItemIds: number[],
  workItemsMap: Map<number, WorkItem>,
): CommitWorkItemInfo[] => {
  const uniqueIds = [...new Set([...commitWorkItemIds, ...prWorkItemIds])]
  return uniqueIds
    .filter((id) => workItemsMap.has(id))
    .map((id) => toWorkItemInfo(workItemsMap.get(id)!))
}

const enrichCommits = (
  commits: AzureDevOpsCommit[],
  tagsMap: Map<string, string[]>,
  workItemsMap: Map<number, WorkItem>,
  prWorkItemIdsByCommit: Map<string, number[]>,
): CommitWithDetails[] => {
  return commits.map((commit) => ({
    commitId: commit.commitId,
    shortCommitId: commit.commitId.substring(0, SHORT_COMMIT_ID_LENGTH),
    comment: commit.comment,
    author: {
      name: commit.author.name,
      date: commit.author.date,
    },
    workItems: resolveWorkItemInfos(
      AzureDevOpsService.extractWorkItemIdsFromRefs(commit.workItems ?? []),
      prWorkItemIdsByCommit.get(commit.commitId) ?? [],
      workItemsMap,
    ),
    tags: tagsMap.get(commit.commitId) ?? [],
  }))
}

export const useCommitExplorer = () => {
  const store = useAzureDevOpsStore()

  const commits = ref<CommitWithDetails[]>([])
  const isLoading = ref(false)
  const isLoadingMore = ref(false)
  const error = ref<string | null>(null)
  const warnings = ref<string[]>([])
  const tagsCache = ref<Map<string, string[]> | null>(null)
  const hasMore = ref(true)

  const loadTags = async (): Promise<Map<string, string[]>> => {
    if (tagsCache.value !== null) {
      return tagsCache.value
    }

    const tags = await AzureDevOpsService.getAllTags(store.pat, store.selectedRepository)
    tagsCache.value = buildTagsMap(tags)
    return tagsCache.value
  }

  interface FetchResult {
    commits: CommitWithDetails[]
    fetchedCount: number
    failedPrCount: number
  }

  const fetchPrWorkItems = async (
    commits: AzureDevOpsCommit[],
  ): Promise<{ prWorkItemIdsByCommit: Map<string, number[]>; failedPrCount: number }> => {
    const prWorkItemIdsByCommit = new Map<string, number[]>()
    let failedPrCount = 0

    const mergeCommits: Array<{ commitId: string; prId: number }> = []
    for (const commit of commits) {
      const prId = AzureDevOpsService.extractPrId(commit.comment)
      if (prId !== null) {
        mergeCommits.push({ commitId: commit.commitId, prId })
      }
    }

    for (let i = 0; i < mergeCommits.length; i += PR_FETCH_CONCURRENCY) {
      const batch = mergeCommits.slice(i, i + PR_FETCH_CONCURRENCY)
      await Promise.all(
        batch.map(({ commitId, prId }) =>
          AzureDevOpsService.getPullRequestWorkItemIds(store.pat, store.selectedRepository, prId)
            .then((ids) => {
              prWorkItemIdsByCommit.set(commitId, ids)
            })
            .catch((err) => {
              failedPrCount++
              logger.warn(`Failed to fetch work items for PR ${prId}:`, err)
            }),
        ),
      )
    }

    return { prWorkItemIdsByCommit, failedPrCount }
  }

  const fetchAndEnrichCommits = async (skip: number): Promise<FetchResult> => {
    const [pageResult, tagsMap] = await Promise.all([
      AzureDevOpsService.fetchCommitsForExplorer(store.pat, store.selectedRepository, skip, EXPLORER_PAGE_SIZE),
      loadTags(),
    ])

    const { prWorkItemIdsByCommit, failedPrCount } = await fetchPrWorkItems(pageResult.commits)

    const commitWorkItemIds = AzureDevOpsService.extractWorkItemIds(pageResult.commits)
    const allWorkItemIds = new Set(commitWorkItemIds)
    for (const ids of prWorkItemIdsByCommit.values()) {
      for (const id of ids) {
        allWorkItemIds.add(id)
      }
    }

    const workItems = await AzureDevOpsService.getWorkItemsByIds(store.pat, Array.from(allWorkItemIds))
    const workItemsMap = buildWorkItemsMap(workItems)

    return {
      commits: enrichCommits(pageResult.commits, tagsMap, workItemsMap, prWorkItemIdsByCommit),
      fetchedCount: pageResult.commits.length,
      failedPrCount,
    }
  }

  const load = async (): Promise<void> => {
    if (store.hasPat === false) {
      error.value = 'PAT non configuré'
      return
    }

    isLoading.value = true
    error.value = null
    warnings.value = []
    hasMore.value = true

    try {
      const result = await fetchAndEnrichCommits(0)
      commits.value = result.commits
      hasMore.value = result.fetchedCount >= EXPLORER_PAGE_SIZE
      if (result.failedPrCount > 0) {
        warnings.value.push(`${result.failedPrCount} pull request(s) n'ont pas pu être analysées pour les work items`)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue'
      error.value = `Erreur lors du chargement des commits: ${errorMessage}`
      logger.error('Failed to load commits for explorer:', err)
    } finally {
      isLoading.value = false
    }
  }

  const loadMore = async (): Promise<void> => {
    if (store.hasPat === false || isLoadingMore.value || hasMore.value === false) {
      return
    }

    isLoadingMore.value = true

    try {
      const result = await fetchAndEnrichCommits(commits.value.length)
      commits.value = [...commits.value, ...result.commits]
      hasMore.value = result.fetchedCount >= EXPLORER_PAGE_SIZE
      if (result.failedPrCount > 0) {
        warnings.value.push(`${result.failedPrCount} pull request(s) n'ont pas pu être analysées pour les work items`)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue'
      error.value = `Erreur lors du chargement des commits: ${errorMessage}`
      logger.error('Failed to load more commits:', err)
    } finally {
      isLoadingMore.value = false
    }
  }

  const reset = (): void => {
    commits.value = []
    isLoading.value = false
    isLoadingMore.value = false
    error.value = null
    warnings.value = []
    tagsCache.value = null
    hasMore.value = true
  }

  return {
    commits,
    isLoading,
    isLoadingMore,
    error,
    warnings,
    hasMore,
    load,
    loadMore,
    reset,
  }
}
