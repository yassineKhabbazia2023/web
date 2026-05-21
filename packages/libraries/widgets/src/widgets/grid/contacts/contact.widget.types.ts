import type { PAvatarProps, IconName } from '@pulse/styleguide/types'
import type { EntityContact } from '@pulse/common/services/contact'

export interface WidgetContact extends EntityContact {
  iconName?: IconName
  pAvatarProps?: PAvatarProps
}

export interface ContactsWidgetProps {
  contacts?: EntityContact[]
  loading?: boolean
  skeletonPlaceholderCount?: number
}
