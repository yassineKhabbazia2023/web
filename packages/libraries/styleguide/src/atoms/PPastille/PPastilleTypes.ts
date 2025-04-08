import type { PIconProps } from '../PIcon/PIcon.types'

export interface PPastilleProps {
  pType?: 'default' | 'warning' | 'persian' | 'white'
  pSize?: 'default' | 'small'
  pDisabled?: boolean
  pIconName?: PIconProps['pName']
}
