import { PStrengthLevel } from '@pulse/styleguide/types'
import { UpdatePasswordManager } from './update-password.manager'
import { SKIP_CALLBACK_CODES, BackEndErrors } from '@pulse/common/constants'

// The authentication service is spy-wrapped project-wide (doctrine: shared-hubs):
// tests arm updatePassword via the shared spy instead of a local factory.
const PNotification = vi.mocked((await import('@pulse/styleguide')).PNotification)
const logger = vi.mocked((await import('@pulse/toolbox')).logger)
const updatePassword = vi.mocked((await import('@pulse/common/services/authentication')).updatePassword)

describe('UpdatePasswordManager', () => {
  describe('validatePasswordForm', () => {
    it('should return true when all fields are valid and password is STRONG', () => {
      const result = UpdatePasswordManager.validatePasswordForm(
        'current-pass',
        'new-pass',
        'new-pass',
        PStrengthLevel.STRONG,
      )

      expect(result).toBe(true)
    })

    it('should return false when currentPassword is empty', () => {
      const result = UpdatePasswordManager.validatePasswordForm(
        '',
        'new-pass',
        'new-pass',
        PStrengthLevel.STRONG,
      )

      expect(result).toBe(false)
    })

    it('should return false when newPassword is empty', () => {
      const result = UpdatePasswordManager.validatePasswordForm(
        'current-pass',
        '',
        'new-pass',
        PStrengthLevel.STRONG,
      )

      expect(result).toBe(false)
    })

    it('should return false when confirmPassword is empty', () => {
      const result = UpdatePasswordManager.validatePasswordForm(
        'current-pass',
        'new-pass',
        '',
        PStrengthLevel.STRONG,
      )

      expect(result).toBe(false)
    })

    it('should return false when passwords do not match', () => {
      const result = UpdatePasswordManager.validatePasswordForm(
        'current-pass',
        'new-pass',
        'different-pass',
        PStrengthLevel.STRONG,
      )

      expect(result).toBe(false)
    })

    it('should return false when password strength is not STRONG', () => {
      const result = UpdatePasswordManager.validatePasswordForm(
        'current-pass',
        'new-pass',
        'new-pass',
        PStrengthLevel.MEDIUM,
      )

      expect(result).toBe(false)
    })
  })

  describe('updateUserPassword', () => {
    it('should call updatePassword with correct arguments and log success', async () => {
      const payload = { oldPassword: 'old', newPassword: 'new' }
      const contactId = 12345

      updatePassword.mockResolvedValue({
        data: {},
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      })

      await UpdatePasswordManager.updateUserPassword(payload, contactId)

      expect(updatePassword).toHaveBeenCalledExactlyOnceWith(payload, contactId)
      expect(logger.info).toHaveBeenCalledExactlyOnceWith('Password updated successfully')
    })
  })

  describe('getErrorMessage', () => {
    const translations = {
      notificationError: 'Generic error',
      wrongCurrentPassword: 'Wrong password',
      passwordAlreadyUsed: 'Already used',
    }

    it('should return wrongCurrentPassword message for BackEndErrors.INVALID_LOGIN_CREDENTIALS error', () => {
      const error = {
        response: {
          data: {
            errorCode: BackEndErrors.INVALID_LOGIN_CREDENTIALS,
          },
        },
      }

      const result = UpdatePasswordManager.getErrorMessage(error, translations)

      expect(result).toBe(translations.wrongCurrentPassword)
    })

    it('should return passwordAlreadyUsed message for BackEndErrors.ALREADY_USED_PASSWORD error', () => {
      const error = {
        response: {
          data: {
            errorCode: BackEndErrors.ALREADY_USED_PASSWORD,
          },
        },
      }

      const result = UpdatePasswordManager.getErrorMessage(error, translations)

      expect(result).toBe(translations.passwordAlreadyUsed)
    })

    it('should return generic error message for unknown error code', () => {
      const error = {
        response: {
          data: {
            errorCode: 'UNKNOWN_ERROR',
          },
        },
      }

      const result = UpdatePasswordManager.getErrorMessage(error, translations)

      expect(result).toBe(translations.notificationError)
    })

    it('should return generic error message when error has no errorCode', () => {
      const error = {
        response: {
          data: {},
        },
      }

      const result = UpdatePasswordManager.getErrorMessage(error, translations)

      expect(result).toBe(translations.notificationError)
    })
  })

  describe('displaySuccessNotification', () => {
    it('should call PNotification with correct success configuration', () => {
      const message = 'Success message'

      UpdatePasswordManager.displaySuccessNotification(message)

      expect(PNotification).toHaveBeenCalledExactlyOnceWith({
        message,
        iconName: 'check',
        showClose: true,
        customClass: 'success',
        position: 'bottom-right',
      })
    })
  })

  describe('displayErrorNotification', () => {
    it('should call PNotification with correct error configuration', () => {
      const message = 'Error message'

      UpdatePasswordManager.displayErrorNotification(message)

      expect(PNotification).toHaveBeenCalledExactlyOnceWith({
        message,
        iconName: 'exclamationTriangle',
        showClose: true,
        customClass: 'error',
        position: 'bottom-right',
      })
    })
  })

  describe('logPasswordUpdateError', () => {
    it('should call logger.error with correct message', () => {
      const error = new Error('Test error')

      UpdatePasswordManager.logPasswordUpdateError(error)

      expect(logger.error).toHaveBeenCalledExactlyOnceWith('Error updating password:', error)
    })
  })

  describe('isInvalidCredentialsError', () => {
    it('should return true when error code is BackEndErrors.INVALID_LOGIN_CREDENTIALS', () => {
      const error = {
        response: {
          data: {
            errorCode: SKIP_CALLBACK_CODES[0],
          },
        },
      }

      const result = UpdatePasswordManager.isInvalidCredentialsError(error)

      expect(result).toBe(true)
    })

    it('should return false when error code is not BackEndErrors.INVALID_LOGIN_CREDENTIALS', () => {
      const error = {
        response: {
          data: {
            errorCode: 'OTHER_ERROR',
          },
        },
      }

      const result = UpdatePasswordManager.isInvalidCredentialsError(error)

      expect(result).toBe(false)
    })

    it('should return false when error has no errorCode', () => {
      const error = {
        response: {
          data: {},
        },
      }

      const result = UpdatePasswordManager.isInvalidCredentialsError(error)

      expect(result).toBe(false)
    })
  })

  describe('isPasswordAlreadyUsedError', () => {
    it('should return true when error code is BackEndErrors.ALREADY_USED_PASSWORD', () => {
      const error = {
        response: {
          data: {
            errorCode: BackEndErrors.ALREADY_USED_PASSWORD,
          },
        },
      }

      const result = UpdatePasswordManager.isPasswordAlreadyUsedError(error)

      expect(result).toBe(true)
    })

    it('should return false when error code is not BackEndErrors.ALREADY_USED_PASSWORD', () => {
      const error = {
        response: {
          data: {
            errorCode: 'OTHER_ERROR',
          },
        },
      }

      const result = UpdatePasswordManager.isPasswordAlreadyUsedError(error)

      expect(result).toBe(false)
    })

    it('should return false when error has no errorCode', () => {
      const error = {
        response: {
          data: {},
        },
      }

      const result = UpdatePasswordManager.isPasswordAlreadyUsedError(error)

      expect(result).toBe(false)
    })
  })

  describe('createCurrentPasswordValidator', () => {
    const translations = {
      currentPasswordRequired: 'Current password required',
      newPasswordRequired: 'New password required',
      newPasswordWeak: 'Password weak',
      confirmPasswordRequired: 'Confirm password required',
      confirmPasswordMismatch: 'Passwords mismatch',
    }

    it('should call callback with server error when server error exists', () => {
      const getServerError = vi.fn().mockReturnValue('Server error')
      const validator = UpdatePasswordManager.createCurrentPasswordValidator(
        translations,
        getServerError,
        true,
      )
      const callback = vi.fn()

      validator(null, 'some-value', callback)

      expect(getServerError).toHaveBeenCalledOnce()
      expect(callback).toHaveBeenCalledExactlyOnceWith(new Error('Server error'))
    })

    it('should call callback with required error when value is empty and isRequired is true', () => {
      const getServerError = vi.fn().mockReturnValue(null)
      const validator = UpdatePasswordManager.createCurrentPasswordValidator(
        translations,
        getServerError,
        true,
      )
      const callback = vi.fn()

      validator(null, '', callback)

      expect(getServerError).toHaveBeenCalledOnce()
      expect(callback).toHaveBeenCalledExactlyOnceWith(new Error(translations.currentPasswordRequired))
    })

    it('should call callback without error when value is provided and no server error', () => {
      const getServerError = vi.fn().mockReturnValue(null)
      const validator = UpdatePasswordManager.createCurrentPasswordValidator(
        translations,
        getServerError,
        true,
      )
      const callback = vi.fn()

      validator(null, 'some-password', callback)

      expect(getServerError).toHaveBeenCalledOnce()
      expect(callback).toHaveBeenCalledExactlyOnceWith()
    })

    it('should call callback without error when value is empty and isRequired is false', () => {
      const getServerError = vi.fn().mockReturnValue(null)
      const validator = UpdatePasswordManager.createCurrentPasswordValidator(
        translations,
        getServerError,
        false,
      )
      const callback = vi.fn()

      validator(null, '', callback)

      expect(getServerError).toHaveBeenCalledOnce()
      expect(callback).toHaveBeenCalledExactlyOnceWith()
    })

    it('should default isRequired to true', () => {
      const getServerError = vi.fn().mockReturnValue(null)
      const validator = UpdatePasswordManager.createCurrentPasswordValidator(
        translations,
        getServerError,
      )
      const callback = vi.fn()

      validator(null, '', callback)

      expect(callback).toHaveBeenCalledWith(
        new Error(translations.currentPasswordRequired),
      )
    })
  })
})
