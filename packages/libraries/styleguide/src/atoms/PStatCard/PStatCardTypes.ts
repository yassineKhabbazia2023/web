import type { IconName } from '../../types/IconName.types'

export interface PStatCardProps {
  pTitle: string
  pValue: string
  pDescription?: string
  pIcon?: IconName
  pBackgroundClass?: string
  pAccentClass?: string
}
