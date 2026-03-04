import {
  toDateKey,
  toUtcDays,
  formatDate,
  formatCommitDate,
  getColorLevel,
  isMergePullRequest,
} from './contribution-graph.helper'

describe('contribution-graph.helper', () => {
  describe('toDateKey', () => {
    it('should format date to YYYY-MM-DD', () => {
      const date = new Date(2024, 0, 15)

      expect(toDateKey(date)).toBe('2024-01-15')
    })

    it('should pad single-digit month and day', () => {
      const date = new Date(2024, 2, 5)

      expect(toDateKey(date)).toBe('2024-03-05')
    })
  })

  describe('toUtcDays', () => {
    it('should return the number of days since epoch', () => {
      // 1970-01-02 = 1 day since epoch
      const date = new Date(1970, 0, 2)

      expect(toUtcDays(date)).toBe(1)
    })

    it('should return 0 for epoch date', () => {
      const date = new Date(1970, 0, 1)

      expect(toUtcDays(date)).toBe(0)
    })

    it('should return consistent difference between two dates', () => {
      const dateA = new Date(2024, 0, 1)
      const dateB = new Date(2024, 0, 8)

      expect(toUtcDays(dateB) - toUtcDays(dateA)).toBe(7)
    })
  })

  describe('formatDate', () => {
    it('should format date as "day Month year"', () => {
      const date = new Date(2024, 0, 15)

      expect(formatDate(date)).toBe('15 Jan 2024')
    })

    it('should use correct month abbreviation', () => {
      const date = new Date(2024, 11, 3)

      expect(formatDate(date)).toBe('3 Dec 2024')
    })
  })

  describe('formatCommitDate', () => {
    it('should format a date string in French locale', () => {
      const result = formatCommitDate('2024-01-15T10:30:00Z')

      expect(result).toBeTruthy()
      expect(typeof result).toBe('string')
    })
  })

  describe('getColorLevel', () => {
    it('should return 0 for 0 commits', () => {
      expect(getColorLevel(0)).toBe(0)
    })

    it('should return 1 for 1-2 commits', () => {
      expect(getColorLevel(1)).toBe(1)
      expect(getColorLevel(2)).toBe(1)
    })

    it('should return 2 for 3-5 commits', () => {
      expect(getColorLevel(3)).toBe(2)
      expect(getColorLevel(5)).toBe(2)
    })

    it('should return 3 for 6-9 commits', () => {
      expect(getColorLevel(6)).toBe(3)
      expect(getColorLevel(9)).toBe(3)
    })

    it('should return 4 for 10+ commits', () => {
      expect(getColorLevel(10)).toBe(4)
      expect(getColorLevel(100)).toBe(4)
    })
  })

  describe('isMergePullRequest', () => {
    it('should return true for merge pull request comments', () => {
      expect(isMergePullRequest('Merge pull request 8049 from feature/login into main')).toBe(true)
    })

    it('should be case insensitive', () => {
      expect(isMergePullRequest('MERGE PULL REQUEST 123 from feature/test')).toBe(true)
    })

    it('should return false for regular commit comments', () => {
      expect(isMergePullRequest('Fix login bug')).toBe(false)
    })

    it('should return false for merge branch comments', () => {
      expect(isMergePullRequest('Merge refs/heads/feature/login into refs/heads/main')).toBe(false)
    })
  })
})
