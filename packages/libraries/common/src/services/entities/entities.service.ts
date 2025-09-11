import { commonApi } from '@pulse/common'
import type { EntitySummary } from '@pulse/common/types'

export async function fetchEntityById(entityId: number) {
  const { data } = await commonApi().gateway.get<EntitySummary>(`connect/api/accounts/${entityId}/summary`)

  return data
}
