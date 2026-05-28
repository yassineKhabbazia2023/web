import type { PStrengthLevel } from '@pulse/styleguide/types'

export interface PasswordFieldsProps {
  // Mode control
  requireCurrentPassword?: boolean
  isPasswordStrengthGaugeVisible?: boolean
  // Disable all fields
  disabled?: boolean
}

export interface PasswordFieldsExposed {
  reset: () => void
  getPasswordStrength: () => PStrengthLevel
}

/**
 * Translation keys required for password validation error messages
 */
export interface PasswordValidationTranslations {
  currentPasswordRequired: string
  newPasswordRequired: string
  newPasswordWeak: string
  confirmPasswordRequired: string
  confirmPasswordMismatch: string
}
