import { EntityStatus } from '@entities/modules/wallet/enums'
import { PFilterOptionProps } from '@pulse/styleguide/types'

export const ENTITY_STATUS_COLOR: Record<EntityStatus, PFilterOptionProps['pColor']> = {
  [EntityStatus.TO_DEPLOY]: 'warning',
  [EntityStatus.IN_PROGRESS]: 'light-blue',
  [EntityStatus.CONNECTED]: 'success',
}

export const FAVORITE_SORT_FIELD = 'isFavorite'

