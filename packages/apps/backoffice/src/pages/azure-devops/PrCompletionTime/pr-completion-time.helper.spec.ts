import {
  computeDurationHours,
  formatDuration,
  cleanBranchName,
  getDurationColor,
  buildPrUrl,
  buildPrCompletionItems,
  computeOverallAverageHours,
  computeStatsByRepository,
  computeFrontBackStats,
} from './pr-completion-time.helper'
import { buildMockPr } from '../__mocks__/pr-completion.mocks'

describe('pr-completion-time.helper', () => {
  describe('computeDurationHours', () => {
    it('should compute 4 hours difference', () => {
      const result = computeDurationHours('2024-01-15T10:00:00Z', '2024-01-15T14:00:00Z')

      expect(result).toBe(4)
    })

    it('should compute fractional hours', () => {
      const result = computeDurationHours('2024-01-15T10:00:00Z', '2024-01-15T10:30:00Z')

      expect(result).toBe(0.5)
    })

    it('should compute multi-day duration', () => {
      const result = computeDurationHours('2024-01-15T10:00:00Z', '2024-01-17T10:00:00Z')

      expect(result).toBe(48)
    })

    it('should return 0 for same dates', () => {
      const result = computeDurationHours('2024-01-15T10:00:00Z', '2024-01-15T10:00:00Z')

      expect(result).toBe(0)
    })
  })

  describe('formatDuration', () => {
    it('should format minutes for less than 1 hour', () => {
      expect(formatDuration(0.5)).toBe('30m')
    })

    it('should format 0 minutes for 0 hours', () => {
      expect(formatDuration(0)).toBe('0m')
    })

    it('should format hours and minutes', () => {
      expect(formatDuration(2.5)).toBe('2h 30m')
    })

    it('should format hours only when no remaining minutes', () => {
      expect(formatDuration(3)).toBe('3h')
    })

    it('should format days and hours for 24+ hours', () => {
      expect(formatDuration(26)).toBe('1j 2h')
    })

    it('should format days only when no remaining hours', () => {
      expect(formatDuration(48)).toBe('2j')
    })

    it('should format large durations', () => {
      expect(formatDuration(100)).toBe('4j 4h')
    })
  })

  describe('cleanBranchName', () => {
    it('should remove refs/heads/ prefix', () => {
      expect(cleanBranchName('refs/heads/feature/test')).toBe('feature/test')
    })

    it('should return as-is if no prefix', () => {
      expect(cleanBranchName('feature/test')).toBe('feature/test')
    })
  })

  describe('getDurationColor', () => {
    it('should return success for less than 24 hours', () => {
      expect(getDurationColor(0)).toBe('success')
      expect(getDurationColor(12)).toBe('success')
      expect(getDurationColor(23.9)).toBe('success')
    })

    it('should return warning for 24 to 72 hours', () => {
      expect(getDurationColor(24)).toBe('warning')
      expect(getDurationColor(48)).toBe('warning')
      expect(getDurationColor(71.9)).toBe('warning')
    })

    it('should return danger for 72 hours or more', () => {
      expect(getDurationColor(72)).toBe('danger')
      expect(getDurationColor(100)).toBe('danger')
      expect(getDurationColor(200)).toBe('danger')
    })
  })

  describe('buildPrUrl', () => {
    it('should build correct Azure DevOps PR URL', () => {
      const result = buildPrUrl('Pulse.Web', 123)

      expect(result).toBe('https://dev.azure.com/FR-TPEME/PULSE/_git/Pulse.Web/pullrequest/123')
    })

    it('should handle different repository names', () => {
      const result = buildPrUrl('Pulse.Api', 456)

      expect(result).toBe('https://dev.azure.com/FR-TPEME/PULSE/_git/Pulse.Api/pullrequest/456')
    })
  })

  describe('buildPrCompletionItems', () => {
    it('should transform pull requests to completion items', () => {
      const prs = [buildMockPr()]

      const result = buildPrCompletionItems(prs)

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({
        pullRequestId: 1,
        title: 'Test PR',
        repositoryName: 'Pulse.Web',
        author: 'John Doe',
        authorEmail: 'john@example.com',
        creationDate: '2024-01-15T10:00:00Z',
        closedDate: '2024-01-15T14:00:00Z',
        durationHours: 4,
        durationFormatted: '4h',
        sourceRefName: 'refs/heads/feature/test',
        targetRefName: 'refs/heads/main',
        status: 'completed',
      })
    })

    it('should handle empty array', () => {
      expect(buildPrCompletionItems([])).toEqual([])
    })

    it('should compute correct duration for each PR', () => {
      const prs = [
        buildMockPr({ pullRequestId: 1, closedDate: '2024-01-15T14:00:00Z' }),
        buildMockPr({ pullRequestId: 2, closedDate: '2024-01-16T10:00:00Z' }),
      ]

      const result = buildPrCompletionItems(prs)

      expect(result[0].durationHours).toBe(4)
      expect(result[1].durationHours).toBe(24)
    })

    it('should set status to active for active PRs', () => {
      const prs = [buildMockPr({ status: 'active', closedDate: null })]

      const result = buildPrCompletionItems(prs)

      expect(result[0].status).toBe('active')
      expect(result[0].closedDate).toBeNull()
      expect(result[0].durationHours).toBeGreaterThan(0)
    })

    it('should set status to completed for completed PRs', () => {
      const prs = [buildMockPr()]

      const result = buildPrCompletionItems(prs)

      expect(result[0].status).toBe('completed')
    })
  })

  describe('computeOverallAverageHours', () => {
    it('should return 0 for empty array', () => {
      expect(computeOverallAverageHours([])).toBe(0)
    })

    it('should compute average of durations', () => {
      const items = buildPrCompletionItems([
        buildMockPr({ closedDate: '2024-01-15T14:00:00Z' }),
        buildMockPr({ closedDate: '2024-01-15T18:00:00Z' }),
      ])

      const result = computeOverallAverageHours(items)

      // (4 + 8) / 2 = 6
      expect(result).toBe(6)
    })

    it('should return the single value for one item', () => {
      const items = buildPrCompletionItems([buildMockPr()])

      expect(computeOverallAverageHours(items)).toBe(4)
    })
  })

  describe('computeStatsByRepository', () => {
    it('should return empty array for empty input', () => {
      expect(computeStatsByRepository([])).toEqual([])
    })

    it('should group PRs by repository', () => {
      const items = buildPrCompletionItems([
        buildMockPr({ pullRequestId: 1, repository: { id: '1', name: 'Pulse.Web' }, closedDate: '2024-01-15T14:00:00Z' }),
        buildMockPr({ pullRequestId: 2, repository: { id: '1', name: 'Pulse.Web' }, closedDate: '2024-01-15T18:00:00Z' }),
        buildMockPr({ pullRequestId: 3, repository: { id: '2', name: 'Pulse.Api' }, closedDate: '2024-01-15T22:00:00Z' }),
      ])

      const result = computeStatsByRepository(items)

      expect(result).toHaveLength(2)
    })

    it('should compute correct average per repo', () => {
      const items = buildPrCompletionItems([
        buildMockPr({ pullRequestId: 1, repository: { id: '1', name: 'Pulse.Web' }, closedDate: '2024-01-15T14:00:00Z' }),
        buildMockPr({ pullRequestId: 2, repository: { id: '1', name: 'Pulse.Web' }, closedDate: '2024-01-15T18:00:00Z' }),
      ])

      const result = computeStatsByRepository(items)
      const webStats = result.find((s) => s.repositoryName === 'Pulse.Web')

      // PR1: 4h, PR2: 8h -> avg = 6h
      expect(webStats?.averageHours).toBe(6)
      expect(webStats?.prCount).toBe(2)
      expect(webStats?.averageFormatted).toBe('6h')
    })

    it('should sort by PR count descending', () => {
      const items = buildPrCompletionItems([
        buildMockPr({ pullRequestId: 1, repository: { id: '2', name: 'Pulse.Api' } }),
        buildMockPr({ pullRequestId: 2, repository: { id: '1', name: 'Pulse.Web' } }),
        buildMockPr({ pullRequestId: 3, repository: { id: '1', name: 'Pulse.Web' } }),
      ])

      const result = computeStatsByRepository(items)

      expect(result[0].repositoryName).toBe('Pulse.Web')
      expect(result[0].prCount).toBe(2)
      expect(result[1].repositoryName).toBe('Pulse.Api')
      expect(result[1].prCount).toBe(1)
    })
  })

  describe('computeFrontBackStats', () => {
    it('should return zeros for empty input', () => {
      const result = computeFrontBackStats([])

      expect(result.front.prCount).toBe(0)
      expect(result.front.averageHours).toBe(0)
      expect(result.back.prCount).toBe(0)
      expect(result.back.averageHours).toBe(0)
    })

    it('should categorize Pulse.Web as Front', () => {
      const items = buildPrCompletionItems([
        buildMockPr({ pullRequestId: 1, repository: { id: '1', name: 'Pulse.Web' }, closedDate: '2024-01-15T14:00:00Z' }),
        buildMockPr({ pullRequestId: 2, repository: { id: '1', name: 'Pulse.Web' }, closedDate: '2024-01-15T18:00:00Z' }),
      ])

      const result = computeFrontBackStats(items)

      expect(result.front.prCount).toBe(2)
      expect(result.front.averageHours).toBe(6)
      expect(result.back.prCount).toBe(0)
    })

    it('should categorize other repos as Back', () => {
      const items = buildPrCompletionItems([
        buildMockPr({ pullRequestId: 1, repository: { id: '2', name: 'Pulse.Api' }, closedDate: '2024-01-15T14:00:00Z' }),
        buildMockPr({ pullRequestId: 2, repository: { id: '3', name: 'Pulse.Services' }, closedDate: '2024-01-15T22:00:00Z' }),
      ])

      const result = computeFrontBackStats(items)

      expect(result.front.prCount).toBe(0)
      expect(result.back.prCount).toBe(2)
      // PR1: 4h, PR2: 12h -> avg = 8h
      expect(result.back.averageHours).toBe(8)
    })

    it('should split between front and back correctly', () => {
      const items = buildPrCompletionItems([
        buildMockPr({ pullRequestId: 1, repository: { id: '1', name: 'Pulse.Web' }, closedDate: '2024-01-15T14:00:00Z' }),
        buildMockPr({ pullRequestId: 2, repository: { id: '2', name: 'Pulse.Api' }, closedDate: '2024-01-15T18:00:00Z' }),
        buildMockPr({ pullRequestId: 3, repository: { id: '3', name: 'Pulse.Services' }, closedDate: '2024-01-15T22:00:00Z' }),
      ])

      const result = computeFrontBackStats(items)

      expect(result.front.prCount).toBe(1)
      expect(result.front.averageHours).toBe(4)
      expect(result.back.prCount).toBe(2)
    })
  })
})
