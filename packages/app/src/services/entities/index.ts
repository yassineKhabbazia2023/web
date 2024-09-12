import { commonApi, commonStore as store } from '@kpmg/common'
import type { Entity } from '@kpmg/common'
import { API_PREFIXES } from '../config'
import { getRandomColor } from '@/helper'

export const fetchEntities = async (): Promise<any> => {
  try {
    const response = await commonApi().gateway.get(
      `${API_PREFIXES.ACCOUNT}/accounts/currentuser`,
    )

    if (response?.data) {
      return response.data
    }
  } catch (error) {
    console.error('Error fetching entities :', error)
  }

  return []
}

export const fetchFavoriteEntities = async (): Promise<Entity[]> => {
  try {
    const response = await commonApi().gateway.get(
      `${API_PREFIXES.WALLET}/favorites/currentuser`,
    )

    if (response?.data?.length) {
      const favoriteEntities = response.data.map(
        (item: Entity) => ({
          ...item,
          color: getRandomColor(item.accountId),
        }),
      )
      store().$patch({
        user: {
          entities: {
            favorites: favoriteEntities,
          },
        },
      })

      return response.data
    }
  } catch (error) {
    console.error('Error fetching favorites entities :', error)
  }

  return []
}
