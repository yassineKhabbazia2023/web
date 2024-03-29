import { describe, it, vi, expect } from 'vitest'
import {
  fetchAccount,
  fetchAccounts,
  patchAccount,
  fetchAccountReferential,
  fetchReferentialHubs,
} from '.'
import {
  getMockedAccount,
  getMockedAccountRow,
  getMockedPatchOperations,
  getMockedAccountReferential,
  getMockedReferentialHubs,
} from './accountMock'
import * as helper from '@/helper/helper'

const accountId = 5
const accountIdRejected = 8
const SEARCH_CURRENT_USER = 'currentuser'
const SEARCH_THROWS_ERROR = 'throw-error'
const rejectedErrorMessage = 'rejected'

const mockedAccount = getMockedAccount()
const mockedAccountReferential = getMockedAccountReferential()
const mockedReferentialHubs = getMockedReferentialHubs()
const mockedAccountRow = getMockedAccountRow()
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
        get: vi.fn().mockImplementation((url) => {
          if (url === 'offer/api/referentials/AccountReferentialInformation') {
            return Promise.resolve({
              data: mockedAccountReferential,
            })
          }
          if (url === 'offer/api/referentials/hubs') {
            return Promise.resolve({
              data: mockedReferentialHubs,
            })
          }

          return url.includes(SEARCH_CURRENT_USER)
            ? Promise.resolve({ data: [mockedAccountRow] })
            : Promise.reject(new Error(rejectedErrorMessage))
        }),
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
      const searchParams = SEARCH_CURRENT_USER
      const queryResult = await fetchAccounts(searchParams)
      const expectedAccounts = [mockedAccountRow]
      expect(queryResult).toMatchObject(expectedAccounts)
    })

    it('should throw an error when api throws an error', async () => {
      const searchParams = SEARCH_THROWS_ERROR
      const expectedErrorMessage = rejectedErrorMessage

      await expect(async () => await fetchAccounts(searchParams))
        .rejects.toThrow(expectedErrorMessage)
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

  describe('fetchAccountReferential', () => {
    it('should return proper object', async () => {
      const accountReferential = await fetchAccountReferential()

      expect(accountReferential).toMatchObject(mockedAccountReferential)
    })
  })

  describe('fetchReferentialHubs', () => {
    it('should return proper object', async () => {
      const referentialHubs = await fetchReferentialHubs()

      expect(referentialHubs).toMatchObject(mockedReferentialHubs)
    })
  })
})
