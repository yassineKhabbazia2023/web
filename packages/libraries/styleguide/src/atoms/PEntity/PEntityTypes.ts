import type { PAvatarProps } from '../PAvatar/PAvatarTypes'
import type { Component } from 'vue'

export interface PEntityProps {
  pContent: string
  pIcon?: Component | string
  pType: 'primary' | 'secondary'
  pIconShape?: PAvatarProps['pShape']
  pIconColor?: PAvatarProps['pColor']
  pIconType?: PAvatarProps['pType']
  pBold?: boolean
  pSelected?: boolean
}
