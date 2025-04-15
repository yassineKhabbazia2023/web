import type { PAvatarProps } from '../../atoms/PAvatar/PAvatarTypes'
import type { IconName } from '../../types/IconName.types'
import { AvatarRoles } from '../../utils/avatar.roles'

export interface PDoubleTextProps {
  pIconName?: IconName
  pProfile: string
  pTitle?: string
  pContent?: string
  pIconShape?: PAvatarProps['pShape']
  pIconColor?: PAvatarProps['pColor']
  pIconType?: PAvatarProps['pType']
  pType: 'primary' | 'secondary'
  pSelected?: boolean
  pDisabled?: boolean
  pBold?: boolean
  pAvatarRole?: AvatarRoles
}
