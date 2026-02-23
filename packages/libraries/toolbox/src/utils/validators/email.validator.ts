import { EMAIL_REG_EXP } from './validators.utils.const'

export const validateEmail = (email: string) => {
  if (!email) {
    return false
  }

  const emailParts = email.split('@')
  if (emailParts.length !== 2) {
    return false
  }

  const account = emailParts[0]
  const address = emailParts[1]

  if (account.length > 64) {
    return false
  }
  if (address.length > 255) {
    return false
  }

  const domainParts = address.split('.')
  if (domainParts.some((part) => part.length > 63)) {
    return false
  }

  return EMAIL_REG_EXP.test(email)
}
