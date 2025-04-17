import type { Entity } from '@pulse/common/types'

export const getDefaultEntity = (firstEntity: Entity): Entity => {
  const storedSelectedEntity = localStorage.getItem('selected-entity')
  if (storedSelectedEntity) {
    return JSON.parse(storedSelectedEntity)
  }
  return {
    ...firstEntity,
  }
}
