import { getRandomColor } from '@app/helper'
import type { Entity } from '@pulse/Common'

export const getDefaultEntity = (firstEntity: Entity): Entity => {
  const storedSelectedEntity = localStorage.getItem('selected-entity')
  const defaultEntity: Entity = storedSelectedEntity
    ? JSON.parse(storedSelectedEntity)
    : {
        ...firstEntity,
        color: getRandomColor(firstEntity.accountId),
      }

  return defaultEntity
}
