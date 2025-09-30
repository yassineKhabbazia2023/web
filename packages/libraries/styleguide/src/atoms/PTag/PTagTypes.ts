import type { IconName } from '../../types/IconName.types'

export interface PTagProps {
  pColor?: '' // empty is same as default
    | 'default'
    | 'success'
    | 'green'
    | 'dark-green'
    | 'warning'
    | 'orange'
    | 'danger'
    | 'red'
    | 'info'
    | 'light-green'
    | 'light-blue'
    | 'blue'
    | 'dark-blue'
    | 'tranquil'
    | 'purple'
    | 'disabled'
    | 'lighter-gray'
    | 'light-gray'
    | 'gray'
    | 'outline-green'
  pSize?: 'large' | 'default' | 'small' | ''
  pContent?: string
  pIconLeftName?: IconName
  pIconRightName?: IconName
  pRound?: boolean
  pDisableTransitions?: boolean
  pClosable?: boolean
}
