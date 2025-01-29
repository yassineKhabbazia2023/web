import { getRandomColor } from '@app/helper'
import type { Entity } from '@pulse/common/types'

const DEFAULT_ENTITY: Entity = {
  accountId: 0,
  accountNumber: '',
  legalName: '',
  color: 'orange',
}

export const getDefaultEntity = (firstEntity?: Entity): Entity => {
  const storedSelectedEntity = localStorage.getItem('selected-entity')
  if (storedSelectedEntity) {
    return JSON.parse(storedSelectedEntity)
  }
  if (firstEntity) {
    return {
      ...firstEntity,
      color: getRandomColor(firstEntity.accountId),
    }
  }

  return DEFAULT_ENTITY
}
