import { getEmailIsValid, getNameIsValid } from './validators.utils'

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
      email: 'abc@test.fr',
      expectedIsValid: true,
      reason: 'conform',
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

})
