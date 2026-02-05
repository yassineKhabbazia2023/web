import type { IconName } from '../../types/IconName.types'
import type { PTagProps } from '../PTag/PTagTypes'

export interface PHistoryCardProps {
  pDate: string
  pDateColor?: PTagProps['pColor']
  pTime?: string
  pType: string
  pDescription?: string
  pEntityIconName?: IconName
  pEntity?: string
  pTooltipEntityContent?: string
  pHasAccordion?: boolean
}
