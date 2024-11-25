import type { GlobalStates } from '../../utils/types/states'
import type { PIconProps } from '../PIcon/PIcon.types'

export type PAlertProps = {
  pType?: Omit<'default', GlobalStates> | 'main'
  pIcon?: PIconProps['pName']
  pClosable?: boolean
}
