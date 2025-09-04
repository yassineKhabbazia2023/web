import type { PToolboxItemProps } from '@pulse/styleguide/types'
import type { DocumentAction } from '@ged/modules/Documents/DocumentsTypes'

export interface ToolboxLineWithOrder {
  toolboxLine: PToolboxItemProps<DocumentAction>
  order: number
}
