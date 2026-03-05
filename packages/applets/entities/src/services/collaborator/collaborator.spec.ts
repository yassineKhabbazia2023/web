import { API_PREFIXES } from '@pulse/common/constants'
import {
  getCollaborators,
  getCollaboratorsByIdEntity,
  fetchContactRoles,
  fetchCollaborators,
} from '.'
import { ContactType } from '@pulse/common/enums'
import { getMockedCollaborators } from '@entities/__mocks__/collaborators.mocks'
import { getMockedCollabRoles } from '@entities/__mocks__/collab-roles.mocks'
import { mockCollabsData } from '@entities/__mocks__/collab-data.mocks'

const accountId = 5
const mockedCollaborators = getMockedCollaborators()
const mockedCollabRoles = getMockedCollabRoles()

vi.mock('@pulse/common/api', () => ({
  api: ({
    gateway: {
      get: vi.fn().mockImplementation((url) => {
        if (url.startsWith(`${API_PREFIXES.CUSTOMER_WALLET}/accounts/${accountId}/contacts?Type=Collaborator`)) {
          return Promise.resolve({ data: { items: mockCollabsData } })
        }
        if (url === `${API_PREFIXES.WALLET}/contacts`) {
          return Promise.resolve({ data: { items: mockedCollaborators } })
        }
        if (url === `${API_PREFIXES.WALLET}/personas/Collaborator`) {
          return Promise.resolve({ data: mockedCollabRoles })
        }
        if (url === `${API_PREFIXES.OFFER}/contacts`) {
          return Promise.resolve({ data: { items: mockedCollaborators } })
        }
      }),
    },
  }),
}))

describe('collaborator service', () => {
  describe('getCollaboratorsByIdEntity', () => {
    it('should return list of collaborators', async () => {
      const { items } = await getCollaboratorsByIdEntity(accountId)

      expect(items).toStrictEqual(mockCollabsData)
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

  describe('fetchCollaborators', () => {
    it('should return list of collaborators', async () => {
      const collaborators = await fetchCollaborators()

      expect(collaborators).toStrictEqual(mockedCollaborators)
    })
  })
})
