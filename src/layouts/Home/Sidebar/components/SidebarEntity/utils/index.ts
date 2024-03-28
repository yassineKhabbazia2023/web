import { getRandomColor } from '@/helper'
import type { Entity } from '@kpmg/common'

export const getDefaultEntity = (firstEntity: any): Entity => {
  const storedSelectedEntity = localStorage.getItem('selected-entity')
  /**
   * For now, we are obliged to format the data.
   * Another PR will be created to update the data model for Entity
   */
  const defaultEntity: Entity = storedSelectedEntity
    ? JSON.parse(storedSelectedEntity)
    : {
        name: firstEntity.legalName,
        idAccount: firstEntity.accountId,
        ibs: firstEntity.accountNumber,
        color: getRandomColor(),
      }

  return defaultEntity
}
