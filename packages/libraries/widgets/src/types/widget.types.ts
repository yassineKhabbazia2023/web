import { WidgetName, WidgetSize } from '../enums/widgets.enums'
import type { Permission } from '@pulse/common/types'

export type WidgetGridDefinition = {
  name: WidgetName
  size?: WidgetSize
  customerPermission?: Permission[]
}
