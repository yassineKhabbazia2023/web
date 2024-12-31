import type { PAvatarProps } from '../PAvatar/PAvatarTypes'
import type { Component } from 'vue'
import type { IconName } from '../../types/IconName.types'

export interface PEntityProps {
  pContent: string
  pIconName?: IconName
  pType: 'primary' | 'secondary'
  pIconShape?: PAvatarProps['pShape']
  pIconColor?: PAvatarProps['pColor']
  pIconType?: PAvatarProps['pType']
  pBold?: boolean
  pSelected?: boolean
}
