import { PStrengthLevel } from '@pulse/styleguide/types'
import { getPasswordStrength } from './password-fields.utils'

describe('password-fields.utils', () => {
  describe('getPasswordStrength', () => {
    it('should return STRONG when password matches all rules', () => {
      const password = 'Test123!@#'
      const result = getPasswordStrength(password)

      expect(result).toBe(PStrengthLevel.STRONG)
    })

    it('should return MEDIUM when password misses one rule', () => {
      const password = 'test123!@#'
      const result = getPasswordStrength(password)

      expect(result).toBe(PStrengthLevel.MEDIUM)
    })

    it('should return POOR when password misses two rules', () => {
      const password = 'TEST1234'
      const result = getPasswordStrength(password)

      expect(result).toBe(PStrengthLevel.POOR)
    })

    it('should return WEAK when password misses three rules', () => {
      const password = 'test'
      const result = getPasswordStrength(password)

      expect(result).toBe(PStrengthLevel.WEAK)
    })

    it('should return WEAK when password misses four rules', () => {
      const password = 't'
      const result = getPasswordStrength(password)

      expect(result).toBe(PStrengthLevel.WEAK)
    })

    it('should return 0 when password is empty', () => {
      const password = ''
      const result = getPasswordStrength(password)

      expect(result).toBe(0)
    })

    it('should return STRONG when password has minimum 8 chars, uppercase, lowercase, number and special char', () => {
      const password = 'Abcdef1!'
      const result = getPasswordStrength(password)

      expect(result).toBe(PStrengthLevel.STRONG)
    })

    it('should return MEDIUM when password misses special char', () => {
      const password = 'Abcdef123'
      const result = getPasswordStrength(password)

      expect(result).toBe(PStrengthLevel.MEDIUM)
    })

    it('should return MEDIUM when password misses number', () => {
      const password = 'Abcdefgh!'
      const result = getPasswordStrength(password)

      expect(result).toBe(PStrengthLevel.MEDIUM)
    })

    it('should return POOR when password misses lowercase and special char', () => {
      const password = 'ABCDEF123'
      const result = getPasswordStrength(password)

      expect(result).toBe(PStrengthLevel.POOR)
    })
  })
})
