import { EntityStatus } from '@entities/modules/wallet/enums'
import { IconName, PFilterOptionProps } from '@pulse/styleguide/types'

export const ENTITY_STATUS_COLOR: Record<EntityStatus, PFilterOptionProps['pColor']> = {
  [EntityStatus.TO_DEPLOY]: 'warning',
  [EntityStatus.IN_PROGRESS]: 'light-blue',
  [EntityStatus.CONNECTED]: 'success',
}

export const ENTITY_STATUS_ICON_NAME: Record<EntityStatus, IconName> = {
  [EntityStatus.TO_DEPLOY]: 'arrowUpCircle',
  [EntityStatus.IN_PROGRESS]: 'arrowRepeat',
  [EntityStatus.CONNECTED]: 'checkCircle',
}

export const FAVORITE_SORT_FIELD = 'isFavorite'

