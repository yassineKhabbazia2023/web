import { PNotification } from '@pulse/styleguide'
import { logger } from '@pulse/toolbox'
import { updatePassword } from '@pulse/common/services/authentication'
import { PStrengthLevel } from '@pulse/styleguide/types'
import type { UserInfo, UpdatePasswordPayload } from '@pulse/common/types'
import type { PasswordValidationTranslations } from '@pulse/shared/types'
import { BackEndErrors } from '@pulse/common/constants'

type ValidationCallback = (error?: Error | string) => void

/**
 * Manager for UpdatePassword component
 * Contains pure business logic for password update operations
 */
export class UpdatePasswordManager {
  /**
   * Validates password form values
   * @param currentPassword - Current password value
   * @param newPassword - New password value
   * @param confirmPassword - Confirm password value
   * @param passwordStrength - Password strength level
   * @returns True if form is valid, false otherwise
   */
  static validatePasswordForm(
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
    passwordStrength: PStrengthLevel,
  ): boolean {
    return (
      currentPassword !== '' &&
      newPassword !== '' &&
      confirmPassword !== '' &&
      newPassword === confirmPassword &&
      passwordStrength === PStrengthLevel.STRONG
    )
  }

  /**
   * Updates user password via API
   * @param payload - Password update payload
   * @param contactId - User's contact ID
   */
  static async updateUserPassword(
    payload: UpdatePasswordPayload,
    contactId: UserInfo['id'],
  ): Promise<void> {
    await updatePassword(payload, contactId)
    logger.info('Password updated successfully')
  }

  /**
   * Gets localized error message based on error code
   * @param error - Error object from API
   * @param translations - Translation strings
   * @returns Localized error message
   */
  static getErrorMessage(
    error: any,
    translations: {
      notificationError: string
      wrongCurrentPassword: string
      passwordAlreadyUsed: string
    },
  ): string {
    const errorCode = error?.response?.data?.errorCode

    if (errorCode === BackEndErrors.INVALID_LOGIN_CREDENTIALS) {
      return translations.wrongCurrentPassword
    } else if (errorCode === BackEndErrors.ALREADY_USED_PASSWORD) {
      return translations.passwordAlreadyUsed
    }

    return translations.notificationError
  }

  /**
   * Displays success notification
   * @param message - Success message to display
   */
  static displaySuccessNotification(message: string): void {
    PNotification({
      message,
      iconName: 'check',
      showClose: true,
      customClass: 'success',
      position: 'bottom-right',
    })
  }

  /**
   * Displays error notification
   * @param message - Error message to display
   */
  static displayErrorNotification(message: string): void {
    PNotification({
      message,
      iconName: 'exclamationTriangle',
      showClose: true,
      customClass: 'error',
      position: 'bottom-right',
    })
  }

  /**
   * Logs password update error
   * @param error - Error to log
   */
  static logPasswordUpdateError(error: any): void {
    logger.error('Error updating password:', error)
  }

  /**
   * Checks if error is an invalid credentials error
   * @param error - Error object from API
   * @returns True if error is BackEndErrors.INVALID_LOGIN_CREDENTIALS
   */
  static isInvalidCredentialsError(error: any): boolean {
    return error?.response?.data?.errorCode === BackEndErrors.INVALID_LOGIN_CREDENTIALS
  }

  /**
   * Checks if error is a password already used error
   * @param error - Error object from API
   * @returns True if error is BackEndErrors.ALREADY_USED_PASSWORD
   */
  static isPasswordAlreadyUsedError(error: any): boolean {
    return error?.response?.data?.errorCode === BackEndErrors.ALREADY_USED_PASSWORD
  }

  /**
   * Creates a validator for the current password field with server error support
   * @param translations - Localized error messages
   * @param getServerError - Function that returns current server error message
   * @param isRequired - Whether the field is required (default: true)
   * @returns Validator function compatible with Element Plus pRules
   */
  static createCurrentPasswordValidator(
    translations: PasswordValidationTranslations,
    getServerError: () => string | null,
    isRequired: boolean = true,
  ) {
    return (_rule: unknown, value: any, callback: ValidationCallback) => {
      // Check for server-side error first
      const serverError = getServerError()
      if (serverError) {
        callback(new Error(serverError))
        return
      }

      // Then apply standard validation
      if (isRequired && (value === '' || value === null || value === undefined)) {
        callback(new Error(translations.currentPasswordRequired))
      } else {
        callback()
      }
    }
  }
}
