import type { Collab, Role } from '@entities/types'
import { handleRequestError } from '@entities/helpers'
import { API_PREFIXES } from '@pulse/common/constants'
import { api } from '@pulse/common/api'
import type { Contact } from '../contact/contactTypes'
import type { GenericPageResponse } from './collaborator.type'
import { ContactType } from '@pulse/common/enums'

const defaultValue = { items: [], currentPage: 1, totalPages: 1, totalItems: 0 }

export const getCollaboratorsByIdEntity = async (
  accountId: number,
  queryParams?: URLSearchParams,
): Promise<GenericPageResponse<Collab>> => {
  const response = await api.gateway.get(
    `${API_PREFIXES.CUSTOMER_WALLET}/accounts/${accountId}/contacts?Type=Collaborator&${queryParams}`,
  )

  return response?.data
}

export const getCollaborators = async (
  pageNumber: number = 1,
  pageSize: number = 10,
  email: string | null = null,
  search: string | null | undefined = null,
  sort: string | undefined = undefined,
  sortCurrentUserFirst: boolean = false,
): Promise<GenericPageResponse<Contact>> => {
  try {
    const response = await api.gateway.get(
      `${API_PREFIXES.WALLET}/contacts`,
      {
        params: {
          type: ContactType.COLLABORATOR,
          pageNumber,
          pageSize,
          email,
          search,
          sort,
          sortCurrentUserFirst,
        },
      },
    )

    return response?.data || defaultValue
  } catch (error) {
    handleRequestError('fetching collabs', error)
    return defaultValue
  }
}

export const updateCollaborator = async (
  contactId: number,
  updates: { [key: string]: string | number | undefined },
): Promise<Contact> => {
  const updateCollaboratorUrl = `${API_PREFIXES.WALLET}/contacts/${contactId}`
  const requestBody = []
  for (const key in updates) {
    requestBody.push({
      op: 'replace',
      path: `/${key}`,
      value: updates[key],
    })
  }

  const headers = {
    'Content-Type': 'application/json-patch+json',
  }
  const requestBodyJson = JSON.stringify(requestBody)
  const response = await api.gateway.patch(updateCollaboratorUrl, requestBodyJson, { headers })
  return response.data
}

export const fetchContactRoles = async (
  contactType: string,
): Promise<Role[]> => {
  try {
    const response = await api.gateway.get(`${API_PREFIXES.WALLET}/personas/${contactType}`)
    return response?.data
  } catch (error) {
    handleRequestError('fetching roles', error)
    return []
  }
}

export const fetchCollaborators = async (
  search: string | null = null,
  pageSize?: number,
): Promise<Contact[] | undefined> => {
  try {
    const response = await api.gateway.get(
      `${API_PREFIXES.OFFER}/contacts`,
      {
        params: {
          Type: ContactType.COLLABORATOR,
          search,
          pageSize,
        },
      },
    )

    return response?.data?.items
  } catch (error) {
    handleRequestError('fetching contacts', error)
  }
}
