import type { Collab } from '@/pages/folder/pages/collaborators/types'
import { handleRequestError } from '@/helper/helper'
import { API_PREFIXES } from '@/common/config/services'
import { type Entity, commonApi } from '@kpmg/common'
import type { Contact } from '../contact/contactTypes'
import type { Role, selectedRoleId } from
  '@/pages/wallet/pages/collaborators/components/DrawerCollabRole/components/CollabRole/types'
import type { IUserFromApi } from '@/pages/folder/pages/usersCollab/types'

const defaultValue = { items: [], currentPage: 1, totalPages: 1, totalItems: 0 }
export interface GenericPageResponse<T> {
    items: T[]
    currentPage: number
    totalPages: number
    totalItems: number
}

export const getCollaboratorsByIdEntity = async (
  accountId: number,
): Promise<Collab[]> => {
  const response = await commonApi().gateway.get(
    `${API_PREFIXES.CUSTOMER_WALLET}/accounts/${accountId}/contacts?Type=Collaborator`,
  )

  return response?.data
}

export const fetchAccountCustomers = async (
  accountId: number,
): Promise<IUserFromApi[]> => {
  const response = await commonApi().gateway.get(
    `${API_PREFIXES.ACCOUNT}/accounts/${accountId}/contacts?Type=customer`,
  )

  return response?.data
}

export const fetchEntitiesStatistics = async () => {
  try {
    const response = await commonApi().gateway.get(`${API_PREFIXES.WALLET}/statistics/currentuser`)

    return response.data
  } catch (error) {
    console.error('Error fetching entities statistics :', error)
  }
}

export const fetchFavoriteEntities = async (): Promise<
  Entity[] | undefined
> => {
  try {
    const response = await commonApi().gateway.get(
      `${API_PREFIXES.WALLET}/favorites/currentuser`,
    )

    return response.data
  } catch (error) {
    console.error('Error fetching favorites entities :', error)
  }

  return []
}

export const manageFavoriteEntities = async (
  accountId: number,
  isFavorite: boolean,
): Promise<void> => {
  try {
    await commonApi().gateway.patch(
      `${API_PREFIXES.WALLET}/favorites/currentuser?accountId=${accountId}&isFavorite=${isFavorite}`,
    )
  } catch (error) {
    console.error('Error updating favorite status of the entity :', error)
  }
}

export const getCollaborators = async (
  pageNumber: number = 1,
  pageSize: number = 10,
  email: string | null = null,
  search: string | null | undefined = null,
  sort: string | undefined = undefined,
): Promise<GenericPageResponse<Contact>> => {
  try {
    const response = await commonApi().gateway.get(
      `${API_PREFIXES.WALLET}/contacts`,
      {
        params: {
          type: 'Collaborator',
          pageNumber,
          pageSize,
          email,
          search,
          sort,
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
  updates: { [key: string]: string | selectedRoleId | null },
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
  const response = await commonApi().gateway.patch(updateCollaboratorUrl, requestBodyJson, { headers })
  return response.data
}

export const getRoles = async (
  contactType: string,
): Promise<Role[]> => {
  try {
    const response = await commonApi().gateway.get(`${API_PREFIXES.WALLET}/personas/${contactType}`)
    return response?.data
  } catch (error) {
    handleRequestError('fetching roles', error)
    return []
  }
}

export const getPermissions = async (
  personasId: number,
): Promise<[]> => {
  try {
    const response = await commonApi().gateway.get(`${API_PREFIXES.WALLET}/permissions/${personasId}`)
    return response?.data
  } catch (error) {
    handleRequestError('fetching parmissions', error)
    return []
  }
}
