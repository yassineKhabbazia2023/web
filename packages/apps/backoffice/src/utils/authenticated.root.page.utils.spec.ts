import { parseUserName, getFirstName, getUserInitials } from './authenticated.root.page.utils'

describe('authenticated.root.page.utils', () => {
  describe('parseUserName', () => {
    it.each([
      { input: null, expected: null, description: 'null input' },
      { input: undefined, expected: null, description: 'undefined input' },
      { input: '', expected: null, description: 'empty string' },
      { input: '   ', expected: null, description: 'whitespace only' },
    ])('should return null for $description', ({ input, expected }) => {
      expect(parseUserName(input)).toBe(expected)
    })

    it.each([
      { input: 'Jean', expected: ['Jean'], description: 'single name' },
      { input: 'Jean Dupont', expected: ['Jean', 'Dupont'], description: 'two names' },
      { input: 'Jean Pierre Dupont', expected: ['Jean', 'Pierre', 'Dupont'], description: 'multiple names' },
      { input: 'Jean    Dupont', expected: ['Jean', 'Dupont'], description: 'multiple spaces' },
      { input: '  Jean Dupont  ', expected: ['Jean', 'Dupont'], description: 'leading/trailing spaces' },
    ])('should parse $description correctly', ({ input, expected }) => {
      expect(parseUserName(input)).toEqual(expected)
    })
  })

  describe('getFirstName', () => {
    it.each([
      { input: null, expected: 'Utilisateur', description: 'null' },
      { input: undefined, expected: 'Utilisateur', description: 'undefined' },
      { input: '', expected: 'Utilisateur', description: 'empty string' },
      { input: '   ', expected: 'Utilisateur', description: 'whitespace only' },
    ])('should return default for $description', ({ input, expected }) => {
      expect(getFirstName(input)).toBe(expected)
    })

    it.each([
      { input: 'Jean', expected: 'Jean', description: 'single name' },
      { input: 'Jean Dupont', expected: 'Dupont', description: 'two names (returns last)' },
      { input: 'Jean Pierre Dupont', expected: 'Dupont', description: 'multiple names (returns last)' },
      { input: '  Marie Martin  ', expected: 'Martin', description: 'with spaces (returns last)' },
    ])('should extract first name from $description', ({ input, expected }) => {
      expect(getFirstName(input)).toBe(expected)
    })
  })

  describe('getUserInitials', () => {
    it.each([
      { input: null, expected: 'U', description: 'null' },
      { input: undefined, expected: 'U', description: 'undefined' },
      { input: '', expected: 'U', description: 'empty string' },
      { input: '   ', expected: 'U', description: 'whitespace only' },
    ])('should return default for $description', ({ input, expected }) => {
      expect(getUserInitials(input)).toBe(expected)
    })

    it.each([
      { input: 'Jean', expected: 'J', description: 'single name' },
      { input: 'jean', expected: 'J', description: 'single lowercase name' },
      { input: 'Jean Dupont', expected: 'JD', description: 'two names' },
      { input: 'jean dupont', expected: 'JD', description: 'two lowercase names' },
      { input: 'JeAn DuPoNt', expected: 'JD', description: 'mixed case names' },
      { input: 'Jean Pierre Dupont', expected: 'JP', description: 'multiple names (first 2 only)' },
      { input: '  Marie Martin  ', expected: 'MM', description: 'with leading/trailing spaces' },
    ])('should generate initials from $description', ({ input, expected }) => {
      expect(getUserInitials(input)).toBe(expected)
    })
  })
})
