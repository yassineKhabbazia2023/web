import { describe, it, vi, expect } from 'vitest'
import delegationsHistoryMock from './__mock__/delegationsHistory.json'
import {
  fetchAccount,
  fetchAccounts,
  patchAccount,
  fetchAccountReferential,
  fetchReferentialHubs,
  fetchAccountDelegationsHistory,
  deleteAccountDelegation,
  addContactToEntity,
  fetchContactsFromSameHub,
  createCustomer,
} from '.'
import {
  getMockedAccount,
  getMockedAccountRow,
  getMockedPatchOperations,
  getMockedAccountReferential,
  getMockedReferentialHubs,
} from './accountMock'
import { getMockedCollaborators } from '@/services/contact/contactMocks'
import { API_PREFIXES } from '@/common/config/services'

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
const mockedCollaborators = getMockedCollaborators()
const deleteDelegationSpy = vi.fn()
const postSpy = vi.fn()

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
          if (url === `account/api/delegations/${accountId}/history?`) {
            return Promise.resolve({ data: delegationsHistoryMock })
          }
          if (url === 'account/api/roles/currentuser/hub/contact') {
            return Promise.resolve({
              data: {
                items: mockedCollaborators,
              },
            })
          }

          return url.includes(SEARCH_CURRENT_USER)
            ? Promise.resolve({ data: [mockedAccountRow] })
            : Promise.reject(new Error(rejectedErrorMessage))
        }),
        patch: mockedAccountApiPatch,
        delete: deleteDelegationSpy,
        post: postSpy,
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

  describe('delegations', () => {
    it('fetch the historical of all delegations for an account', async () => {
      const delegationsHistoryFetched = await fetchAccountDelegationsHistory(accountId, new URLSearchParams())
      expect(delegationsHistoryFetched).toMatchObject(delegationsHistoryMock)
    })

    it('delete a delegation', () => {
      expect(deleteDelegationSpy).not.toHaveBeenCalled()

      deleteAccountDelegation(accountId)

      expect(deleteDelegationSpy).toHaveBeenCalledTimes(1)
      expect(deleteDelegationSpy).toHaveBeenCalledWith(
        'account/api/delegations',
        {
          params: {
            delegationId: accountId,
          },
        },
      )
    })
  })

  describe('roles', () => {
    it('should post addContactToEntity', async () => {
      await addContactToEntity(1, 1000)
      expect(postSpy).toHaveBeenCalledWith(
        'account/api/roles',
        {
          accountId: 1,
          contactId: 1000,
          isSignatory: false,
          isFavorite: false,
          isDelegation: false,
        },
      )
    })

    it('should fetch contacts from same hub', async () => {
      const result = await fetchContactsFromSameHub('searchValue', 100)
      expect(result).toStrictEqual(mockedCollaborators)
    })

    it('should add customer to entity', async () => {
      const newId = 123
      postSpy.mockResolvedValue({ data: newId })
      const postRequestBody = {
        firstName: mockedCollaborators[0].firstName,
        lastName: mockedCollaborators[0].lastName,
        email: mockedCollaborators[0].email,
        mobilePhone: mockedCollaborators[0].mobilePhone,
        accountNumber: String(mockedAccount.accountId),
      }
      const id = await createCustomer(postRequestBody)
      expect(postSpy).toHaveBeenCalledWith(`${API_PREFIXES.ACCOUNT}/customers`, postRequestBody)
      expect(id).toBe(newId)
    })
  })
})
