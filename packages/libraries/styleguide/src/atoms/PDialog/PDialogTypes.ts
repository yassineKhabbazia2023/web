import type { IconName } from '@pulse/styleguide/types'
export interface PDialogProps {
  modelValue: boolean
  pLockScroll?: boolean
  pTitle?: string
  pWidth?: string | number
  pModal?: boolean
  pCenter?: boolean
  pBeforeClose?: Function
  pAlignCenter?: boolean
  pShowClose?: boolean
  pDestroyOnClose?: boolean
  pCloseIconName?: IconName
  pFullscreen?: boolean
  pAppendToBody?: boolean
}
