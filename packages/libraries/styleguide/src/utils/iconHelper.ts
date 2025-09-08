import { defineAsyncComponent } from 'vue'
import { capitalize } from './text'
import type { IconName } from '../types/IconName.types'
import { PIXCircle } from '../atoms/PIcon/components'

export const getIconComponent = (iconName?: IconName) =>
  iconName
    ? defineAsyncComponent({
      loader: () => import(`../atoms/PIcon/components/PI${capitalize(iconName)}.vue`),
      errorComponent: PIXCircle,
    })
    : undefined
