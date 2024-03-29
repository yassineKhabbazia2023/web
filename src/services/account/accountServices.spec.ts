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
          if (url === `account/api/accounts/${accountId}`) {
            return Promise.resolve({
              data: mockedAccount,
            })
          }

          return url.includes(SEARCH_CURRENT_USER)
            ? Promise.resolve({ data: [mockedAccountRow] })
            : Promise.reject(new Error(rejectedErrorMessage))
        }),
        patch: mockedAccountApiPatch,
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

    it('should throw an error when an error occurs', async () => {
      const expectedMessage = rejectedErrorMessage
      await expect(async () => await fetchAccount(accountIdRejected))
        .rejects.toThrow(expectedMessage)
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
      const expectedUrl = `account/api/accounts/${accountId}`
      expect(mockedAccountApiPatch).toHaveBeenCalledOnce()
      expect(mockedAccountApiPatch).toHaveBeenNthCalledWith(1, expectedUrl, mockedPatchOperations)
    })

    it('should throw an error when an error occurs', async () => {
      const errorMessage = 'Error while patchAccount'
      mockedAccountApiPatch.mockRejectedValueOnce(new Error(errorMessage))

      await expect(async () => await patchAccount(accountIdRejected, mockedPatchOperations))
        .rejects.toThrow(errorMessage)
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
