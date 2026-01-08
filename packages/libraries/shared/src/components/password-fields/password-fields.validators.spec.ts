import {
  createNewPasswordValidator,
  createConfirmPasswordValidator,
} from './password-fields.validators'
import type { PasswordValidationTranslations } from './password-fields.types'

const mockTranslations: PasswordValidationTranslations = {
  currentPasswordRequired: 'Current password is required',
  newPasswordRequired: 'New password is required',
  newPasswordWeak: 'Password is too weak',
  confirmPasswordRequired: 'Confirm password is required',
  confirmPasswordMismatch: 'Passwords do not match',
}

describe('password-fields.validators', () => {
  describe('createNewPasswordValidator', () => {
    it('should call callback with error when value is empty', () => {
      const validator = createNewPasswordValidator(mockTranslations)
      const callback = vi.fn()

      validator(null, '', callback)

      expect(callback).toHaveBeenCalledExactlyOnceWith(new Error(mockTranslations.newPasswordRequired))
    })

    it('should call callback with error when password strength is not STRONG', () => {
      const validator = createNewPasswordValidator(mockTranslations)
      const callback = vi.fn()

      validator(null, 'weakpass', callback)

      expect(callback).toHaveBeenCalledExactlyOnceWith(new Error(mockTranslations.newPasswordWeak))
    })

    it('should call callback without error when password strength is STRONG', () => {
      const validator = createNewPasswordValidator(mockTranslations)
      const callback = vi.fn()

      validator(null, 'Test123!@#', callback)

      expect(callback).toHaveBeenCalledExactlyOnceWith()
    })
  })

  describe('createConfirmPasswordValidator', () => {
    it('should call callback with error when value is empty', () => {
      const getNewPassword = vi.fn().mockReturnValue('Test123!@#')
      const validator = createConfirmPasswordValidator(mockTranslations, getNewPassword)
      const callback = vi.fn()

      validator(null, '', callback)

      expect(callback).toHaveBeenCalledExactlyOnceWith(new Error(mockTranslations.confirmPasswordRequired))
    })

    it('should call callback with error when confirm password does not match new password', () => {
      const getNewPassword = vi.fn().mockReturnValue('Test123!@#')
      const validator = createConfirmPasswordValidator(mockTranslations, getNewPassword)
      const callback = vi.fn()

      validator(null, 'DifferentPass123!', callback)

      expect(callback).toHaveBeenCalledExactlyOnceWith(new Error(mockTranslations.confirmPasswordMismatch))
      expect(getNewPassword).toHaveBeenCalledOnce()
    })

    it('should call callback without error when confirm password matches new password', () => {
      const getNewPassword = vi.fn().mockReturnValue('Test123!@#')
      const validator = createConfirmPasswordValidator(mockTranslations, getNewPassword)
      const callback = vi.fn()

      validator(null, 'Test123!@#', callback)

      expect(callback).toHaveBeenCalledExactlyOnceWith()
      expect(getNewPassword).toHaveBeenCalledOnce()
    })
  })
})
