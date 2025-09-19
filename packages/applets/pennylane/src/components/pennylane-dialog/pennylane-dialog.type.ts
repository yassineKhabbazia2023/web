import type { IconName } from '@pulse/styleguide/types'

export interface PennylaneDialogProps {
  isOpened: boolean
  iconName: IconName
  title: string
  subtitle: string
  closeButtonLabel: string
}
