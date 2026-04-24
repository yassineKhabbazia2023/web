import type { PAvatarProps, IconName } from '@pulse/styleguide/types'

export interface WidgetContact {
  firstname: string
  lastname: string
  role: string
  phoneNumber: string
  email: string
  iconName?: IconName
  pAvatarProps?: PAvatarProps
}

export interface ContactsWidgetProps {
  contacts?: WidgetContact[]
}
