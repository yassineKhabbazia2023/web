import { type Component } from 'vue'

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
  pContent: string
  pIconLeft?: Component | string
  pIconRight?: Component | string
  pRound?: boolean
  pDisableTransitions?: boolean
  pClosable?: boolean
}
