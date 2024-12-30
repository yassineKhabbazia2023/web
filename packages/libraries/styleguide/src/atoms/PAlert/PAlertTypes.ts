import type { GlobalStates } from '../../utils/types/states'
import type { IconName } from '../../types/IconName.types'

export type PAlertProps = {
  pType?: Omit<'default', GlobalStates> | 'main'
  pIconName?: IconName // @TODO find out if this props is really used (only one occurrence)
  pClosable?: boolean
}
