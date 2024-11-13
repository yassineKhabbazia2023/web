// eslint-disable-next-line import/extensions
import type { PIconProps } from '../PIcon/PIcon.types'

export interface PPastilleProps {
  pType?: 'default' | 'warning' | 'persian'
  pSize?: 'default' | 'small'
  pDisabled?: boolean
  pIconName?: PIconProps['pName']
}
