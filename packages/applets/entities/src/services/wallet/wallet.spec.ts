import { API_PREFIXES } from '@pulse/common/constants'
import { apiGatewayGetMock, apiGatewayPatchMock } from '@pulse/common/mocks/vitest'
import {
  fetchFavoriteEntities,
  manageFavoriteEntities,
  fetchAccountCustomers,
  fetchAccountContacts,
  fetchCustomers,
} from '.'
import { ContactType, AccountType } from '@pulse/common/enums'
import { getMockedCustomersCollab } from '@entities/__mocks__/contact.mocks'
import type { Entity } from '@pulse/common/types'

const accountId = 5
const mockedCustomersCollab = getMockedCustomersCollab()

const TEST_ENTITIES: Entity[] = [
  {
    accountId: 1,
    accountNumber: '2024643902',
    legalName: 'Test 1',
    color: 'orange',
    accountType: AccountType.REGULAR,
  },
  {
    accountId: 2,
    accountNumber: '3524433298',
    legalName: 'Test 2',
    color: 'cyan',
    accountType: AccountType.REGULAR,
  },
]

const mockedFavoriteEntityPatch = apiGatewayPatchMock
const mockedGatewayGet = apiGatewayGetMock

const fetchEntitiesImplementation = () => {
  return Promise.resolve({
    data: TEST_ENTITIES,
  })
}
const fetchAccountCustomersImplementation = () => {
  return Promise.resolve({
    data: {
      items: mockedCustomersCollab,
    },
  })
}

describe('wallet service', () => {
  beforeEach(() => {
    mockedGatewayGet.mockImplementation((url) => {
      if (
        url ===
        `${API_PREFIXES.ACCOUNT}/accounts/${accountId}/contacts?Type=customer`
      ) {
        return fetchAccountCustomersImplementation()
      }
      if (url === `${API_PREFIXES.WALLET}/favorites/currentuser`) {
        return fetchEntitiesImplementation()
      }
    })
  })

  describe('fetchAccountCustomers', () => {
    it('should return list of customers', async () => {
      const { items } = await fetchAccountCustomers(accountId)

      expect(items).toStrictEqual(mockedCustomersCollab)
    })
  })

  describe('fetchAccountContacts', () => {
    it('should return list of contacts', async () => {
      const mockedData = {
        items: [],
      }
      mockedGatewayGet.mockResolvedValueOnce({ data: mockedData })
      const params = {
        Type: ContactType.CUSTOMER,
        limit: '50',
      }
      const searchParams = new URLSearchParams(params)
      const contacts = await fetchAccountContacts(accountId, searchParams)
      const expectedArguments = 'account/api/accounts/5/contacts?Type=Customer&limit=50'

      expect(mockedGatewayGet).toHaveBeenCalledOnce()
      expect(mockedGatewayGet).toHaveBeenNthCalledWith(1, expectedArguments)
      expect(contacts).toStrictEqual(mockedData)
    })
  })

  describe('fetchCustomers', () => {
    it("should return list of user's customers", async () => {
      const mockedData = {
        items: [],
      }
      mockedGatewayGet.mockResolvedValueOnce({ data: mockedData })
      const params = {
        searchTerm: 'search term',
        limit: '50',
      }
      const searchParams = new URLSearchParams(params)
      const contacts = await fetchCustomers(searchParams)
      const expectedArguments = 'customer-wallet/api/customers/currentuser?searchTerm=search+term&limit=50'

      expect(mockedGatewayGet).toHaveBeenCalledOnce()
      expect(mockedGatewayGet).toHaveBeenNthCalledWith(1, expectedArguments)
      expect(contacts).toStrictEqual(mockedData)
    })
  })
  describe('fetchFavoriteEntities', () => {
    it('should return the favorite entities of the current user', async () => {
      const favoriteEntities = await fetchFavoriteEntities()

      expect(favoriteEntities).toStrictEqual(TEST_ENTITIES)
    })
  })
  describe('patchFavoriteEntity', () => {
    it('should mark entity as a favorite', async () => {
      const isFavorite = true
      const expectedUrl = `${API_PREFIXES.WALLET}/favorites/currentuser?accountId=${accountId}&isFavorite=${isFavorite}`
      await manageFavoriteEntities(accountId, isFavorite)

      expect(mockedFavoriteEntityPatch).toHaveBeenCalledOnce()
      expect(mockedFavoriteEntityPatch).toHaveBeenNthCalledWith(1, expectedUrl)
    })
  })
})
