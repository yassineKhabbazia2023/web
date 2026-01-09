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

const enrichCommits = (
  commits: AzureDevOpsCommit[],
  tagsMap: Map<string, string[]>,
  workItemsMap: Map<number, WorkItem>,
): CommitWithDetails[] => {
  return commits.map((commit) => {
    const workItemInfos: CommitWorkItemInfo[] = []

    if (commit.workItems !== undefined) {
      for (const wiRef of commit.workItems) {
        const id = Number.parseInt(wiRef.url.split('/').pop() ?? '', 10)
        if (Number.isNaN(id) === false) {
          const workItem = workItemsMap.get(id)
          if (workItem !== undefined) {
            workItemInfos.push({
              id: workItem.id,
              webUrl: workItem.webUrl,
              state: workItem.state,
              title: workItem.title,
              team: workItem.team,
            })
          }
        }
      }
    }

    return {
      commitId: commit.commitId,
      shortCommitId: commit.commitId.substring(0, SHORT_COMMIT_ID_LENGTH),
      comment: commit.comment,
      author: {
        name: commit.author.name,
        date: commit.author.date,
      },
      workItems: workItemInfos,
      tags: tagsMap.get(commit.commitId) ?? [],
    }
  })
}

export const useCommitExplorer = () => {
  const store = useAzureDevOpsStore()

  const commits = ref<CommitWithDetails[]>([])
  const isLoading = ref(false)
  const isLoadingMore = ref(false)
  const error = ref<string | null>(null)
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
  }

  const fetchAndEnrichCommits = async (skip: number): Promise<FetchResult> => {
    const [pageResult, tagsMap] = await Promise.all([
      AzureDevOpsService.fetchCommitsForExplorer(store.pat, store.selectedRepository, skip, EXPLORER_PAGE_SIZE),
      loadTags(),
    ])

    const workItemIds = AzureDevOpsService.extractWorkItemIds(pageResult.commits)
    const workItems = await AzureDevOpsService.getWorkItemsByIds(store.pat, workItemIds)
    const workItemsMap = buildWorkItemsMap(workItems)

    return {
      commits: enrichCommits(pageResult.commits, tagsMap, workItemsMap),
      fetchedCount: pageResult.commits.length,
    }
  }

  const load = async (): Promise<void> => {
    if (store.hasPat === false) {
      error.value = 'PAT non configuré'
      return
    }

    isLoading.value = true
    error.value = null
    hasMore.value = true

    try {
      const result = await fetchAndEnrichCommits(0)
      commits.value = result.commits
      hasMore.value = result.fetchedCount >= EXPLORER_PAGE_SIZE
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
    tagsCache.value = null
    hasMore.value = true
  }

  return {
    commits,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    load,
    loadMore,
    reset,
  }
}
