import type { Component } from 'vue'
import type { PAvatarProps } from '../../atoms/PAvatar/PAvatarTypes'

export interface PDoubleTextProps {
  pIcon?: Component | string
  pProfile: string
  pTitle: string
  pContent: string
  pIconShape?: PAvatarProps['pShape']
  pIconColor?: PAvatarProps['pColor']
  pIconType?: PAvatarProps['pType']
  pType: 'primary' | 'secondary'
  pSelected?: boolean
  pDisabled?: boolean
  pBold?: boolean
}
