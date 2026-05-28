import { isValidCommitId, validateCommitId } from './git.util'

describe('isValidCommitId', () => {
  it('should return true for valid full SHA', () => {
    expect(isValidCommitId('a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2')).toBe(true)
  })

  it('should return true for valid abbreviated SHA (7 chars)', () => {
    expect(isValidCommitId('a1b2c3d')).toBe(true)
  })

  it('should return true for valid abbreviated SHA (8 chars)', () => {
    expect(isValidCommitId('a1b2c3d4')).toBe(true)
  })

  it('should return true for uppercase hex', () => {
    expect(isValidCommitId('A1B2C3D4E5F6')).toBe(true)
  })

  it('should return false for too short SHA (6 chars)', () => {
    expect(isValidCommitId('a1b2c3')).toBe(false)
  })

  it('should return false for non-hex characters', () => {
    expect(isValidCommitId('a1b2c3g')).toBe(false)
  })

  it('should return false for empty string', () => {
    expect(isValidCommitId('')).toBe(false)
  })

  it('should return false for string with spaces', () => {
    expect(isValidCommitId('a1b2c3d ')).toBe(false)
  })
})

describe('validateCommitId', () => {
  it('should return null for valid SHA', () => {
    expect(validateCommitId('a1b2c3d4e5f6', 'Test')).toBeNull()
  })

  it('should return null for empty string', () => {
    expect(validateCommitId('', 'Test')).toBeNull()
  })

  it('should return error for too short SHA', () => {
    const result = validateCommitId('abc123', 'Commit ID')
    expect(result).toContain('7 caractères')
  })

  it('should return error for too long SHA', () => {
    const result = validateCommitId('a'.repeat(41), 'Commit ID')
    expect(result).toContain('40 caractères')
  })

  it('should return error for invalid hex', () => {
    const result = validateCommitId('a1b2c3g4', 'Commit ID')
    expect(result).toContain('hexadécimal')
  })

  it('should trim whitespace before validation', () => {
    expect(validateCommitId('  a1b2c3d4  ', 'Test')).toBeNull()
  })
})
