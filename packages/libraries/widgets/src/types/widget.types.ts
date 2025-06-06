import { WidgetName, WidgetSize } from '../enums/widgets.enums'

export type WidgetDefinition = {
  name: WidgetName
  size?: WidgetSize
}
