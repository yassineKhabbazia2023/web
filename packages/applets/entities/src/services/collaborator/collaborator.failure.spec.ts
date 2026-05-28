import { ContactType } from '@pulse/common/enums'
import { API_PREFIXES } from '@pulse/common/constants'
import {
  fetchContactRoles,
  getCollaborators,
} from '.'

const collaboratorType = ContactType.COLLABORATOR
const errorMessage = 'API Error: 503 Service Unavailable'

vi.mock('@entities/helpers/entity.helper', () => ({
  handleRequestError: vi.fn(),
}))

vi.mock('@pulse/common/api', () => ({
  api: ({
    gateway: {
      get: vi.fn().mockImplementation((url) => {
        if (url === `${API_PREFIXES.WALLET}/contacts`) {
          return Promise.reject(new Error(errorMessage))
        }
        if (url === `${API_PREFIXES.WALLET}/personas/${collaboratorType}`) {
          return Promise.reject(new Error(errorMessage))
        }
      }),
    },
  }),
}))

describe('getCollaborators/Admin', () => {
  it('service should return empty list', async () => {
    const errorResponse = await getCollaborators()

    expect(errorResponse).toStrictEqual({ items: [], currentPage: 1, totalPages: 1, totalItems: 0 })
  })
})

describe('fetchContactRoles', () => {
  it('show call handleRequest error', async () => {
    const errorResponse = await fetchContactRoles(collaboratorType)

    expect(errorResponse).toStrictEqual([])
  })
})
