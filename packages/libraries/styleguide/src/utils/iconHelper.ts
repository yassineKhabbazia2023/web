import { capitalize } from './text'
import { iconResolver } from './iconResolver'
import type { IconName } from '../types/IconName.types'

export const getIconComponent = (iconName?: IconName) =>
  iconName
    ? iconResolver(`PI${capitalize(iconName)}`)
    : undefined
