import { logger } from '@pulse/core'
import { commonApi, commonStore as store } from '@pulse/common'
import type { Entity } from '@pulse/common/types'
import { API_PREFIXES } from '../config'
import { getRandomColor } from '@app/helper'

export const fetchEntities = async (pageSize?: number): Promise<any> => {
  try {
    const response = await commonApi().gateway.get(`${API_PREFIXES.ACCOUNT}/accounts/currentuser`, {
      params: {
        pageSize,
      },
    })

    return response.data
  } catch (error) {
    logger.error('Error fetching entities :', error)
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
    logger.error('Error fetching favorites entities :', error)
  }

  return []
}
