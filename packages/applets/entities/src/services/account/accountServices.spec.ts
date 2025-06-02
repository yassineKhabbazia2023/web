import { describe, it, vi, expect } from 'vitest'
import delegationsHistoryMock from '@entities/__mocks__/json/delegationsHistory.json'
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
  getAccountUserByEmail,
  updateSignatoryStatus,
  getAccountSignatories,
  fetchGatewayApi,
  fetchReferentialOffices,
  type Hub,
  deleteContactFromAccount,
  hasContactRoleOnCommonAccount,
  updateCustomerRelation,
} from '.'
import {
  getMockedAccount,
  getMockedAccountRow,
  getMockedPatchOperations,
  getMockedAccountReferential,
  getMockedReferentialHubs,
  getMockedReferentialOffices,
} from '@entities/__mocks__/account-row.mocks'
import { getMockedCollaborators } from '@entities/__mocks__/collaborators.mocks'
import { API_PREFIXES } from '@entities/common/config/services'

const accountId = 5
const contactId = 25
const accountIdRejected = 8
const isCustomerRelation = true
const SEARCH_CURRENT_USER = 'currentuser'
const SEARCH_THROWS_ERROR = 'throw-error'
const rejectedErrorMessage = 'rejected'

const mockedAccount = getMockedAccount()
const mockedAccountReferential = getMockedAccountReferential()
const mockedReferentialHubs = getMockedReferentialHubs()
const mockedReferentialOffices = getMockedReferentialOffices()
const mockedAccountRow = getMockedAccountRow()
const mockedPatchOperations = getMockedPatchOperations()
const mockedAccountApiPatch = vi.fn()
const mockedCollaborators = getMockedCollaborators()
const postSpy = vi.fn()

vi.mock('@pulse/common', () => {
  return {
    commonApi: () => ({
      gateway: {
        get: vi.fn().mockImplementation((url, args) => {
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
          if (url === `${API_PREFIXES.OFFER}/referentials/offices`) {
            return Promise.resolve({
              data: mockedReferentialOffices,
            })
          }
          if (url === `account/api/accounts/${accountId}/currentuser`) {
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
          if (url === `${API_PREFIXES.ACCOUNT}/contacts`) {
            return Promise.resolve({
              status: args.params.email ? 200 : 204,
              data: {
                items: mockedCollaborators,
              },
            })
          }
          if (url === `${API_PREFIXES.ACCOUNT}/roles/signatory` && args.params.accountId) {
            return Promise.resolve({
              data: mockedCollaborators,
            })
          }
          if (url === `${API_PREFIXES.ACCOUNT}/roles/check`) {
            return Promise.resolve({
              data: true,
            })
          }

          return url.includes(SEARCH_CURRENT_USER)
            ? Promise.resolve({ data: [mockedAccountRow] })
            : Promise.reject(new Error(rejectedErrorMessage))
        }),
        patch: mockedAccountApiPatch,
        delete: vi.fn().mockImplementation((url) => {
          if (url === `${API_PREFIXES.ACCOUNT}/roles`) {
            return {
              status: 200,
              data: {
                accountId,
                contactId,
              },
            }
          }
          if (url === `${API_PREFIXES.ACCOUNT}/delegations`) {
            return {
              status: 200,
              data: {
                accountId,
              },
            }
          }
        }),
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
      const expectedUrl = `account/api/accounts/${accountId}/currentuser`
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

  describe('fetchReferentialOffices', () => {
    it('should return proper object', async () => {
      const referentialOffices = await fetchReferentialOffices()

      expect(referentialOffices).toMatchObject(mockedReferentialOffices)
    })
  })
  describe('fetchGatewayApi', () => {
    it('should send the request to the correct endpoint and return the expected response', async () => {
      const url = `${API_PREFIXES.OFFER}/referentials/hubs`
      const referentialHubs = await fetchGatewayApi<Hub[]>(url)

      expect(referentialHubs).toMatchObject(mockedReferentialHubs)
    })
  })

  describe('deleteContactFromAccount', () => {
    it('should delete the contact from the account and ensure it is no longer listed', async () => {
      const response = await deleteContactFromAccount(accountId, contactId)

      expect(response).toStrictEqual({ status: 200, data: { accountId, contactId } })
    })
  })

  describe('updateCustomerRelation', () => {
    it('sends a PATCH request to the correct endpoint with the expected parameters', async () => {
      await updateCustomerRelation(accountId, contactId, isCustomerRelation)
      const expectedUrl = `${API_PREFIXES.ACCOUNT}/roles/customer-relation`

      expect(mockedAccountApiPatch).toHaveBeenCalledOnce()
      expect(mockedAccountApiPatch).toHaveBeenNthCalledWith(1, expectedUrl, null, {
        params: { accountId, contactId, isCustomerRelation },
      })
    })
  })

  describe('delegations', () => {
    it('fetch the historical of all delegations for an account', async () => {
      const delegationsHistoryFetched = await fetchAccountDelegationsHistory(accountId, new URLSearchParams())
      expect(delegationsHistoryFetched).toMatchObject(delegationsHistoryMock)
    })

    it('delete a delegation', async () => {
      const response = await deleteAccountDelegation(accountId)

      expect(response).toStrictEqual({ status: 200, data: { accountId } })
    })
  })

  describe('roles', () => {
    it('should post addContactToEntity', async () => {
      await addContactToEntity(1, 'test@example.fr')
      expect(postSpy).toHaveBeenCalledWith(
        'account/api/roles',
        {
          email: 'test@example.fr',
          isSignatory: false,
          isFavorite: false,
          isDelegation: false,
        },
        {
          headers: {
            'Account-Id': 1,
          },
          params: {
            accountId: 1,
          },
        },
      )
    })

    it('should fetch contacts from same hub', async () => {
      const result = await fetchContactsFromSameHub('searchValue')

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
        accountNumber: mockedAccount.accountNumber,
      }
      const id = await createCustomer(postRequestBody, mockedAccount.accountId)
      expect(postSpy).toHaveBeenCalledWith(`${API_PREFIXES.ACCOUNT}/customers`,
        postRequestBody,
        { params: { accountId: mockedAccount.accountId } },
      )
      expect(id).toBe(newId)
    })

    it.each([
      {
        isSignatory: true,
      },
      {
        isSignatory: false,
      },
    ])('should patch user', async ({ isSignatory }) => {
      const accountId = mockedAccount.accountId
      const contactId = mockedCollaborators[0].id
      const patchParams = {
        accountId,
        contactId,
        isSignatory,
      }

      await updateSignatoryStatus(accountId, contactId, isSignatory)
      expect(mockedAccountApiPatch).toHaveBeenCalledWith(
        `${API_PREFIXES.ACCOUNT}/roles`,
        null,
        { params: patchParams },
      )
    })

    it("should update the signatory's status and reflect the change accurately", async () => {
      const accountId = mockedAccount.accountId
      const contactId = mockedCollaborators[0].id
      const patchParams = {
        accountId,
        contactId,
      }

      await updateSignatoryStatus(accountId, contactId)

      expect(mockedAccountApiPatch).toHaveBeenCalledWith(
        `${API_PREFIXES.ACCOUNT}/roles`,
        null,
        { params: { ...patchParams, isSignatory: true } },
      )
    })

    it('should get signatories contacts', async () => {
      const accountId = mockedAccount.accountId

      const accountSignatories = await getAccountSignatories(accountId)
      expect(accountSignatories).toMatchObject(mockedCollaborators)
    })

    it('should check if contact has role on account', async () => {
      const accountId = mockedAccount.accountId

      const email = 'test@test.fr'

      const hasRoleOnAccount = await hasContactRoleOnCommonAccount(email, accountId)
      expect(hasRoleOnAccount).toBeTruthy()
    })
  })

  it("get account's user by email", async () => {
    const contact = await getAccountUserByEmail(mockedCollaborators[0].email)

    expect(contact).toStrictEqual(mockedCollaborators[0])
  })

  it("get account's return null", async () => {
    const contact = await getAccountUserByEmail('')

    expect(contact).toBeNull()
  })
})
