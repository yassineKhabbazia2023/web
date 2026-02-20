import { describe, it, vi, expect } from 'vitest'
import { API_PREFIXES } from '@pulse/common/constants'
import { omit } from 'lodash-es'
import { getMockedCustomer } from '@entities/__mocks__/customer.mocks'
import type { PatchContactPayload } from './contactTypes'
import {
  getContactById,
  inviteCustomers,
  patchContact,
} from '.'

// Mocks
const mockedAccountId = 125
const mockedCustomerIDs = [1, 2, 3]
const mockedContact = getMockedCustomer()
const mockedAccountNumber = '2323232323232'

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
  describe('getContactById', () => {
    it('should return the contact with the given id', async () => {
      await getContactById(mockedContact[0].id)

      expect(mocks.get).toHaveBeenCalledWith(
        `customer-wallet/api/contacts/${mockedContact[0].id}`,
      )
    })
  })
  describe('patchContact', () => {
    it('should return the patched contact with given payload', async () => {
      mocks.patch.mockImplementation((url, payload, config) => {
        return handlePatchApiMock(url, payload, config)
      })
      const patchPayload = omit(mockedContact[0], 'id', 'persona', 'email', 'type', 'office') as PatchContactPayload
      const contact = await patchContact(1, mockedAccountId, patchPayload)

      expect(contact).toStrictEqual(mockedContact[0])
      expect(mocks.patch).toHaveBeenCalledWith(
        `${API_PREFIXES.CUSTOMER_WALLET}/contacts/1`,
        expect.any(Array),
        {
          params: { accountId: mockedAccountId },
          headers: { 'Content-Type': 'application/json-patch+json' },
        },
      )
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
