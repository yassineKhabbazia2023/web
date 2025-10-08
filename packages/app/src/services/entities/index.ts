import { logger } from '@pulse/toolbox'
import { commonApi } from '@pulse/common'
import type { Entity, QueryResult } from '@pulse/common/types'
import { API_PREFIXES } from '@pulse/common/constants'

export const DEFAULT_ENTITIES = {
  items: [],
  currentPage: 0,
  totalPage: 0,
  totalItems: 0,
}

export const DEFAULT_FAVORITE_ENTITIES = []

export const fetchEntities = async (pageSize?: number): Promise<QueryResult<Entity>> => {
  try {
    const response = await commonApi().gateway.get(`${API_PREFIXES.ACCOUNT}/accounts/currentuser`, {
      params: {
        pageSize,
      },
    })

    return response.data
  } catch (error) {
    logger.error('Error fetching entities :', error)
    // return default result to avoid breaking the app
    return DEFAULT_ENTITIES
  }
}

export const fetchFavoriteEntities = async (): Promise<Entity[]> => {
  try {
    const response = await commonApi().gateway.get(
      `${API_PREFIXES.WALLET}/favorites/currentuser`,
    )

    return response.data
  } catch (error) {
    logger.error('Error fetching favorite entities:', error)
    // return default result to avoid breaking the app
    return DEFAULT_FAVORITE_ENTITIES
  }
}
