import {
  formatTotalCalls,
  formatTotalCost,
  formatAverageTime,
  formatSatisfactionRate,
} from './ai-monitoring-stats.utils'

describe('ai-monitoring-stats.utils', () => {
  describe('formatTotalCalls', () => {
    it('should format integer without decimals', () => {
      expect(formatTotalCalls(10)).toBe('10')
    })

    it('should format large numbers with locale separator', () => {
      expect(formatTotalCalls(1234)).toMatch(/1[\s\u202f]?234/)
    })

    it('should handle zero', () => {
      expect(formatTotalCalls(0)).toBe('0')
    })
  })

  describe('formatTotalCost', () => {
    it('should format cost with 2 decimals and euro symbol', () => {
      const result = formatTotalCost(0.99)
      expect(result).toContain('0,99')
      expect(result).toContain('€')
    })

    it('should format zero cost', () => {
      const result = formatTotalCost(0)
      expect(result).toContain('0,00')
      expect(result).toContain('€')
    })

    it('should format small decimals', () => {
      const result = formatTotalCost(0.0001)
      expect(result).toContain('€')
    })
  })

  describe('formatAverageTime', () => {
    it('should format time with 2 decimals and s suffix', () => {
      const result = formatAverageTime(2.21)
      expect(result).toContain('2,21')
      expect(result).toContain('s')
    })

    it('should format integer time with 2 decimals', () => {
      const result = formatAverageTime(5)
      expect(result).toContain('5,00')
      expect(result).toContain('s')
    })

    it('should format zero time', () => {
      const result = formatAverageTime(0)
      expect(result).toContain('0,00')
      expect(result).toContain('s')
    })
  })

  describe('formatSatisfactionRate', () => {
    it('should format rate as percentage', () => {
      expect(formatSatisfactionRate(75)).toBe('75%')
    })

    it('should round decimal rates', () => {
      expect(formatSatisfactionRate(75.6)).toBe('76%')
      expect(formatSatisfactionRate(75.4)).toBe('75%')
    })

    it('should handle 100%', () => {
      expect(formatSatisfactionRate(100)).toBe('100%')
    })

    it('should handle 0%', () => {
      expect(formatSatisfactionRate(0)).toBe('0%')
    })
  })
})
