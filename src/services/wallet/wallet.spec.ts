import { describe, it, vi, expect } from 'vitest'
import { API_PREFIXES } from '../config'
import {
  fetchFavoriteEntities,
  getCollaborators,
  getCollaboratorsByIdEntity,
  getPermissions,
  getRoles,
  manageFavoriteEntities,
} from '.'
import { ContactType } from '../contact/contactTypes'
import mockCollaborators from '@/pages/wallet/pages/collaborators/mockCollaborators.json'
import mockRoles from '@/pages/wallet/pages/collaborators/components/DrawerCollabRole/components/CollabRole/mock.json'
import mockPermissions from
  '@/pages/wallet/pages/collaborators/components/DrawerCollabRole/components/CollabAccess/mock.json'
import { mockCollabsData } from '@/pages/folder/pages/collaborators/mockData'
import type { Entity } from '@kpmg/common'

const accountId = 5
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
      get: vi.fn().mockImplementation((url) => {
        if (
          url ===
          `${API_PREFIXES.CUSTOMER_WALLET}/accounts/${accountId}/contacts?Type=Collaborator`
        ) {
          return getCollaboratorsByIdEntityImplementation()
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
