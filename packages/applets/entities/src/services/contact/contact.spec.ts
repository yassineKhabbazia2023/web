import { describe, it, vi, expect } from 'vitest'
import { API_PREFIXES } from '@entities/common/config/services'
import { omit } from 'lodash-es'
import { getMockedCustomer } from '@entities/__mocks__/customer.mocks'
import type { PatchContactPayload, AccountOperations } from './contactTypes'
import { getMockedOperations, getAccountOperationsListMock } from '@entities/__mocks__/operations.mocks'
import { getPaginationMock } from '@pulse/common/mocks'
import { OperationStatus } from '@entities/common/types/OperationTypes'
import {
  fetchOperationsForAccount,
  getCollaborators,
  getContactById,
  inviteCustomers,
  patchContact,
  patchOperationStatus,
  fetchAccountOperations,
} from '.'
import { ContactType } from '@pulse/common/enums'

// Mocks
const mockedAccountId = 125
const mockedCustomerIDs = [1, 2, 3]
const mockedContact = getMockedCustomer()
const mockedAccountNumber = '2323232323232'
const mockedOperations = getMockedOperations()

const mocks = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  patch: vi.fn(),
}))

vi.mock('@pulse/common', () => {
  return {
    commonApi: () => ({
      gateway: {
        get: mocks.get,
        patch: mocks.patch,
        post: mocks.post,
      },
    }),
  }
})

const handlePatchApiMock = (url: string, _: object, __: object) => {
  if (url === `${API_PREFIXES.CUSTOMER_WALLET}/contacts/${mockedContact[0].id}`) {
    return Promise.resolve({
      data: mockedContact[0],
    })
  }
}

describe('contact', () => {
  describe('getCollaborators', () => {
    it('should return list of collaborators', async () => {
      await getCollaborators()

      expect(mocks.get).toHaveBeenCalledWith(
        'contact/api/contacts',
        { params: { Type: ContactType.COLLABORATOR, search: null, pageSize: undefined } },
      )
    })
  })
  describe('getContactById', () => {
    it('should return the contact with the given id', async () => {
      await getContactById(mockedContact[0].id)

      expect(mocks.get).toHaveBeenCalledWith(
        `customer-wallet/api/contacts/${mockedContact[0].id}`,
      )
    })
  })
  describe('fetchOperationsForAccount - Fetch the list of operations by passing the AccountId as a parameter', () => {
    it('should return the list of operations associated with an account', async () => {
      await fetchOperationsForAccount(mockedAccountId)

      expect(mocks.get).toHaveBeenCalledWith(
        'registry/api/operations',
        { params: { accountId: mockedAccountId } },
      )
    })
  })

  describe('fetchAccountOperations', () => {
    it('should return the list of operations', async () => {
      const page = 1
      const pageSize = 3
      const search = 'search terms'
      const expectedUrl = 'registry/api/currentuser/operations'
      const params = {
        page,
        pageSize,
        search,
      }
      const expectedArgument = { params }
      const mockedResponse = getPaginationMock<AccountOperations>({
        items: getAccountOperationsListMock(),
      })

      mocks.get.mockResolvedValueOnce({
        data: mockedResponse,
      })

      const operations = await fetchAccountOperations(page, pageSize, search)

      expect(mocks.get).toHaveBeenCalledWith(expectedUrl, expectedArgument)
      expect(operations).toStrictEqual(mockedResponse)
    })
  })
  describe('patchOperationStatus - To update the status of a specific operation', () => {
    it('should call the correct endpoint with the right params/body to update the operation status', async () => {
      await patchOperationStatus(
        mockedOperations[0].operationId,
        OperationStatus.APPROVED,
      )

      expect(mocks.patch).toHaveBeenCalledWith(
        `registry/api/operations/${mockedOperations[0].operationId}/currentuser`,
        [{ op: 'replace', path: '/status', value: 'APPROVED' }],
      )
    })
  })
  describe('patchContact', () => {
    it('should return the patched contact with given payload', async () => {
      mocks.patch.mockImplementation((url, payload, contentType) => {
        return handlePatchApiMock(url, payload, contentType)
      })
      const patchPayload = omit(mockedContact[0], 'id', 'persona', 'email', 'type', 'office') as PatchContactPayload
      const contact = await patchContact(1, patchPayload)

      expect(contact).toStrictEqual(mockedContact[0])
    })
  })
  describe('inviteCustomers', () => {
    it('should return a list of invited customer IDs', async () => {
      await inviteCustomers(mockedCustomerIDs, mockedAccountNumber)

      expect(mocks.post).toHaveBeenCalledWith(
        `contact/api/customers/bulk-invite/${mockedAccountNumber}`,
        mockedCustomerIDs,
      )
    })
  })
})
