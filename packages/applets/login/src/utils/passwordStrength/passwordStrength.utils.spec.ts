import type { PStrengthLevel } from '@pulse/styleguide/types'
import { getPasswordStrength } from './passwordStrength.utils'

describe('test passwordStrength.utils', () => {
  describe('getPasswordStrength', () => {
    const tests: {
      password: string
      expectedStrength: PStrengthLevel
      reason: string
    }[] = [{
      password: '',
      expectedStrength: 0,
      reason: 'is empty',
    }, {
      password: '0123456',
      expectedStrength: 1,
      reason: 'is too small',
    }, {
      password: '01234567',
      expectedStrength: 1,
      reason: 'does not contain letters',
    }, {
      password: '01234567a',
      expectedStrength: 2,
      reason: 'does not contain uppercase',
    }, {
      password: '01234567aB',
      expectedStrength: 3,
      reason: 'does not contain special character',
    }, {
      password: '01234567aB&',
      expectedStrength: 4,
      reason: 'is complex enough',
    }]
    it.each(tests)('should return $expected when password $reason', ({
      password,
      expectedStrength,
    }) => {
      const strength = getPasswordStrength(password)

      expect(strength).toStrictEqual(expectedStrength)
    })
  })
})
