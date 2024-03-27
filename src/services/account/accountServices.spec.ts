import { describe, it, vi, expect } from 'vitest'
import { fetchAccount, fetchAccounts, patchAccount } from '.'
import { getMockedAccount, getMockedPatchOperations } from './accountMock'
import * as helper from '@/helper/helper'

const accountId = 5
const accountIdRejected = 8

const mockedAccount = getMockedAccount()
const mockedPatchOperations = getMockedPatchOperations()
const mockedAccountApiPatch = vi.fn()

vi.mock('@kpmg/common', () => {
  return {
    commonApi: () => ({
      account: {
        get: vi.fn().mockImplementation((url) => {
          return url === `accounts/${accountId}`
            ? Promise.resolve({ data: mockedAccount })
            : Promise.reject(new Error('rejected'))
        }),
        patch: mockedAccountApiPatch,
      },
      gateway: {
        get: vi.fn().mockResolvedValue({ data: [mockedAccount] }),
      },
    }),
  }
})

describe('test accountServices', () => {
  describe('fetchAccount', () => {
    it('should return account on success', async () => {
      const account = await fetchAccount(accountId)
      expect(account).toStrictEqual(mockedAccount)
    })

    it('should call handleRequestError when an error occurs', async () => {
      const handleRequestErrorSpy = vi.spyOn(helper, 'handleRequestError')
      await fetchAccount(accountIdRejected)
      const expectedMessage = 'Error while fetchAccount'
      expect(handleRequestErrorSpy).toHaveBeenCalledOnce()
      expect(handleRequestErrorSpy).toHaveBeenNthCalledWith(1, expectedMessage, expect.any(Error))
    })
  })

  describe('fetchAccounts', () => {
    it('should return proper accounts', async () => {
      const searchParams = 'contactId=1'
      const accounts = await fetchAccounts(searchParams)
      const expectedAccounts = [mockedAccount]
      expect(accounts).toMatchObject(expectedAccounts)
    })
  })

  describe('patchAccount', () => {
    it('should return updated account on success', async () => {
      await patchAccount(accountId, mockedPatchOperations)
      expect(mockedAccountApiPatch).toHaveBeenCalledOnce()
      expect(mockedAccountApiPatch).toHaveBeenNthCalledWith(1, `accounts/${accountId}`, mockedPatchOperations)
    })

    it('should call handleRequestError when an error occurs', async () => {
      mockedAccountApiPatch.mockRejectedValueOnce(new Error('rejected'))
      const handleRequestErrorSpy = vi.spyOn(helper, 'handleRequestError')
      await patchAccount(accountIdRejected, mockedPatchOperations)
      const expectedMessage = 'Error while patchAccount'
      expect(handleRequestErrorSpy).toHaveBeenCalledOnce()
      expect(handleRequestErrorSpy).toHaveBeenNthCalledWith(1, expectedMessage, expect.any(Error))
    })
  })
})
