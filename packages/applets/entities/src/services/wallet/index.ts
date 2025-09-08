import { logger } from '@pulse/core'
import type { Collab } from '@entities/pages/folder/pages/collaborators/types'
import { handleRequestError } from '@entities/helper/helper'
import { API_PREFIXES } from '@entities/common/config/services'
import { commonApi } from '@pulse/common'
import type { Entity } from '@pulse/common/types'
import type { Contact } from '../contact/contactTypes'
import type { Contact as userContact } from '@entities/common/types'
import type { Role } from '@entities/pages/wallet/pages/collaborators/components/CollabRightsDrawer/CollabRightsDrawerTypes'
import { EntitiesStatistics } from './serviceWalletTypes'
import { ContactType } from '@pulse/common/enums'

const defaultValue = { items: [], currentPage: 1, totalPages: 1, totalItems: 0 }
export interface GenericPageResponse<T> {
  items: T[]
  currentPage: number
  totalItems: number
  totalPages?: number
  totalPage?: number // due to getCollaboratorsByIdEntity :/
}

export const getCollaboratorsByIdEntity = async (
  accountId: number,
  queryParams?: URLSearchParams,
): Promise<GenericPageResponse<Collab>> => {
  const response = await commonApi().gateway.get(
    `${API_PREFIXES.CUSTOMER_WALLET}/accounts/${accountId}/contacts?Type=Collaborator&${queryParams}`,
  )

  return response?.data
}

export async function fetchAccountCustomers(
  accountId: number,
  queryParams?: any,
) {
  const searchParams = new URLSearchParams({
    ...queryParams,
    Type: 'customer',
  })
  return await fetchAccountContacts(accountId, searchParams)
}

export async function fetchAccountContacts(
  accountId: number,
  searchParams: URLSearchParams,
): Promise<GenericPageResponse<userContact>> {
  const url = `${API_PREFIXES.ACCOUNT}/accounts/${accountId}/contacts?${searchParams}`
  const response = await commonApi().gateway.get(url)

  return response?.data
}

export async function fetchCustomers(searchParams: URLSearchParams) {
  const url = `${API_PREFIXES.CUSTOMER_WALLET}/customers/currentuser?${searchParams}`
  const { data } = await commonApi().gateway.get(url)

  return data
}

export const fetchEntitiesStatistics = async () => {
  try {
    const response = await commonApi().gateway.get<EntitiesStatistics>(`${API_PREFIXES.WALLET}/statistics/currentuser`)

    return response.data
  } catch (error) {
    logger.error('Error fetching entities statistics :', error)
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
    logger.error('Error fetching favorites entities :', error)
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
    logger.error('Error updating favorite status of the entity :', error)
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
          type: ContactType.COLLABORATOR,
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
  const response = await commonApi().gateway.patch(updateCollaboratorUrl, requestBodyJson, { headers })
  return response.data
}

export const fetchContactRoles = async (
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
