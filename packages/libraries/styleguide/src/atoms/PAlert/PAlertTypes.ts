import type { GlobalStates } from '@styleguide/utils/types/states'
// eslint-disable-next-line import/extensions
import type { PIconProps } from '../PIcon/PIcon.types'

export type PAlertProps = {
  pType?: Omit<'default', GlobalStates> | 'main'
  pIcon?: PIconProps['pName']
  pClosable?: boolean
}
