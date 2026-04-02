import type { WorkItem } from '@backoffice/types/azure-devops.type'
import { WORK_ITEM_COMPLETED_STATES } from '@backoffice/constants/azure-devops.const'
import type { IconName } from '@pulse/styleguide/types'
import type {
  MepPlannerLinkedPr,
  MepPlannerPrStatus,
  MepPlannerRepoAnalysis,
  MepPlannerTicketsResult,
  MepRecetteCheck,
  TagColor,
} from './mep-planner.type'

export const getTargetLabel = (analysis: MepPlannerRepoAnalysis): string => {
  if (analysis.targetVersionTag !== null) {
    return analysis.targetVersionTag
  }
  if (analysis.headCommitId !== '') {
    return analysis.headCommitId.substring(0, 8)
  }
  if (analysis.alreadyDeployedSinceTag !== null) {
    return `Déjà en prod depuis ${analysis.alreadyDeployedSinceTag}`
  }
  return 'N/A'
}

export const isAlreadyDeployed = (analysis: MepPlannerRepoAnalysis): boolean => {
  return analysis.headCommitId === '' && analysis.alreadyDeployedSinceTag !== null
}

export const getRepoTitle = (analysis: MepPlannerRepoAnalysis): string => {
  const prodLabel = analysis.latestMepTag?.name ?? 'N/A'
  const targetLabel = getTargetLabel(analysis)
  const wiCount = analysis.workItemsInRange.length

  if (isAlreadyDeployed(analysis) === true) {
    return `${analysis.repositoryName} — ${targetLabel}`
  }

  return `${analysis.repositoryName} — Prod: ${prodLabel} → Cible: ${targetLabel} (${wiCount} work items)`
}

export const getLinkedPrsForRepo = (
  ticketsResult: MepPlannerTicketsResult | null,
  analysis: MepPlannerRepoAnalysis,
): MepPlannerLinkedPr[] => {
  if (ticketsResult === null) {
    return []
  }
  return ticketsResult.linkedPrs.filter(
    (pr) => pr.repositoryName === analysis.repositoryName,
  )
}

export const getPrStatusColor = (status: MepPlannerPrStatus | undefined): TagColor => {
  if (status === 'included') {
    return 'success'
  }
  if (status === 'already-deployed') {
    return 'info'
  }
  if (status === 'active') {
    return 'warning'
  }
  return 'danger'
}

export const getPrStatusLabel = (status: MepPlannerPrStatus | undefined): string => {
  if (status === 'included') {
    return 'Incluse'
  }
  if (status === 'already-deployed') {
    return 'Déjà en prod'
  }
  if (status === 'active') {
    return 'Active'
  }
  return 'Non incluse'
}

export const getRecetteCheckIcon = (check: MepRecetteCheck): IconName => {
  if (check.recetteDeployed === true || check.fallbackBuild?.recetteDeployed === true) {
    return 'check'
  }
  return 'xCircle'
}

export const getRecetteCheckIconClass = (check: MepRecetteCheck): string => {
  if (check.recetteDeployed === true || check.fallbackBuild?.recetteDeployed === true) {
    return 'text-color--success-500'
  }
  return 'text-color--danger-500'
}

export const hasIncompleteWorkItems = (workItems: WorkItem[]): boolean => {
  return workItems.some(
    (wi) => WORK_ITEM_COMPLETED_STATES.includes(wi.state as typeof WORK_ITEM_COMPLETED_STATES[number]) === false,
  )
}
