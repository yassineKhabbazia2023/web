import { getEmailIsValid } from './validators.utils'

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
})
