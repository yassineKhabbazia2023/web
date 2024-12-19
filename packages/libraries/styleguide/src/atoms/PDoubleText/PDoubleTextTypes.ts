import type { Component } from 'vue'
import type { PAvatarProps } from '../../atoms/PAvatar/PAvatarTypes'
import type { IconName } from '../../types/IconName.types'

export interface PDoubleTextProps {
  pIcon?: Component | string // TODO replace this deprecated props by pIconName
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
}
