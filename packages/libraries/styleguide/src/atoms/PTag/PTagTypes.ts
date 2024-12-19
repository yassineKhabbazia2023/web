import { type Component } from 'vue'
import type { IconName } from '../../types/IconName.types'

export interface PTagProps {
  pColor: ''
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'persian'
    | 'fuschia'
    | 'cyan'
    | 'amethyste'
    | 'gray-100'
    | 'gray-300'
    | 'gray-500'
    | 'gray-900'
  pEffect: 'dark' | 'light' | 'plain'
  pSize?: 'large' | 'default' | 'small' | ''
  pContent?: string
  pIconLeft?: Component | string // @deprecated, TODO replace pIconLeft by pIconLeftName
  pIconRight?: Component | string // @deprecated, TODO replace pIconRight by pIconRightName
  pIconLeftName?: IconName
  pIconRightName?: IconName
  pRound?: boolean
  pDisableTransitions?: boolean
  pClosable?: boolean
}
