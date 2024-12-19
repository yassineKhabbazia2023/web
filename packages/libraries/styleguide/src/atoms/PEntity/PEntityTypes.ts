import type { PAvatarProps } from '../PAvatar/PAvatarTypes'
import type { Component } from 'vue'
import type { IconName } from '../../types/IconName.types'

export interface PEntityProps {
  pContent: string
  pIcon?: Component | string // @deprecated, TODO replace pIcon by pIconName
  pIconName?: IconName
  pType: 'primary' | 'secondary'
  pIconShape?: PAvatarProps['pShape']
  pIconColor?: PAvatarProps['pColor']
  pIconType?: PAvatarProps['pType']
  pBold?: boolean
  pSelected?: boolean
}
