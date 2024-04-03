import type { Collab } from '@/pages/folder/pages/collaborators/types'
import { type Entity, commonApi } from '@kpmg/common'
import { API_PREFIXES } from '../config'

export const getCollaboratorsByIdEntity = async (
  accountId: number,
): Promise<Collab[]> => {
  const response = await commonApi().gateway.get(
    `${API_PREFIXES.CUSTOMER_WALLET}/accounts/${accountId}/contacts?Type=Collaborator`,
  )

  return response?.data
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
