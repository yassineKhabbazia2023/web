import type { AmplitudeEvent, AmplitudeFeatureName } from '@pulse/common/enums'
import { WidgetItemClicked, WidgetName, WidgetScope, WidgetSize } from '../enums/widgets.enums'
import type { Permission } from '@pulse/common/types'

export type WidgetGridDefinition = {
  name: WidgetName
  size?: WidgetSize
  customerPermission?: Permission[]
  scope?: WidgetScope[]
}

export type WidgetProp = {
  feature_name: string,
  widget_name: string,
  widget_item_clicked?: string,
}

export type WidgetClickProp = {
  event: AmplitudeEvent,
  widgetName: WidgetName,
  featureName: AmplitudeFeatureName,
  widgetItemClicked?: WidgetItemClicked | string,
}
