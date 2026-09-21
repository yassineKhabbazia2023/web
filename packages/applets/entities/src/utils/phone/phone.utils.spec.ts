import { cleanNullPhoneNumber } from './phone.utils'
import type { Account } from '@entities/services/account'

const createAccount = (phoneNumber?: string | null): Account => ({
  accountId: 1,
  accountNumber: '123456',
  phone: [{
    phoneId: 1,
    phoneNumber: phoneNumber as string | undefined,
  }],
})

describe('phone utils', () => {
  describe('cleanNullPhoneNumber', () => {
    it.each([
      { phoneNumber: null, expectedPhoneNumber: '' },
      { phoneNumber: 'null', expectedPhoneNumber: '' },
      { phoneNumber: ' Null ', expectedPhoneNumber: '' },
      { phoneNumber: '+33 Null', expectedPhoneNumber: '' },
    ])('should clean $phoneNumber phone number', ({ phoneNumber, expectedPhoneNumber }) => {
      const account = createAccount(phoneNumber)

      cleanNullPhoneNumber(account)

      expect(account.phone?.[0]?.phoneNumber).toBe(expectedPhoneNumber)
    })

    it('should keep undefined phone number unchanged', () => {
      const account = createAccount(undefined)

      cleanNullPhoneNumber(account)

      expect(account.phone?.[0]?.phoneNumber).toBeUndefined()
    })

    it('should keep a valid phone number unchanged', () => {
      const account = createAccount('0612345678')

      cleanNullPhoneNumber(account)

      expect(account.phone?.[0]?.phoneNumber).toBe('0612345678')
    })

    it('should not create a phone entry when account has no phone number', () => {
      const account: Account = {
        accountId: 1,
        accountNumber: '123456',
      }

      cleanNullPhoneNumber(account)

      expect(account.phone).toBeUndefined()
    })

    it('should not create a phone entry when phone list is empty', () => {
      const account: Account = {
        accountId: 1,
        accountNumber: '123456',
        phone: [],
      }

      cleanNullPhoneNumber(account)

      expect(account.phone).toStrictEqual([])
    })
  })
})
