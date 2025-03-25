import { EMAIL_REG_EXP } from './validators.utils.const'

export function getEmailIsValid(email: string) {
  return EMAIL_REG_EXP.test(email)
}
