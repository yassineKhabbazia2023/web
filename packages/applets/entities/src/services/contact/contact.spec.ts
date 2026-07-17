import { API_PREFIXES } from '@pulse/common/constants'
import { apiGatewayGetMock, apiGatewayPatchMock, apiGatewayPostMock } from '@pulse/common/mocks/vitest'
import { AccountType } from '@pulse/common/enums'
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

const mocks = {
  get: apiGatewayGetMock,
  post: apiGatewayPostMock,
  patch: apiGatewayPatchMock,
}

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
    it('should return a list of invited customer IDs and pass the entityType query param', async () => {
      await inviteCustomers(mockedCustomerIDs, mockedAccountId, AccountType.PROSPECT)

      expect(mocks.post).toHaveBeenCalledWith(
        `${API_PREFIXES.CONNECT}/customers/bulk-invite/${mockedAccountId}`,
        mockedCustomerIDs,
        {
          params: { entityType: AccountType.PROSPECT },
        },
      )
    })
  })
})
