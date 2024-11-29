import { AppColors } from '@pulse/styleguide'
import type { Status } from '@app/schedule/models/Deadline'
import type { IconName } from '@pulse/styleguide/types'

export type StatusIcon = {
  color: AppColors
  iconName: IconName
}

export type IconProps = {
  status: Status
}
