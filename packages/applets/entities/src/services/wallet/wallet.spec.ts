import { API_PREFIXES } from '@pulse/common/constants'
import { apiGatewayGetMock, apiGatewayPatchMock } from '@pulse/common/mocks/vitest'
import {
  fetchFavoriteEntities,
  manageFavoriteEntities,
  fetchEntitiesStatistics,
  fetchAccountCustomers,
  fetchAccountContacts,
  fetchCustomers,
  fetchWalletAccounts,
} from '.'
import { ContactType, AccountType } from '@pulse/common/enums'
import { getMockedCustomersCollab } from '@entities/__mocks__/contact.mocks'
import { getMockedEntitiesStatistics } from '@entities/__mocks__/filters.mocks'
import type { Entity } from '@pulse/common/types'
import { getMockedAccountQueryResult } from '@entities/__mocks__/account-row.mocks'
import { getMockedSearchCriteria } from '@entities/__mocks__/deploy-utils.mocks'

const accountId = 5
const mockedEntitiesStatistics = getMockedEntitiesStatistics()
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

const fetchEntitiesStatisticsImplementation = () => {
  return Promise.resolve({
    data: mockedEntitiesStatistics,
  })
}
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
      if (url === `${API_PREFIXES.WALLET}/statistics/currentuser`) {
        return fetchEntitiesStatisticsImplementation()
      }
      if (url === `${API_PREFIXES.WALLET}/favorites/currentuser`) {
        return fetchEntitiesImplementation()
      }
    })
  })

  describe('fetchWalletAccounts', () => {
    it.each([5, 10, 15, 30, 45, 60, 90, 120])('requests only one page of %i accounts', async (limit) => {
      const accounts = getMockedAccountQueryResult({ totalItems: 5000, totalPage: Math.ceil(5000 / limit) })
      mockedGatewayGet.mockResolvedValueOnce({
        data: { accounts, favorites: null },
      })

      const result = await fetchWalletAccounts(getMockedSearchCriteria({ limit }))

      expect(mockedGatewayGet).toHaveBeenCalledExactlyOnceWith(
        `wallet/api/currentuser?pageNumber=1&pageSize=${limit}&includeFavorites=false`,
      )
      expect(result).toStrictEqual(accounts)
    })

    it.each([true, false])('forwards search, all filters and sorting direction %s', async (descending) => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2026-09-10T12:00:00Z'))
      try {
        mockedGatewayGet.mockResolvedValueOnce({ data: { accounts: getMockedAccountQueryResult() } })

        await fetchWalletAccounts(getMockedSearchCriteria({
          currentPage: 3,
          search: 'Société & associés + test@example.fr',
          sorting: { field: 'lastActivityDate', descending },
          filterByDeploymentStatus: ['1', '3'],
          filterByMissionType: ['Tenue', 'Révision'],
          filterByLastActivityPeriodInDays: 7,
          isFavoriteFilter: true,
          isCustomerRelationFilter: true,
        }))

        expect(mockedGatewayGet).toHaveBeenCalledOnce()
        const url = new URL(mockedGatewayGet.mock.calls[0][0], 'https://gateway.test/')
        expect(url.pathname).toBe('/wallet/api/currentuser')
        expect(Object.fromEntries(url.searchParams)).toMatchObject({
          pageNumber: '3',
          pageSize: '15',
          search: 'Société & associés + test@example.fr',
          'sorting.field': 'lastActivityDate',
          isFavoriteFilter: 'true',
          isCustomerRelationFilter: 'true',
          lastActivityDateFrom: '2026-09-03T12:00:00.000Z',
          includeFavorites: 'false',
        })
        expect(url.searchParams.get('sorting.descending')).toBe(descending ? 'true' : null)
        expect(url.searchParams.getAll('deploymentStatus')).toStrictEqual(['1', '3'])
        expect(url.searchParams.getAll('missionType')).toStrictEqual(['Tenue', 'Révision'])
        expect(url.searchParams.has('contactId')).toBe(false)
        expect(url.searchParams.has('includeStatistics')).toBe(false)
      } finally {
        vi.useRealTimers()
      }
    })

    it('keeps the backend first-page default when the UI page is zero', async () => {
      const accounts = getMockedAccountQueryResult()
      mockedGatewayGet.mockResolvedValueOnce({ data: { accounts } })

      expect(await fetchWalletAccounts(getMockedSearchCriteria({ currentPage: 0 }))).toStrictEqual(accounts)
      expect(mockedGatewayGet).toHaveBeenCalledExactlyOnceWith(
        'wallet/api/currentuser?pageSize=15&includeFavorites=false',
      )
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
  describe('fetchEntitiesStatistics', () => {
    it('should return the statistics for the entities associated with the current user', async () => {
      const entitiesStatistics = await fetchEntitiesStatistics()

      expect(entitiesStatistics).toStrictEqual(mockedEntitiesStatistics)
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
