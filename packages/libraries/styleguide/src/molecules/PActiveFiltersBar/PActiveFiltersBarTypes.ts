import type { IconName } from '@styleguide/types'
import type { PFilterOptionColor } from '../../atoms/PFilterOption/PFilterOptionTypes'

export interface ActiveFilterItem {
  pCode: string
  pContent: string
  pColor: PFilterOptionColor
  pValue?: string | number
  pIconName?: IconName
}

export interface PActiveFiltersBarProps {
  pFilters: ActiveFilterItem[]
  pMaxVisible?: number
}
