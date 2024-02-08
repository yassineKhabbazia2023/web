import { describe, it, vi, expect } from 'vitest'
import { fetchAccount, patchAccount } from '.'
import accountMock from './accountMock.json'
import * as helper from '@/helper/helper'

const accountId = 'my-account-id'
const accountIdRejected = 'rejected'

vi.mock('@kpmg/common', () => {
  return {
    commonApi: () => ({
      account: {
        get: vi.fn().mockImplementation((url) => {
          return url === `accounts/${accountId}`
            ? Promise.resolve({ data: accountMock })
            : Promise.reject(new Error('rejected'))
        }),
        patch: vi.fn().mockImplementation((url) => {
          return url === `accounts/${accountId}`
            ? Promise.resolve({ data: accountMock })
            : Promise.reject(new Error('rejected'))
        })
      }
    })
  }
})

describe('test accountServices', () => {
  describe('fetchAccount', () => {
    it('should return account on success', async () => {
      const account = await fetchAccount(accountId)
      expect(account).toStrictEqual(accountMock)
    })

    it('should call handleRequestError when an error accors', async () => {
      const handleRequestErrorSpy = vi.spyOn(helper, 'handleRequestError')
      await fetchAccount(accountIdRejected)
      const expectedMessage = 'Error while fetchAccount'
      expect(handleRequestErrorSpy).toHaveBeenNthCalledWith(1, expectedMessage, expect.any(Error))
    })
  })
  describe('patchAccount', () => {
    it('should return updated account on success', async () => {
      const account = {
        ...accountMock,
        accountId
      }
      const updatedAccount = await patchAccount(account)
      expect(updatedAccount).toMatchObject(accountMock)
    })

    it('should call handleRequestError when an error accors', async () => {
      const handleRequestErrorSpy = vi.spyOn(helper, 'handleRequestError')
      const account = {
        ...accountMock,
        accountId: accountIdRejected
      }
      await patchAccount(account)
      const expectedMessage = 'Error while patchAccount'
      expect(handleRequestErrorSpy).toHaveBeenNthCalledWith(1, expectedMessage, expect.any(Error))
    })
  })
})
