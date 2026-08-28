import {
  formatNullableText,
  getLockStatusColor,
  getLockStatusLabel,
} from './agents-dashboard-table.utils'

describe('agents-dashboard-table.utils', () => {
  describe('getLockStatusLabel', () => {
    it('should return locked label when agent is locked', () => {
      expect(getLockStatusLabel(true)).toBe('Verrouillé')
    })

    it('should return unlocked label when agent is unlocked', () => {
      expect(getLockStatusLabel(false)).toBe('Déverrouillé')
    })
  })

  describe('getLockStatusColor', () => {
    it('should return danger color when agent is locked', () => {
      expect(getLockStatusColor(true)).toBe('danger')
    })

    it('should return success color when agent is unlocked', () => {
      expect(getLockStatusColor(false)).toBe('success')
    })
  })

  describe('formatNullableText', () => {
    it('should return value when filled', () => {
      expect(formatNullableText('xbtige')).toBe('xbtige')
    })

    it('should return fallback when value is null', () => {
      expect(formatNullableText(null)).toBe('-')
    })

    it('should return fallback when value is empty', () => {
      expect(formatNullableText('')).toBe('-')
    })
  })
})
