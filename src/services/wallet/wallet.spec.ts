import { describe, it, vi, expect } from 'vitest'
import { API_PREFIXES } from '@/common/config/services'
import {
  fetchFavoriteEntities,
  getCollaborators,
  getCollaboratorsByIdEntity,
  fetchContactRoles,
  manageFavoriteEntities,
  fetchEntitiesStatistics,
  fetchAccountCustomers,
  fetchAccountContacts,
  fetchCustomers,
} from '.'
import { ContactType } from '../contact/contactTypes'
import { getMockedEntitiesStatistics } from '@/pages/wallet/components/Filters/FiltersMocks'
import mockCollaborators from '@/pages/wallet/pages/collaborators/mockCollaborators.json'
import { mockCollabsData } from '@/pages/folder/pages/collaborators/mockData'
import type { Entity } from '@kpmg/common'
import * as Common from '@kpmg/common'
import { getMockedCustomersCollab } from '@/pages/folder/pages/usersCollab/mockData'
import {
  getMockedCollabRoles,
} from '@/pages/wallet/pages/collaborators/components/CollabRightsDrawer/components/CollabRoles/CollabRolesMocks'

const accountId = 5
const mockedEntitiesStatistics = getMockedEntitiesStatistics()
const mockedCustomersCollab = getMockedCustomersCollab()
const mockedCollabRoles = getMockedCollabRoles()

const TEST_ENTITIES: Entity[] = [
  {
    accountId: 1,
    accountNumber: '2024643902',
    legalName: 'Test 1',
    color: 'orange',
  },
  {
    accountId: 2,
    accountNumber: '3524433298',
    legalName: 'Test 2',
    color: 'cyan',
  },
]

const mockedFavoriteEntityPatch = vi.fn()

vi.mock('@kpmg/common', () => ({
  commonApi: () => ({
    gateway: {
      /**
       * 🛠️ TODO: Need to refactor all of this code; many 'if' statements is not a good practice
       */
      get: vi.fn().mockImplementation((url) => {
        if (url.startsWith(`${API_PREFIXES.CUSTOMER_WALLET}/accounts/${accountId}/contacts?Type=Collaborator`)) {
          return getCollaboratorsByIdEntityImplementation()
        }
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
        if (url === `${API_PREFIXES.WALLET}/contacts`) {
          return fetchCollabsImplementation()
        }
        if (url === `${API_PREFIXES.WALLET}/personas/Collaborator`) {
          return fetchRoles()
        }
      }),
      patch: mockedFavoriteEntityPatch,
    },
  }),
}))

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
const fetchRoles = () => {
  return Promise.resolve({
    data: mockedCollabRoles,
  })
}
const getCollaboratorsByIdEntityImplementation = () => {
  return Promise.resolve({
    data: {
      items: mockCollabsData,
    },
  })
}
const fetchAccountCustomersImplementation = () => {
  return Promise.resolve({
    data: {
      items: mockedCustomersCollab,
    },
  })
}
const fetchCollabsImplementation = () => {
  return Promise.resolve({
    data: {
      items: mockCollaborators,
    },
  })
}
describe('collaborateurs/admin', () => {
  describe('getCollaboratorsByIdEntity', () => {
    it('should return list of collaborators', async () => {
      const { items } = await getCollaboratorsByIdEntity(accountId)

      expect(items).toStrictEqual(mockCollabsData)
    })
  })
  describe('fetchAccountCustomers', () => {
    it('should return list of customers', async () => {
      const customers = await fetchAccountCustomers(accountId)

      expect(customers).toStrictEqual(mockedCustomersCollab)
    })
  })

  describe('fetchAccountContacts', () => {
    it('should return list of contacts', async () => {
      const mockedData = {
        items: [],
      }
      const getSpy = vi.fn().mockResolvedValue({ data: mockedData })
      vi
        .spyOn(Common, 'commonApi')
        .mockReturnValue({
          gateway: {
            get: getSpy,
          },
        } as any)
      const params = {
        Type: 'Customer',
        limit: '50',
      }
      const searchParams = new URLSearchParams(params)
      const contacts = await fetchAccountContacts(accountId, searchParams)
      const expectedArguments = 'account/api/accounts/5/contacts?Type=Customer&limit=50'

      expect(getSpy).toHaveBeenCalledOnce()
      expect(getSpy).toHaveBeenNthCalledWith(1, expectedArguments)
      expect(contacts).toStrictEqual(mockedData)
    })
  })

  describe('fetchCustomers', () => {
    it("should return list of user's customers", async () => {
      const accountId = 34
      const mockedData = {
        items: [],
      }
      const getSpy = vi.fn().mockResolvedValue({ data: mockedData })
      vi
        .spyOn(Common, 'commonApi')
        .mockReturnValue({
          gateway: {
            get: getSpy,
          },
        } as any)
      const params = {
        searchTerm: 'search term',
        limit: '50',
      }
      const searchParams = new URLSearchParams(params)
      const contacts = await fetchCustomers(accountId, searchParams)
      const expectedArguments = 'customer-wallet/api/customers/34?searchTerm=search+term&limit=50'

      expect(getSpy).toHaveBeenCalledOnce()
      expect(getSpy).toHaveBeenNthCalledWith(1, expectedArguments)
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
  describe('getCollaborators', () => {
    it('should return list of collaborators', async () => {
      const collaborators = await getCollaborators()
      expect(collaborators?.items).toStrictEqual(mockCollaborators)
    })

    it('should return list of roles', async () => {
      const roles = await fetchContactRoles(ContactType.Collaborator)
      expect(roles).toStrictEqual(mockedCollabRoles)
    })
  })
})
