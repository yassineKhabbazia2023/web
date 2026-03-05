import { logger } from '@pulse/toolbox'
import { api } from '@pulse/common/api'
import type { EntitySummary, Entity, QueryResult } from '@pulse/common/types'
import { API_PREFIXES } from '@pulse/common/constants'

export const DEFAULT_ENTITIES = {
  items: [],
  currentPage: 0,
  totalPage: 0,
  totalItems: 0,
}

export const fetchEntities = async (pageSize?: number): Promise<QueryResult<Entity>> => {
  try {
    const response = await api.gateway.get(`${API_PREFIXES.ACCOUNT}/accounts/currentuser`, {
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

export async function fetchEntityById(entityId: number) {
  const { data } = await api.gateway.get<EntitySummary>(`connect/api/accounts/${entityId}/summary`)

  return data
}
