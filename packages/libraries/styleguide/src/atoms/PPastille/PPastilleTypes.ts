import type { PIconProps } from '../PIcon/PIcon.types'

export interface PPastilleProps {
  pType?: 'default' | 'warning' | 'dark-green' | 'white'
  pSize?: 'default' | 'small' | 'x-small'
  pDisabled?: boolean
  pIconName?: PIconProps['pName']
}
