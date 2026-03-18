import type { AzureDevOpsPullRequest, PrCompletionItem } from '@backoffice/types/azure-devops.type'
import type { FrontBackStats, RepoCompletionStats } from './pr-completion-time.types'
import { AZURE_DEVOPS_CONFIG, FRONT_REPO_NAME } from '@backoffice/constants/azure-devops.const'

export const computeDurationHours = (creationDate: string, closedDate: string): number => {
  const start = new Date(creationDate).getTime()
  const end = new Date(closedDate).getTime()
  return Math.round(((end - start) / (1000 * 60 * 60)) * 10) / 10
}

export const formatDuration = (hours: number): string => {
  if (hours < 1) {
    const minutes = Math.round(hours * 60)
    return `${minutes}m`
  }

  if (hours < 24) {
    const h = Math.floor(hours)
    const m = Math.round((hours - h) * 60)
    return m > 0 ? `${h}h ${m}m` : `${h}h`
  }

  const days = Math.floor(hours / 24)
  const remainingHours = Math.round(hours - days * 24)
  return remainingHours > 0 ? `${days}j ${remainingHours}h` : `${days}j`
}

export const cleanBranchName = (refName: string): string => {
  return refName.replace('refs/heads/', '')
}

export const buildPrCompletionItems = (pullRequests: AzureDevOpsPullRequest[]): PrCompletionItem[] => {
  return pullRequests.map((pr) => {
    const endDate = pr.closedDate ?? new Date().toISOString()
    const durationHours = computeDurationHours(pr.creationDate, endDate)
    return {
      pullRequestId: pr.pullRequestId,
      title: pr.title,
      repositoryName: pr.repository.name,
      author: pr.createdBy.displayName,
      authorEmail: pr.createdBy.uniqueName,
      creationDate: pr.creationDate,
      closedDate: pr.closedDate,
      durationHours,
      durationFormatted: formatDuration(durationHours),
      sourceRefName: pr.sourceRefName,
      targetRefName: pr.targetRefName,
      status: pr.status === 'completed' ? 'completed' : 'active',
    }
  })
}

export const computeOverallAverageHours = (items: PrCompletionItem[]): number => {
  if (items.length === 0) {
    return 0
  }

  const total = items.reduce((sum, item) => sum + item.durationHours, 0)
  return Math.round((total / items.length) * 10) / 10
}

export const computeStatsByRepository = (items: PrCompletionItem[]): RepoCompletionStats[] => {
  const grouped = new Map<string, PrCompletionItem[]>()

  for (const item of items) {
    const existing = grouped.get(item.repositoryName) ?? []
    existing.push(item)
    grouped.set(item.repositoryName, existing)
  }

  const stats: RepoCompletionStats[] = []
  for (const [repositoryName, repoItems] of grouped) {
    const averageHours = computeOverallAverageHours(repoItems)
    stats.push({
      repositoryName,
      prCount: repoItems.length,
      averageHours,
      averageFormatted: formatDuration(averageHours),
    })
  }

  stats.sort((a, b) => b.prCount - a.prCount)
  return stats
}

export const getDurationColor = (hours: number): string => {
  if (hours < 24) {
    return 'success'
  }
  if (hours < 72) {
    return 'warning'
  }
  return 'danger'
}

export const buildPrUrl = (repositoryName: string, pullRequestId: number): string => {
  const { organization, project } = AZURE_DEVOPS_CONFIG
  return `${organization}/${project}/_git/${repositoryName}/pullrequest/${pullRequestId}`
}

export const computeFrontBackStats = (items: PrCompletionItem[]): FrontBackStats => {
  const frontItems = items.filter((item) => item.repositoryName === FRONT_REPO_NAME)
  const backItems = items.filter((item) => item.repositoryName !== FRONT_REPO_NAME)

  const frontAvg = computeOverallAverageHours(frontItems)
  const backAvg = computeOverallAverageHours(backItems)

  return {
    front: {
      repositoryName: 'Front',
      prCount: frontItems.length,
      averageHours: frontAvg,
      averageFormatted: formatDuration(frontAvg),
    },
    back: {
      repositoryName: 'Back',
      prCount: backItems.length,
      averageHours: backAvg,
      averageFormatted: formatDuration(backAvg),
    },
  }
}
