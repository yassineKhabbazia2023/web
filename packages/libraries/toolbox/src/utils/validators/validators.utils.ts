import { NAME_REG_EXP } from './validators.utils.const'
import { validateEmail } from './email.validator'

export function getEmailIsValid(email: string) {
  const trimmedEmail = email?.trim() ?? ''
  return validateEmail(trimmedEmail)
}

export function getNameIsValid(name: string) {
  return NAME_REG_EXP.test(name)
}

export function isNotNullNorEmpty(value: unknown) {
  return value !== undefined && value !== null && value !== ''
}
