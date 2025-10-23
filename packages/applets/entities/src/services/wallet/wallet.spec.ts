import { API_PREFIXES } from '@pulse/common/constants'
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
import { ContactType } from '@pulse/common/enums'
import { getMockedCustomersCollab } from '@entities/__mocks__/contact.mocks'
import { getMockedCollabRoles } from '@entities/__mocks__/collab-roles.mocks'
import { getMockedEntitiesStatistics } from '@entities/__mocks__/filters.mocks'
import { mockCollabsData } from '@entities/__mocks__/collab-data.mocks'
import type { Entity } from '@pulse/common/types'
import * as Common from '@pulse/common'
import { getMockedCollaborators } from '@entities/__mocks__/collaborators.mocks'

const accountId = 5
const mockedEntitiesStatistics = getMockedEntitiesStatistics()
const mockedCustomersCollab = getMockedCustomersCollab()
const mockedCollaborators = getMockedCollaborators()
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

vi.mock('@pulse/common', () => ({
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
      items: mockedCollaborators,
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
      const { items } = await fetchAccountCustomers(accountId)

      expect(items).toStrictEqual(mockedCustomersCollab)
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
        Type: ContactType.CUSTOMER,
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
      const contacts = await fetchCustomers(searchParams)
      const expectedArguments = 'customer-wallet/api/customers/currentuser?searchTerm=search+term&limit=50'

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

      expect(collaborators?.items).toStrictEqual(mockedCollaborators)
    })

    it('should return list of roles', async () => {
      const roles = await fetchContactRoles(ContactType.COLLABORATOR)

      expect(roles).toStrictEqual(mockedCollabRoles)
    })
  })
})
