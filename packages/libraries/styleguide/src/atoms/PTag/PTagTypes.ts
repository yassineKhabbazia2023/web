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
    | 'blue-pulse'
    | 'gray-100'
    | 'gray-300'
    | 'gray-500'
    | 'gray-900'
  pEffect: 'dark' | 'light' | 'plain'
  pSize?: 'large' | 'default' | 'small' | ''
  pContent?: string
  pIconLeftName?: IconName
  pIconRightName?: IconName
  pRound?: boolean
  pDisableTransitions?: boolean
  pClosable?: boolean
}
