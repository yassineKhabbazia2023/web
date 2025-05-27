import { WidgetName, WidgetSections, WidgetSize } from '../enums/widgets.enums'

export type WidgetDefinition = {
  name: WidgetName
  size?: WidgetSize
}

export type WidgetConfiguration = WidgetDefinition & {
  order: number,
  section: WidgetSections,
}
