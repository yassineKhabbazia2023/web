import { describe, it, vi, expect } from 'vitest'
import { API_PREFIXES } from '@/common/config/services'
import {
  fetchFavoriteEntities,
  getCollaborators,
  getCollaboratorsByIdEntity,
  getPermissions,
  getRoles,
  manageFavoriteEntities,
  fetchEntitiesStatistics,
  fetchAccountCustomers,
} from '.'
import { ContactType } from '../contact/contactTypes'
import { getMockedEntitiesStatistics } from '@/pages/wallet/components/Filters/FiltersMocks'
import mockCollaborators from '@/pages/wallet/pages/collaborators/mockCollaborators.json'
import mockRoles from '@/pages/wallet/pages/collaborators/components/DrawerCollabRole/components/CollabRole/mock.json'
import mockPermissions from
  '@/pages/wallet/pages/collaborators/components/DrawerCollabRole/components/CollabAccess/mock.json'
import { mockCollabsData } from '@/pages/folder/pages/collaborators/mockData'
import type { Entity } from '@kpmg/common'
import { getMockedCustomersCollab } from '@/pages/folder/pages/usersCollab/mockData'

const accountId = 5
const mockedEntitiesStatistics = getMockedEntitiesStatistics()
const mockedCustomersCollab = getMockedCustomersCollab()
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
        if (
          url ===
          `${API_PREFIXES.CUSTOMER_WALLET}/accounts/${accountId}/contacts?Type=Collaborator`
        ) {
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
        if (url === `${API_PREFIXES.WALLET}/permissions/123`) {
          return fetchPermissions()
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
    data: mockRoles.data,
  })
}
const fetchPermissions = () => {
  return Promise.resolve({
    data: mockPermissions,
  })
}
const getCollaboratorsByIdEntityImplementation = () => {
  return Promise.resolve({
    data: mockCollabsData,
  })
}
const fetchAccountCustomersImplementation = () => {
  return Promise.resolve({
    data: mockedCustomersCollab,
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
      const collaborators = await getCollaboratorsByIdEntity(accountId)

      expect(collaborators).toStrictEqual(mockCollabsData)
    })
  })
  describe('fetchAccountCustomers', () => {
    it('should return list of customers', async () => {
      const customers = await fetchAccountCustomers(accountId)

      expect(customers).toStrictEqual(mockedCustomersCollab)
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
      const roles = await getRoles(ContactType.Collaborator)
      expect(roles).toStrictEqual(mockRoles.data)
    })
    it('should return list of permissions', async () => {
      const permissions = await getPermissions(123)
      expect(permissions).toStrictEqual(mockPermissions)
    })
  })
})
