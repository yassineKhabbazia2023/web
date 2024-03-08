import { describe, it, vi, expect } from 'vitest'
import { fetchAccount, patchAccount } from '.'
import { getMockedAccount } from './accountMock'
import * as helper from '@/helper/helper'

const accountId = 5
const accountIdRejected = 8

const mockedAccount = getMockedAccount()

vi.mock('@kpmg/common', () => {
  return {
    commonApi: () => ({
      account: {
        get: vi.fn().mockImplementation((url) => {
          return url === `accounts/${accountId}`
            ? Promise.resolve({ data: mockedAccount })
            : Promise.reject(new Error('rejected'))
        }),
        patch: vi.fn().mockImplementation((url) => {
          return url === `accounts/${accountId}`
            ? Promise.resolve({ data: mockedAccount })
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
      expect(account).toStrictEqual(mockedAccount)
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
        ...mockedAccount,
        accountId
      }
      const updatedAccount = await patchAccount(accountId, account)
      expect(updatedAccount).toMatchObject(mockedAccount)
    })

    it('should call handleRequestError when an error accors', async () => {
      const handleRequestErrorSpy = vi.spyOn(helper, 'handleRequestError')
      const account = {
        ...mockedAccount,
        accountId: accountIdRejected
      }
      await patchAccount(accountIdRejected, account)
      const expectedMessage = 'Error while patchAccount'
      expect(handleRequestErrorSpy).toHaveBeenNthCalledWith(1, expectedMessage, expect.any(Error))
    })
  })
})
