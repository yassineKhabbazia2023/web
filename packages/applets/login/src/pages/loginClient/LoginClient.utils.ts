import { getEmailIsValid } from '@pulse/core/utils/validator'

export function getEmailError(
  email: string,
  requiredErrorMessage: string,
  invalidErrorMessage: string,
) {
  if (email === '') {
    return requiredErrorMessage
  }
  const isValid = getEmailIsValid(email)
  return isValid ? '' : invalidErrorMessage
}

export function getPasswordError(
  password: string,
  requiredErrorMessage: string,
) {
  return password === '' ? requiredErrorMessage : ''
}
