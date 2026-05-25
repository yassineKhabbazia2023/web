import { getEmailIsValid, isNotNullNorEmpty, isNullOrEmpty, getNameIsValid } from './validators.utils'

describe('test validators.utils', () => {
  describe('getEmailIsValid', () => {
    const tests = [{
      email: '',
      expectedIsValid: false,
      reason: 'empty',
    }, {
      email: 'abc',
      expectedIsValid: false,
      reason: 'not conform',
    }, {
      email: '  abc@test.fr  ',
      expectedIsValid: true,
      reason: 'conform with spaces',
    }, {
      email: 'abc@test.fr',
      expectedIsValid: true,
      reason: 'conform',
    }, {
      email: 'tést@test.fr',
      expectedIsValid: false,
      reason: 'non-ascii',
    }, {
      email: 'a-b.c@test-test.co.fr',
      expectedIsValid: true,
      reason: 'conform',
    }]
    it.each(tests)('should return $expectedIsValid when email is $reason', ({
      email,
      expectedIsValid,
    }) => {
      const isValid = getEmailIsValid(email)

      expect(isValid).toBe(expectedIsValid)
    })

    const tooLongTldBase = 'toolongtldddddddddddddddddddddddddddddddddd'
    const tooLongTld = `test@domain.${tooLongTldBase}${'d'.repeat(Math.max(0, 64 - tooLongTldBase.length))}`
    const invalidEmails = [
      '.test@gmail.com',
      'test@.com.fs',
      'test.@gmail.com',
      'test..email@gmail.com',
      'test@gmail..com',
      'test@domain.c',
      'test@domain.123',
      tooLongTld,
      'tést@gmail.com',
      '用户@domain.com',
      'test@dömain.com',
      'test@gmail.com<script>',
      'test@gmail.com;',
      'test@gmail.com--',
    ]

    it.each(invalidEmails)('should return false for invalid email %s', (email) => {
      expect(getEmailIsValid(email)).toBe(false)
    })
  })
  describe('getNameIsValid', () => {
    const tests = [
      // Valid names
      { name: 'Élodie', expectedIsValid: true },
      { name: 'Jean', expectedIsValid: true },
      { name: 'Jean-Pierre', expectedIsValid: true },
      { name: 'Marie Claire', expectedIsValid: true },
      { name: 'Chloé', expectedIsValid: true },
      { name: 'François', expectedIsValid: true },
      { name: 'Anaïs', expectedIsValid: true },
      { name: 'Maëlys', expectedIsValid: true },
      { name: 'Dubois', expectedIsValid: true },
      { name: 'Legrand', expectedIsValid: true },
      { name: 'Delaunay', expectedIsValid: true },
      { name: 'Le Blanc', expectedIsValid: true },
      { name: 'Saint-Exupéry', expectedIsValid: true },
      { name: 'Lefèvre', expectedIsValid: true },
      { name: 'Morel-Lefort', expectedIsValid: true },
      // Invalid names
      { name: '', expectedIsValid: false },
      { name: 'Jean123', expectedIsValid: false },
      { name: 'Marie!', expectedIsValid: false },
      { name: ' Pierre', expectedIsValid: false },
      { name: 'Jean-', expectedIsValid: false },
      { name: '-Jean', expectedIsValid: false },
      { name: 'Jean  Pierre', expectedIsValid: false },
      { name: 'Jean--Pierre', expectedIsValid: false },
    ]
    it.each(tests)('should return $expectedIsValid for "$name"', ({ name, expectedIsValid }) => {
      const isValid = getNameIsValid(name)
      expect(isValid).toBe(expectedIsValid)
    })
  })

  describe('isNotNullNorEmpty', () => {
    const tests = [
      { value: undefined, expected: false },
      { value: null, expected: false },
      { value: '', expected: false },
      { value: 0, expected: true },
      { value: false, expected: true },
      { value: 'value', expected: true },
    ]

    it.each(tests)('should return $expected for value $value', ({ value, expected }) => {
      const isNotEmpty = isNotNullNorEmpty(value)

      expect(isNotEmpty).toBe(expected)
    })
  })

  describe('isNullOrEmpty', () => {
    const tests = [
      { value: undefined, expected: true },
      { value: null, expected: true },
      { value: '', expected: true },
      { value: 0, expected: false },
      { value: false, expected: false },
      { value: 'value', expected: false },
    ]

    it.each(tests)('should return $expected for value $value', ({ value, expected }) => {
      expect(isNullOrEmpty(value)).toBe(expected)
    })
  })

})
