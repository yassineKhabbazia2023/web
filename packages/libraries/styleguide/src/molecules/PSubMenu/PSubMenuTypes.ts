import type { IconName } from '../../types/IconName.types'

export interface PSubMenuProps {
  pIndex: string
  pPopperClass?: string
  pPopperOffset?: number
  pShowTimeout?: number
  pHideTimeout?: number
  pDisabled?: boolean
  pIconName?: IconName
}
