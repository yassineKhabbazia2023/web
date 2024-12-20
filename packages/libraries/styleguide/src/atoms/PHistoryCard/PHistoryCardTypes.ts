import type { IconName } from '../../types/IconName.types'

export interface PHistoryCardProps {
  pDate: string
  pType: string
  pEntityIconName?: IconName
  pEntity?: string
  pTooltipEntityContent?: string
}
