import { AmplitudeService } from '@pulse/common/services/amplitude'
import { WidgetClickProp, WidgetProp } from '@pulse/widgets/types'

export const widgetClick = (param: WidgetClickProp) => {
  const widgetProp: WidgetProp = {
    feature_name: param.featureName,
    widget_name: param.widgetName,
  }
  if (param.widgetItemClicked !== undefined) {
    widgetProp['widget_item_clicked'] = param.widgetItemClicked
  }
  AmplitudeService.track(param.event, widgetProp)
}
