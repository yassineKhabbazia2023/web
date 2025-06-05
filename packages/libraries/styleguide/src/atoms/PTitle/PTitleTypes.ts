import type { IconName } from '../../types/IconName.types'
import { AppColors } from '../../utils/AppColorsEnum'

export interface PTitleProps {
  pIconName?: IconName
  pIconSize?: string
  pIconColor?: AppColors
  pTitle?: string
}
