import type { WorkItem } from '@backoffice/types/azure-devops.type'
import type {
  MepPlannerRepoAnalysis,
  MepPlannerTicketsResult,
} from './mep-planner.type'
import {
  getTargetLabel,
  isAlreadyDeployed,
  getRepoTitle,
  getLinkedPrsForRepo,
  getPrStatusColor,
  getPrStatusLabel,
  hasIncompleteWorkItems,
} from './mep-planner-results.helper'

const buildAnalysis = (overrides: Partial<MepPlannerRepoAnalysis> = {}): MepPlannerRepoAnalysis => ({
  repositoryName: 'Pulse.API',
  latestMepTag: null,
  headCommitId: '',
  targetVersionTag: null,
  alreadyDeployedSinceTag: null,
  linkedPrIds: [],
  workItemsInRange: [],
  prStatuses: {},
  ...overrides,
})

const buildWorkItem = (overrides: Partial<WorkItem> = {}): WorkItem => ({
  id: 1,
  title: 'Test',
  type: 'User Story',
  state: 'Active',
  team: 'Team',
  webUrl: 'http://example.com',
  ...overrides,
})

describe('mep-planner-results.helper', () => {
  describe('getTargetLabel', () => {
    it('returns targetVersionTag when present', () => {
      const analysis = buildAnalysis({ targetVersionTag: 'v1.2.3' })

      expect(getTargetLabel(analysis)).toBe('v1.2.3')
    })

    it('returns truncated headCommitId when no version tag', () => {
      const analysis = buildAnalysis({ headCommitId: 'abcdef1234567890' })

      expect(getTargetLabel(analysis)).toBe('abcdef12')
    })

    it('returns already deployed label when no headCommitId but alreadyDeployedSinceTag', () => {
      const analysis = buildAnalysis({ alreadyDeployedSinceTag: 'MEP-2026-03-01' })

      expect(getTargetLabel(analysis)).toBe('Déjà en prod depuis MEP-2026-03-01')
    })

    it('returns N/A when nothing matches', () => {
      const analysis = buildAnalysis()

      expect(getTargetLabel(analysis)).toBe('N/A')
    })
  })

  describe('isAlreadyDeployed', () => {
    it('returns true when headCommitId is empty and alreadyDeployedSinceTag is set', () => {
      const analysis = buildAnalysis({ headCommitId: '', alreadyDeployedSinceTag: 'MEP-2026-03-01' })

      expect(isAlreadyDeployed(analysis)).toBe(true)
    })

    it('returns false when headCommitId is not empty', () => {
      const analysis = buildAnalysis({ headCommitId: 'abc123', alreadyDeployedSinceTag: 'MEP-2026-03-01' })

      expect(isAlreadyDeployed(analysis)).toBe(false)
    })

    it('returns false when alreadyDeployedSinceTag is null', () => {
      const analysis = buildAnalysis({ headCommitId: '' })

      expect(isAlreadyDeployed(analysis)).toBe(false)
    })
  })

  describe('getRepoTitle', () => {
    it('returns deployed label when already deployed', () => {
      const analysis = buildAnalysis({ alreadyDeployedSinceTag: 'MEP-2026-03-01' })

      expect(getRepoTitle(analysis)).toBe('Pulse.API — Déjà en prod depuis MEP-2026-03-01')
    })

    it('returns full title with prod, target and work item count', () => {
      const analysis = buildAnalysis({
        latestMepTag: { name: 'MEP-2026-03-01', commitId: 'aaa', date: new Date() },
        headCommitId: 'bbb12345',
        targetVersionTag: 'v1.2.3',
        workItemsInRange: [buildWorkItem()],
      })

      expect(getRepoTitle(analysis)).toBe('Pulse.API — Prod: MEP-2026-03-01 → Cible: v1.2.3 (1 work items)')
    })

    it('returns N/A for prod when no MEP tag', () => {
      const analysis = buildAnalysis({ headCommitId: 'abc12345' })

      expect(getRepoTitle(analysis)).toBe('Pulse.API — Prod: N/A → Cible: abc12345 (0 work items)')
    })
  })

  describe('getLinkedPrsForRepo', () => {
    it('returns empty array when ticketsResult is null', () => {
      const analysis = buildAnalysis()

      expect(getLinkedPrsForRepo(null, analysis)).toEqual([])
    })

    it('filters PRs by repository name', () => {
      const ticketsResult: MepPlannerTicketsResult = {
        workItems: [],
        linkedPrs: [
          { pullRequestId: 1, repositoryName: 'Pulse.API', repositoryId: 'r1', title: 'PR 1', status: 'completed', sourceBranch: 'feat/a', closedDate: null, mergeCommitId: null },
          { pullRequestId: 2, repositoryName: 'Pulse.Web', repositoryId: 'r2', title: 'PR 2', status: 'completed', sourceBranch: 'feat/b', closedDate: null, mergeCommitId: null },
        ],
        repoAnalyses: [],
        warnings: [],
      }
      const analysis = buildAnalysis({ repositoryName: 'Pulse.API' })

      const result = getLinkedPrsForRepo(ticketsResult, analysis)

      expect(result).toHaveLength(1)
      expect(result[0].pullRequestId).toBe(1)
    })
  })

  describe('getPrStatusColor', () => {
    it('returns success for included', () => {
      expect(getPrStatusColor('included')).toBe('success')
    })

    it('returns info for already-deployed', () => {
      expect(getPrStatusColor('already-deployed')).toBe('info')
    })

    it('returns warning for active', () => {
      expect(getPrStatusColor('active')).toBe('warning')
    })

    it('returns danger for not-included', () => {
      expect(getPrStatusColor('not-included')).toBe('danger')
    })

    it('returns danger for undefined', () => {
      expect(getPrStatusColor(undefined)).toBe('danger')
    })
  })

  describe('getPrStatusLabel', () => {
    it('returns Incluse for included', () => {
      expect(getPrStatusLabel('included')).toBe('Incluse')
    })

    it('returns Déjà en prod for already-deployed', () => {
      expect(getPrStatusLabel('already-deployed')).toBe('Déjà en prod')
    })

    it('returns Active for active', () => {
      expect(getPrStatusLabel('active')).toBe('Active')
    })

    it('returns Non incluse for not-included', () => {
      expect(getPrStatusLabel('not-included')).toBe('Non incluse')
    })

    it('returns Non incluse for undefined', () => {
      expect(getPrStatusLabel(undefined)).toBe('Non incluse')
    })
  })

  describe('hasIncompleteWorkItems', () => {
    it('returns true when some work items are not in completed states', () => {
      const workItems = [
        buildWorkItem({ state: 'Active' }),
        buildWorkItem({ state: 'Closed' }),
      ]

      expect(hasIncompleteWorkItems(workItems)).toBe(true)
    })

    it('returns false when all work items are completed', () => {
      const workItems = [
        buildWorkItem({ state: 'Closed' }),
        buildWorkItem({ state: 'Validated' }),
        buildWorkItem({ state: 'Released' }),
      ]

      expect(hasIncompleteWorkItems(workItems)).toBe(false)
    })

    it('returns false for empty array', () => {
      expect(hasIncompleteWorkItems([])).toBe(false)
    })
  })
})
