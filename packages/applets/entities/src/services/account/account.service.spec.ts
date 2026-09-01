import {
  fetchAccount,
  fetchAccounts,
  searchAccounts,
  patchAccount,
  fetchAccountReferential,
  fetchReferentialHubs,
  deleteAccountDelegation,
  delegateAccounts,
  createDelegationRequest,
  fetchPermanentDelegations,
  fetchPendingDelegationRequests,
  acceptDelegationRequests,
  refuseDelegationRequests,
  addContactToEntity,
  fetchContactsFromSameHub,
  createCustomer,
  getAccountUserByEmail,
  getAccountSignatories,
  fetchGatewayApi,
  fetchReferentialOffices,
  deleteContactFromAccount,
  hasContactRoleOnCommonAccount,
  updateCustomerRelation,
  fetchAccountContactsByEmail,
  updateSignatoryStatus,
  checkLastCollaboratorOnAccounts,
  removeCurrentUserFromAccounts,
} from '.'
import type { Hub } from './account.type'
import type { CreateCustomerRequest } from './create-customer.types'
import {
  getMockedAccount,
  getMockedAccountRow,
  getMockedPatchOperations,
  getMockedAccountReferential,
  getMockedReferentialHubs,
  getMockedReferentialOffices,
  getMockedAccountsDelegation,
  getMockedSearchAccountItem,
} from '@entities/__mocks__/account-row.mocks'
import { getMockedCollaborators } from '@entities/__mocks__/collaborators.mocks'
import { API_PREFIXES } from '@pulse/common/constants'
import { AccountType } from '@pulse/common/enums'
import {
  apiGatewayDeleteMock,
  apiGatewayGetMock,
  apiGatewayPatchMock,
  apiGatewayPostMock,
} from '@pulse/common/mocks/vitest'

const delegationId = 3
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
const mockedAccountApiPatch = apiGatewayPatchMock
const mockedCollaborators = getMockedCollaborators()
const postSpy = apiGatewayPostMock
const commonApiGetMock = apiGatewayGetMock

beforeEach(() => {
  apiGatewayDeleteMock.mockImplementation((url) => {
    if (url === `${API_PREFIXES.ACCOUNT}/roles`) {
      return {
        status: 200,
        data: {
          accountId,
          contactId,
        },
      }
    }
    if (url === `${API_PREFIXES.ACCOUNT}/delegations/currentuser`) {
      return {
        status: 200,
      }
    }
  })
})

describe('test accountServices', () => {
  beforeEach(() => {
    commonApiGetMock.mockImplementation((url, args) => {
      if (url === 'offer/api/referentials/AccountReferentialInformation') {
        return Promise.resolve({
          data: mockedAccountReferential,
        })
      }
      if (url === 'offer/api/referentials/hubs' || url === 'offer/api/referentials/hubs?sort=ASC') {
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
      if (url === `${API_PREFIXES.ACCOUNT}/roles/last-collaborator`) {
        return Promise.resolve({
          data: {
            isLastCollaboratorOnAny: true,
            accountIdsWhereLastCollaborator: [8],
          },
        })
      }
      if (url === `${API_PREFIXES.WALLET}/delegations/currentuser/delegator`) {
        return Promise.resolve({
          data: { items: [], currentPage: 1, totalPage: 0, totalItems: 0 },
        })
      }
      if (url.startsWith(`${API_PREFIXES.ACCOUNT}/delegations/requests/received/currentuser`)) {
        return Promise.resolve({
          data: { items: [], currentPage: 1, totalPage: 0, totalItems: 0 },
        })
      }
      if (url === `${API_PREFIXES.ACCOUNT}/accounts/search`) {
        return Promise.resolve({
          data: {
            items: [getMockedSearchAccountItem()],
            currentPage: 1,
            totalPage: 1,
            totalItems: 1,
          },
        })
      }

      return url.includes(SEARCH_CURRENT_USER)
        ? Promise.resolve({ data: [mockedAccountRow] })
        : Promise.reject(new Error(rejectedErrorMessage))
    })
  })
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

      await expect(fetchAccounts(searchParams))
        .rejects.toThrow(expectedErrorMessage)
    })
  })

  describe('searchAccounts', () => {
    it('should search accounts by keyword and return results', async () => {
      const keyword = 'test company'
      const expectedUrl = `${API_PREFIXES.ACCOUNT}/accounts/search`
      const result = await searchAccounts(keyword)

      expect(commonApiGetMock).toHaveBeenCalledWith(expectedUrl, {
        params: { keyword },
      })
      expect(result).toStrictEqual({
        items: [getMockedSearchAccountItem()],
        currentPage: 1,
        totalPage: 1,
        totalItems: 1,
      })
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

      await expect(patchAccount(accountIdRejected, mockedPatchOperations))
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
      expect(commonApiGetMock).toHaveBeenCalledWith('offer/api/referentials/hubs?sort=ASC')
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
    it('sends a PATCH request with the mandatory status and account identifiers', async () => {
      const response = {
        succeeded: [{ accountId }],
        failed: [],
      }
      mockedAccountApiPatch.mockResolvedValueOnce({ data: response })

      const result = await updateCustomerRelation([accountId], isCustomerRelation)
      const expectedUrl = `${API_PREFIXES.ACCOUNT}/roles/customer-relation`

      expect(mockedAccountApiPatch).toHaveBeenCalledOnce()
      expect(mockedAccountApiPatch).toHaveBeenNthCalledWith(1, expectedUrl, {
        accountIds: [accountId],
        isCustomerRelation,
      })
      expect(result).toStrictEqual(response)
    })
  })

  describe('delegations', () => {
    it('delete a delegation', async () => {
      const response = await deleteAccountDelegation(delegationId, contactId, 1)

      expect(response).toStrictEqual({ status: 200 })
    })

    it('delegate accounts', async () => {
      const responseMock = true
      postSpy.mockResolvedValue(responseMock)
      const delegationRequestMock = getMockedAccountsDelegation()
      const response = await delegateAccounts(delegationRequestMock)
      const expectedUrl = `${API_PREFIXES.WALLET}/delegations/currentuser`

      expect(postSpy).toHaveBeenCalledExactlyOnceWith(expectedUrl, delegationRequestMock)
      expect(response).toStrictEqual(responseMock)
    })

    it('create a delegation request', async () => {
      const responseMock = true
      postSpy.mockResolvedValue(responseMock)
      const delegationRequestMock = { accountId, recipientIds: [contactId, 1] }
      const response = await createDelegationRequest(delegationRequestMock)
      const expectedUrl = `${API_PREFIXES.ACCOUNT}/delegations/requests/currentuser`

      expect(postSpy).toHaveBeenCalledExactlyOnceWith(expectedUrl, delegationRequestMock)
      expect(response).toStrictEqual(responseMock)
    })

    it('fetch permanent delegations', async () => {
      const result = await fetchPermanentDelegations()
      const expectedUrl = `${API_PREFIXES.WALLET}/delegations/currentuser/delegator`

      expect(commonApiGetMock).toHaveBeenCalledWith(expectedUrl)
      expect(result).toStrictEqual({ items: [], currentPage: 1, totalPage: 0, totalItems: 0 })
    })

    it('fetch pending delegation requests', async () => {
      const result = await fetchPendingDelegationRequests(1, 15)
      const expectedUrl = `${API_PREFIXES.ACCOUNT}/delegations/requests/received/currentuser?page=1&pageSize=15`

      expect(commonApiGetMock).toHaveBeenCalledWith(expectedUrl)
      expect(result).toStrictEqual({ items: [], currentPage: 1, totalPage: 0, totalItems: 0 })
    })

    it('accept delegation requests', async () => {
      const responseMock = true
      postSpy.mockResolvedValue(responseMock)
      const delegationRequestIds = [1, 2]
      const response = await acceptDelegationRequests(delegationRequestIds)
      const expectedUrl = `${API_PREFIXES.ACCOUNT}/delegations/requests/accept/currentuser`

      expect(postSpy).toHaveBeenCalledExactlyOnceWith(expectedUrl, { delegationRequestIds })
      expect(response).toStrictEqual(responseMock)
    })

    it('refuse delegation requests', async () => {
      const responseMock = true
      postSpy.mockResolvedValue(responseMock)
      const delegationRequestIds = [3]
      const response = await refuseDelegationRequests(delegationRequestIds)
      const expectedUrl = `${API_PREFIXES.ACCOUNT}/delegations/requests/refuse/currentuser`

      expect(postSpy).toHaveBeenCalledExactlyOnceWith(expectedUrl, { delegationRequestIds })
      expect(response).toStrictEqual(responseMock)
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
      const postRequestBody: CreateCustomerRequest = {
        firstName: mockedCollaborators[0].firstName,
        lastName: mockedCollaborators[0].lastName,
        email: mockedCollaborators[0].email,
        mobilePhone: mockedCollaborators[0].mobilePhone,
        title: 'M',
      }
      const id = await createCustomer(postRequestBody, mockedAccount.accountNumber, AccountType.REGULAR)
      expect(postSpy).toHaveBeenCalledWith(`${API_PREFIXES.ACCOUNT}/customers`,
        postRequestBody,
        { params: { accountNumber: mockedAccount.accountNumber, accountType: AccountType.REGULAR } },
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

    it('should check if current user is the last collaborator on accounts', async () => {
      const accountIds = [5, 8]
      const result = await checkLastCollaboratorOnAccounts(accountIds)
      const expectedUrl = `${API_PREFIXES.ACCOUNT}/roles/last-collaborator`
      const callParameters = commonApiGetMock.mock.calls.at(-1)?.[1]?.params as URLSearchParams

      expect(commonApiGetMock).toHaveBeenLastCalledWith(expectedUrl, {
        params: callParameters,
      })
      expect(callParameters.getAll('accountIds')).toEqual(['5', '8'])
      expect(result).toStrictEqual({
        isLastCollaboratorOnAny: true,
        accountIdsWhereLastCollaborator: [8],
      })
    })

    it('should remove current user from accounts', async () => {
      const response = {
        succeeded: [
          { accountId: 5, errorCode: null, errorMessage: null },
        ],
        failed: [
          { accountId: 8, errorCode: 'ACC004', errorMessage: 'Error' },
        ],
      }
      const request = { accountIds: [5, 8] }
      postSpy.mockResolvedValueOnce({ data: response })

      const result = await removeCurrentUserFromAccounts(request)

      expect(postSpy).toHaveBeenLastCalledWith(`${API_PREFIXES.ACCOUNT}/roles/self-removal`, request)
      expect(result).toStrictEqual(response)
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

  describe('fetchAccountContactsByEmail', () => {
    it('should return', async () => {
      const email = 'email@adresse.fd'
      const dataMock = {
        items: [],
      }
      commonApiGetMock.mockReturnValue({
        data: dataMock,
      })
      const expectedUrl = `${API_PREFIXES.ACCOUNT}/accounts/${accountId}/contacts?pageNumber=1&pageSize=1&search=email%40adresse.fd`
      const contacts = await fetchAccountContactsByEmail(accountId, email)

      expect(commonApiGetMock).toHaveBeenCalledExactlyOnceWith(expectedUrl)
      expect(contacts).toStrictEqual(dataMock)
    })
  })
})
