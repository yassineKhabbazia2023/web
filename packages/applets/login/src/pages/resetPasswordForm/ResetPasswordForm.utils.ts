import { PStrengthLevel } from '@pulse/styleguide/types'
import { BackEndErrors } from '@pulse/common/constants'
import { ApiErrorData } from '@pulse/common/types'

export function getPasswordError(
  password: string,
  passwordStrengthLevel: PStrengthLevel,
  requiredErrorMessage: string,
  lowLevelErrorMessage: string,
) {
  if (password === '') {
    return requiredErrorMessage
  } else if (passwordStrengthLevel < PStrengthLevel.STRONG) {
    return lowLevelErrorMessage
  }
  return ''
}

export function getConfirmPasswordError(
  confirmPassword: string,
  password: string,
  requiredErrorMessage: string,
  notMatchingErrorMessage: string,
) {
  if (confirmPassword === '') {
    return requiredErrorMessage
  }
  if (password !== '' && password !== confirmPassword) {
    return notMatchingErrorMessage
  }
  return ''
}

export function getApiErrorMessage(
  apiErrorData: ApiErrorData,
  apiErrorMessages: Record<BackEndErrors, string>,
) {
  const { errorCode, errorMessage } = apiErrorData
  if (errorCode === BackEndErrors.ALREADY_USED_PASSWORD) {
    return apiErrorMessages[BackEndErrors.ALREADY_USED_PASSWORD]
  }
  return errorMessage || BackEndErrors.other
}
