import { logger } from '@pulse/toolbox'
import type { Contact as userContact } from '@entities/types'
import { API_PREFIXES } from '@pulse/common/constants'
import { commonApi } from '@pulse/common'
import type { Entity } from '@pulse/common/types'
import { EntitiesStatistics } from './serviceWalletTypes'
import type { GenericPageResponse } from '../collaborator/collaborator.type'

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
