import type { Account } from '@entities/services/account'

export function cleanNullPhoneNumber(account: Account): void {
  const primaryPhone = account.phone?.[0]

  if (primaryPhone === undefined) {
    return
  }

  const phoneNumber = primaryPhone.phoneNumber as string | null | undefined
  const containsNullText = typeof phoneNumber === 'string' && phoneNumber.toLowerCase().includes('null')

  if (phoneNumber === null || containsNullText === true) {
    primaryPhone.phoneNumber = ''
  }
}
