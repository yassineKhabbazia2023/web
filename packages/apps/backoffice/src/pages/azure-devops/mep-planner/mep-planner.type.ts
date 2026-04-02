import type { PTagProps } from '@pulse/styleguide/types'
import type { MepTag, WorkItem } from '@backoffice/types/azure-devops.type'
import type { MepReadinessStatus } from './mep-planner.enum'

export type TagColor = NonNullable<PTagProps['pColor']>

export interface MepPlannerLoadingProgress {
  current: number
  total: number
  step: string
}

export type MepPlannerPrStatus = 'included' | 'not-included' | 'active' | 'already-deployed'

export interface MepPlannerLinkedPr {
  pullRequestId: number
  repositoryName: string
  repositoryId: string
  title: string
  status: string
  sourceBranch: string
  closedDate: string | null
  mergeCommitId: string | null
}

export interface MepPlannerRepoAnalysis {
  repositoryName: string
  latestMepTag: MepTag | null
  headCommitId: string
  targetVersionTag: string | null
  alreadyDeployedSinceTag: string | null
  linkedPrIds: number[]
  workItemsInRange: WorkItem[]
  prStatuses: Record<number, MepPlannerPrStatus>
}

export interface MepPlannerTicketsResult {
  workItems: WorkItem[]
  linkedPrs: MepPlannerLinkedPr[]
  repoAnalyses: MepPlannerRepoAnalysis[]
  warnings: string[]
}

export interface MepRecetteFallbackBuild {
  buildId: number
  buildNumber: string
  sourceVersion: string
  buildUrl: string
  recetteDeployed: boolean
  lastStageName: string | null
}

export interface MepRecetteCheck {
  repositoryName: string
  pipelineName: string | null
  buildId: number | null
  buildNumber: string | null
  isExactBuild: boolean
  recetteDeployed: boolean
  lastStageName: string | null
  buildUrl: string | null
  fallbackBuild: MepRecetteFallbackBuild | null
}

export interface MepReadinessResult {
  status: MepReadinessStatus
  reposNotReady: string[]
  extraWorkItems: WorkItem[]
  recetteChecks: MepRecetteCheck[]
}
