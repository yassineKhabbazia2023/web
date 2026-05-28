import { PStrengthLevel } from '@pulse/styleguide/types'
import { getPasswordStrength } from './password-fields.utils'
import type { PasswordValidationTranslations } from './password-fields.types'

type ValidationCallback = (error?: Error | string) => void

/**
 * Creates a validator for the new password field
 * Validates both presence and password strength
 * @param translations - Localized error messages
 * @returns Validator function compatible with Element Plus pRules
 */
export function createNewPasswordValidator(
  translations: PasswordValidationTranslations,
) {
  return (_rule: unknown, value: any, callback: ValidationCallback) => {
    if (value === '' || value === null || value === undefined) {
      callback(new Error(translations.newPasswordRequired))
      return
    }

    const strength = getPasswordStrength(value)
    if (strength !== PStrengthLevel.STRONG) {
      callback(new Error(translations.newPasswordWeak))
      return
    }

    callback()
  }
}

/**
 * Creates a validator for the confirm password field
 * Validates both presence and match with new password
 * @param translations - Localized error messages
 * @param getNewPassword - Function that returns the new password value for comparison
 * @returns Validator function compatible with Element Plus pRules
 */
export function createConfirmPasswordValidator(
  translations: PasswordValidationTranslations,
  getNewPassword: () => string,
) {
  return (_rule: unknown, value: any, callback: ValidationCallback) => {
    if (value === '' || value === null || value === undefined) {
      callback(new Error(translations.confirmPasswordRequired))
      return
    }

    if (value !== getNewPassword()) {
      callback(new Error(translations.confirmPasswordMismatch))
      return
    }

    callback()
  }
}
