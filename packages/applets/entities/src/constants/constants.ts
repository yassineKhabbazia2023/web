import { EntityStatus } from '@entities/pages/wallet/components/Filters/FiltersTypes'
import { IconName, PFilterOptionProps } from '@pulse/styleguide/types'

export const ENTITY_STATUS_COLOR: Record<EntityStatus, PFilterOptionProps['pColor']> = {
  [EntityStatus.TO_DEPLOY]: 'warning',
  [EntityStatus.IN_PROGRESS]: 'fuschia',
  [EntityStatus.CONNECTED]: 'success',
}

export const ENTITY_STATUS_ICON_NAME: Record<EntityStatus, IconName> = {
  [EntityStatus.TO_DEPLOY]: 'arrowUpCircle',
  [EntityStatus.IN_PROGRESS]: 'arrowRepeat',
  [EntityStatus.CONNECTED]: 'checkCircle',
}

