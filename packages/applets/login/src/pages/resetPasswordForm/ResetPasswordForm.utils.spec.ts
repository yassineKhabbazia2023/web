import { describe, expect, it } from 'vitest'
import { getPasswordError, getConfirmPasswordError } from './ResetPasswordForm.utils'
import { PStrengthLevel } from '@pulse/styleguide/types'

const validPasswordMock = 'aaAA11@@'

describe('test ResetPasswordForm.utils', () => {
  describe('getPasswordError', () => {
    const requiredErrorMessage = 'Veuillez renseigner votre mot de passe'
    const levelLowErrorMessage = 'Votre mot de passe n\'est pas valide'
    const tests: {
      password: string
      passwordStrengthLevel: PStrengthLevel
      expectedMessage: string
      reason: string
    }[] = [{
      password: '',
      passwordStrengthLevel: 2,
      expectedMessage: requiredErrorMessage,
      reason: 'is empty',
    }, {
      password: 'abc',
      passwordStrengthLevel: 2,
      expectedMessage: levelLowErrorMessage,
      reason: 'is too simple',
    }, {
      password: validPasswordMock,
      passwordStrengthLevel: PStrengthLevel.STRONG,
      expectedMessage: '',
      reason: 'is correct',
    }]
    it.each(tests)('should return $expectedMessage when $reason', ({
      password,
      passwordStrengthLevel,
      expectedMessage,
    }) => {
      const message = getPasswordError(password, passwordStrengthLevel, requiredErrorMessage, levelLowErrorMessage)

      expect(message).toBe(expectedMessage)
    })
  })

  describe('getConfirmPasswordError', () => {
    const password = 'abc'
    const requiredErrorMessage = 'Veuillez renseigner votre mot de passe'
    const notMatchErrorMessage = 'Les mots de passe ne correspondent pas!'
    const tests = [{
      confirmPassword: '',
      expectedMessage: requiredErrorMessage,
      reason: 'is empty',
    }, {
      confirmPassword: 'diff',
      expectedMessage: notMatchErrorMessage,
      reason: 'is different from password',
    }, {
      confirmPassword: password,
      expectedMessage: '',
      reason: 'is correct',
    }]
    it.each(tests)('should return $expectedMessage when $reason', ({
      confirmPassword,
      expectedMessage,
    }) => {
      const message = getConfirmPasswordError(confirmPassword, password, requiredErrorMessage, notMatchErrorMessage)

      expect(message).toBe(expectedMessage)
    })
  })
})
