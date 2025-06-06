import { commonApi } from '@pulse/common'
import type { Entity } from '@pulse/common/types'

export async function fetchEntityById(entityId: number): Promise<Entity> {
  const { data } = await commonApi().gateway.get(`account/api/accounts/${entityId}/summary`)
  return data
}
