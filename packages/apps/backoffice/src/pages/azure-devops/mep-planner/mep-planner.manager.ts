import { logger } from '@pulse/toolbox'
import { AzureDevOpsService } from '@backoffice/services/azure-devops/azure-devops.service'
import { MepPlannerService } from '@backoffice/services/azure-devops/mep-planner.service'
import type {
  AzureDevOpsBuild,
  AzureDevOpsBuildDefinition,
  AzureDevOpsWorkItemWithRelationsResponse,
  WorkItem,
} from '@backoffice/types/azure-devops.type'
import { AZURE_DEVOPS_CONFIG, MEP_PLANNER_REPO_CONCURRENCY } from '@backoffice/constants/azure-devops.const'
import { MepReadinessStatus } from './mep-planner.enum'
import type {
  MepPlannerLinkedPr,
  MepPlannerLoadingProgress,
  MepPlannerPrStatus,
  MepPlannerRepoAnalysis,
  MepPlannerTicketsResult,
  MepReadinessResult,
  MepRecetteCheck,
} from './mep-planner.type'

export class MepPlannerManager {
  static async fetchDeliveryPipelines(pat: string): Promise<AzureDevOpsBuildDefinition[]> {
    return MepPlannerService.getDeliveryPipelines(pat)
  }

  static async searchTicketsToRepos(
    pat: string,
    workItemIds: number[],
    onProgress?: (progress: MepPlannerLoadingProgress) => void,
  ): Promise<MepPlannerTicketsResult> {
    // Step 1: Fetch work items with relations
    onProgress?.({ current: 0, total: workItemIds.length, step: 'Récupération des work items...' })
    const workItemsWithRelations = await MepPlannerService.getWorkItemsWithRelations(pat, workItemIds)

    if (workItemsWithRelations.length === 0) {
      return { workItems: [], linkedPrs: [], repoAnalyses: [], warnings: ['Aucun work item trouvé pour les IDs fournis.'] }
    }

    const workItems = this.normalizeWorkItems(workItemsWithRelations)
    const uniquePrRefs = this.extractLinkedPrRefs(workItemsWithRelations)

    if (uniquePrRefs.length === 0) {
      return { workItems, linkedPrs: [], repoAnalyses: [], warnings: ['Aucune PR liée trouvée pour ces work items.'] }
    }

    // Step 2: Fetch PR details
    const linkedPrs = await this.fetchLinkedPrs(pat, uniquePrRefs, onProgress)

    // Step 3: Analyze repos
    const { repoAnalyses, warnings } = await this.analyzeRepositories(pat, linkedPrs, onProgress)

    return { workItems, linkedPrs, repoAnalyses, warnings }
  }

  static async checkReadiness(
    pat: string,
    ticketsResult: MepPlannerTicketsResult,
    deliveryPipelines: AzureDevOpsBuildDefinition[],
  ): Promise<MepReadinessResult> {
    const inputWorkItemIds = new Set(ticketsResult.workItems.map((wi) => wi.id))
    const reposNotReady: string[] = []
    const extraWorkItemsMap = new Map<number, WorkItem>()
    const recetteChecks: MepRecetteCheck[] = []

    for (const analysis of ticketsResult.repoAnalyses) {
      if (analysis.headCommitId === '') {
        continue
      }

      if (analysis.targetVersionTag === null) {
        reposNotReady.push(analysis.repositoryName)
      }

      for (const wi of analysis.workItemsInRange) {
        if (inputWorkItemIds.has(wi.id) === false) {
          extraWorkItemsMap.set(wi.id, wi)
        }
      }

      const recetteCheck = await this.checkRecetteForRepo(pat, analysis, deliveryPipelines)
      recetteChecks.push(recetteCheck)
    }

    const hasRecetteIssue = recetteChecks.some(
      (c) => c.recetteDeployed === false && c.fallbackBuild?.recetteDeployed !== true,
    )

    let status: MepReadinessResult['status'] = MepReadinessStatus.Ready
    if (reposNotReady.length > 0 || hasRecetteIssue) {
      status = MepReadinessStatus.NotReady
    } else if (extraWorkItemsMap.size > 0) {
      status = MepReadinessStatus.ReadyWithRisk
    }

    return {
      status,
      reposNotReady,
      extraWorkItems: [...extraWorkItemsMap.values()],
      recetteChecks,
    }
  }

  private static normalizeWorkItems(
    workItemsWithRelations: AzureDevOpsWorkItemWithRelationsResponse[],
  ): WorkItem[] {
    return workItemsWithRelations.map((wi) => ({
      id: wi.id,
      title: wi.fields['System.Title'],
      type: wi.fields['System.WorkItemType'],
      state: wi.fields['System.State'],
      team: wi.fields['System.AreaPath'].split('\\').at(-1) ?? wi.fields['System.AreaPath'],
      webUrl: `${AZURE_DEVOPS_CONFIG.organization}/${AZURE_DEVOPS_CONFIG.project}/_workitems/edit/${wi.id}`,
    }))
  }

  private static extractLinkedPrRefs(
    workItemsWithRelations: AzureDevOpsWorkItemWithRelationsResponse[],
  ): Array<{ repositoryId: string; pullRequestId: number }> {
    const allRefs: Array<{ repositoryId: string; pullRequestId: number }> = []
    for (const wi of workItemsWithRelations) {
      const linked = MepPlannerService.extractLinkedPullRequests(wi.relations)
      allRefs.push(...linked)
    }

    const uniqueMap = new Map<string, { repositoryId: string; pullRequestId: number }>()
    for (const ref of allRefs) {
      uniqueMap.set(`${ref.repositoryId}/${ref.pullRequestId}`, ref)
    }
    return [...uniqueMap.values()]
  }

  private static async fetchLinkedPrs(
    pat: string,
    prRefs: Array<{ repositoryId: string; pullRequestId: number }>,
    onProgress?: (progress: MepPlannerLoadingProgress) => void,
  ): Promise<MepPlannerLinkedPr[]> {
    onProgress?.({ current: 0, total: prRefs.length, step: 'Récupération des PRs liées...' })
    const linkedPrs: MepPlannerLinkedPr[] = []

    for (let i = 0; i < prRefs.length; i += MEP_PLANNER_REPO_CONCURRENCY) {
      const batch = prRefs.slice(i, i + MEP_PLANNER_REPO_CONCURRENCY)
      const batchResults = await Promise.all(
        batch.map(async (ref) => {
          try {
            return await MepPlannerService.getPullRequestById(pat, ref.repositoryId, ref.pullRequestId)
          } catch (err) {
            logger.warn(`Failed to fetch PR ${ref.pullRequestId}:`, err)
            return null
          }
        }),
      )

      for (const pr of batchResults) {
        if (pr !== null) {
          linkedPrs.push({
            pullRequestId: pr.pullRequestId,
            repositoryName: pr.repository.name,
            repositoryId: pr.repository.id,
            title: pr.title,
            status: pr.status,
            sourceBranch: pr.sourceRefName.replace('refs/heads/', ''),
            closedDate: pr.closedDate,
            mergeCommitId: pr.lastMergeCommit?.commitId ?? null,
          })
        }
      }

      onProgress?.({
        current: Math.min(i + MEP_PLANNER_REPO_CONCURRENCY, prRefs.length),
        total: prRefs.length,
        step: 'Récupération des PRs liées...',
      })
    }

    return linkedPrs
  }

  private static async analyzeRepositories(
    pat: string,
    linkedPrs: MepPlannerLinkedPr[],
    onProgress?: (progress: MepPlannerLoadingProgress) => void,
  ): Promise<{ repoAnalyses: MepPlannerRepoAnalysis[]; warnings: string[] }> {
    const repoNames = [...new Set(linkedPrs.map((pr) => pr.repositoryName))]
    onProgress?.({ current: 0, total: repoNames.length, step: 'Analyse des repositories...' })
    const repoAnalyses: MepPlannerRepoAnalysis[] = []
    const warnings: string[] = []

    for (let i = 0; i < repoNames.length; i += MEP_PLANNER_REPO_CONCURRENCY) {
      const batch = repoNames.slice(i, i + MEP_PLANNER_REPO_CONCURRENCY)
      const batchResults = await Promise.all(
        batch.map(async (repoName) => {
          try {
            return await this.analyzeRepository(pat, repoName, linkedPrs)
          } catch (err) {
            logger.error(`Failed to analyze repo ${repoName}:`, err)
            return { analysis: null, warnings: [`Erreur lors de l'analyse du repository "${repoName}".`] }
          }
        }),
      )

      for (const batchResult of batchResults) {
        if (batchResult.analysis !== null) {
          repoAnalyses.push(batchResult.analysis)
        }
        warnings.push(...batchResult.warnings)
      }

      onProgress?.({
        current: Math.min(i + MEP_PLANNER_REPO_CONCURRENCY, repoNames.length),
        total: repoNames.length,
        step: 'Analyse des repositories...',
      })
    }

    return { repoAnalyses, warnings }
  }

  private static async analyzeRepository(
    pat: string,
    repoName: string,
    linkedPrs: MepPlannerLinkedPr[],
  ): Promise<{ analysis: MepPlannerRepoAnalysis; warnings: string[] }> {
    const warnings: string[] = []
    const mepTag = await AzureDevOpsService.getLatestMepTag(pat, repoName)
    const repoPrs = linkedPrs.filter((pr) => pr.repositoryName === repoName)
    const prStatuses: Record<number, MepPlannerPrStatus> = {}
    let workItemsInRange: WorkItem[] = []

    const completedPrs: Array<{ prId: number; commitId: string; closedDate: string }> = []

    for (const pr of repoPrs) {
      if (pr.status === 'active') {
        prStatuses[pr.pullRequestId] = 'active'
      } else if (pr.status === 'completed' && pr.mergeCommitId !== null) {
        completedPrs.push({
          prId: pr.pullRequestId,
          commitId: pr.mergeCommitId,
          closedDate: pr.closedDate ?? '',
        })
      } else {
        prStatuses[pr.pullRequestId] = 'not-included'
      }
    }

    let targetCommitId = ''
    let targetVersionTag: string | null = null
    let alreadyDeployedSinceTag: string | null = null

    if (mepTag !== null && completedPrs.length > 0) {
      const [commitsAfterMep, allTags] = await Promise.all([
        AzureDevOpsService.getCommitIdsAfterTag(pat, repoName, mepTag.commitId),
        AzureDevOpsService.getAllTags(pat, repoName),
      ])

      const includedPrs: typeof completedPrs = []
      for (const pr of completedPrs) {
        if (commitsAfterMep.has(pr.commitId)) {
          prStatuses[pr.prId] = 'included'
          includedPrs.push(pr)
        } else {
          prStatuses[pr.prId] = 'already-deployed'
        }
      }

      const mepVersionTag = AzureDevOpsService.findVersionTagForCommit(allTags, mepTag.commitId)
      if (mepVersionTag !== null) {
        mepTag.name = `${mepVersionTag} (${mepTag.name})`
      }

      if (includedPrs.length > 0) {
        includedPrs.sort((a, b) =>
          new Date(b.closedDate).getTime() - new Date(a.closedDate).getTime(),
        )
        targetCommitId = includedPrs[0].commitId

        const workItemsRangeResult = await AzureDevOpsService.getWorkItemsForCommitRange(
          pat, repoName, mepTag.commitId, targetCommitId,
        )

        workItemsInRange = Object.values(workItemsRangeResult.workItemsByTeam).flat()
        targetVersionTag = AzureDevOpsService.findVersionTagForCommit(allTags, targetCommitId)

        if (workItemsRangeResult.warnings.length > 0) {
          warnings.push(...workItemsRangeResult.warnings)
        }
      } else {
        alreadyDeployedSinceTag = mepTag.name
      }
    } else if (mepTag !== null && completedPrs.length === 0) {
      const allTags = await AzureDevOpsService.getAllTags(pat, repoName)
      const mepVersionTag = AzureDevOpsService.findVersionTagForCommit(allTags, mepTag.commitId)
      if (mepVersionTag !== null) {
        mepTag.name = `${mepVersionTag} (${mepTag.name})`
      }
    } else if (mepTag === null) {
      for (const pr of completedPrs) {
        prStatuses[pr.prId] = 'included'
      }
      warnings.push(`Aucun tag MEP trouvé pour le repository "${repoName}".`)
    }

    return {
      analysis: {
        repositoryName: repoName,
        latestMepTag: mepTag,
        headCommitId: targetCommitId,
        targetVersionTag,
        alreadyDeployedSinceTag,
        linkedPrIds: repoPrs.map((pr) => pr.pullRequestId),
        workItemsInRange,
        prStatuses,
      },
      warnings,
    }
  }

  private static async checkRecetteForRepo(
    pat: string,
    analysis: MepPlannerRepoAnalysis,
    deliveryPipelines: AzureDevOpsBuildDefinition[],
  ): Promise<MepRecetteCheck> {
    const candidatePipelines = deliveryPipelines.filter(
      (p) => p.repository?.name === analysis.repositoryName
        || (p.name.startsWith(analysis.repositoryName) && p.name.endsWith('.Delivery')),
    )

    if (candidatePipelines.length === 0) {
      return {
        repositoryName: analysis.repositoryName,
        pipelineName: null,
        buildId: null,
        buildNumber: null,
        isExactBuild: false,
        recetteDeployed: false,
        lastStageName: null,
        buildUrl: null,
        fallbackBuild: null,
      }
    }

    // Fetch all builds from main branch for each candidate pipeline, find the exact + fallback
    let allBuilds: AzureDevOpsBuild[] = []
    let matchedPipeline: AzureDevOpsBuildDefinition = candidatePipelines[0]

    for (const candidate of candidatePipelines) {
      const builds = await MepPlannerService.getBuildsForBranch(pat, candidate.id)

      if (builds.length > 0) {
        allBuilds = builds
        matchedPipeline = candidate
        break
      }
    }

    if (allBuilds.length === 0) {
      return {
        repositoryName: analysis.repositoryName,
        pipelineName: candidatePipelines.map((p) => p.name).join(', '),
        buildId: null,
        buildNumber: null,
        isExactBuild: false,
        recetteDeployed: false,
        lastStageName: null,
        buildUrl: null,
        fallbackBuild: null,
      }
    }

    const exactBuild = allBuilds.find((b) => b.sourceVersion === analysis.headCommitId)

    if (exactBuild === undefined) {
      return {
        repositoryName: analysis.repositoryName,
        pipelineName: matchedPipeline.name,
        buildId: null,
        buildNumber: null,
        isExactBuild: false,
        recetteDeployed: false,
        lastStageName: null,
        buildUrl: null,
        fallbackBuild: null,
      }
    }

    const timeline = await MepPlannerService.getBuildTimeline(pat, exactBuild.id)
    const stages = timeline.filter((r) => r.type === 'Stage')

    const recetteStage = stages.find((r) => r.name === '[Deploy] rec')
    const recetteDeployed = recetteStage?.state === 'completed'
      && recetteStage.result === 'succeeded'

    const lastCompletedStage = [...stages]
      .reverse()
      .find((r) => r.state === 'completed' || r.state === 'inProgress')

    const buildUrl = `${AZURE_DEVOPS_CONFIG.organization}/${AZURE_DEVOPS_CONFIG.project}/_build/results?buildId=${exactBuild.id}&view=results`

    let fallbackBuild: MepRecetteCheck['fallbackBuild'] = null
    if (stages.length <= 1 && recetteDeployed === false) {
      const newerBuilds = allBuilds
        .filter((b) => b.id > exactBuild.id)
        .sort((a, b) => a.id - b.id)

      for (const candidate of newerBuilds) {
        const candidateTimeline = await MepPlannerService.getBuildTimeline(pat, candidate.id)
        const candidateStages = candidateTimeline.filter((r) => r.type === 'Stage')

        if (candidateStages.some((r) => r.name === '[Deploy] rec') === true) {
          const recStage = candidateStages.find((r) => r.name === '[Deploy] rec')
          const recDeployed = recStage?.state === 'completed'
            && recStage.result === 'succeeded'
          const lastStage = [...candidateStages]
            .reverse()
            .find((r) => r.state === 'completed' || r.state === 'inProgress')

          fallbackBuild = {
            buildId: candidate.id,
            buildNumber: candidate.buildNumber,
            sourceVersion: candidate.sourceVersion,
            buildUrl: `${AZURE_DEVOPS_CONFIG.organization}/${AZURE_DEVOPS_CONFIG.project}/_build/results?buildId=${candidate.id}&view=results`,
            recetteDeployed: recDeployed,
            lastStageName: lastStage?.name ?? null,
          }
          break
        }
      }
    }

    return {
      repositoryName: analysis.repositoryName,
      pipelineName: matchedPipeline.name,
      buildId: exactBuild.id,
      buildNumber: exactBuild.buildNumber,
      isExactBuild: true,
      recetteDeployed,
      lastStageName: lastCompletedStage?.name ?? null,
      buildUrl,
      fallbackBuild,
    }
  }
}
