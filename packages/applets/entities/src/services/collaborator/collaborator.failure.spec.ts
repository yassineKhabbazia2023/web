import { ContactType } from '@pulse/common/enums'
import { API_PREFIXES } from '@pulse/common/constants'
import {
  fetchContactRoles,
  getCollaborators,
} from '.'
import { apiGatewayGetMock } from '@pulse/common/mocks/vitest'
import { handleRequestError } from '@entities/helpers/entity.helper'

const collaboratorType = ContactType.COLLABORATOR
const errorMessage = 'API Error: 503 Service Unavailable'

beforeEach(() => {
  vi.mocked(handleRequestError).mockImplementation(() => undefined)
  apiGatewayGetMock.mockImplementation((url: string) => {
    if (url === `${API_PREFIXES.WALLET}/contacts`) {
      return Promise.reject(new Error(errorMessage))
    }
    if (url === `${API_PREFIXES.WALLET}/personas/${collaboratorType}`) {
      return Promise.reject(new Error(errorMessage))
    }
  })
})

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
