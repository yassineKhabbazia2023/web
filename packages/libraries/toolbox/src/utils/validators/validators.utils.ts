import { EMAIL_REG_EXP, NAME_REG_EXP } from './validators.utils.const'

export function getEmailIsValid(email: string) {
  return EMAIL_REG_EXP.test(email)
}

export function getNameIsValid(name: string) {
  return NAME_REG_EXP.test(name)
}

export function isNotNullNorEmpty(value: unknown) {
  return value !== undefined && value !== null && value !== ''
}
