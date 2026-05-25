import { getEmailIsValid } from '@pulse/toolbox/utils/validator'

export type LoginErrorKey =
  | ''
  | 'alertMailRequired'
  | 'alertMailInvalid'
  | 'alertPasswordRequired'
  | 'emailOrPasswordError'
  | 'technicalError'

export function getEmailErrorKey(email: string): LoginErrorKey {
  if (email === '') {
    return 'alertMailRequired'
  }
  return getEmailIsValid(email) ? '' : 'alertMailInvalid'
}

export function getPasswordErrorKey(password: string): LoginErrorKey {
  return password === '' ? 'alertPasswordRequired' : ''
}
