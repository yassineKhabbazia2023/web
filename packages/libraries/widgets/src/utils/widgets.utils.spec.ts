import { widgetClick } from './widgets.utils'
import { AmplitudeService } from '@pulse/common/services/amplitude'
import { AmplitudeEvent, AmplitudeFeatureName } from '@pulse/common/enums'
import { WidgetItemClicked, WidgetName } from '@pulse/widgets/enums'

describe('widgetClick', () => {
  it('should call AmplitudeService.track with basic widget props', () => {
    widgetClick({
      event: AmplitudeEvent.FEATURE_CONSULTED,
      widgetName: WidgetName.PENNYLANE_INTRO,
      featureName: AmplitudeFeatureName.HOMEPAGE,
      widgetItemClicked: WidgetItemClicked.PENNYLANE_CONNECTED,
    })

    expect(AmplitudeService.track).toHaveBeenCalledWith(AmplitudeEvent.FEATURE_CONSULTED, {
      feature_name: AmplitudeFeatureName.HOMEPAGE,
      widget_name: WidgetName.PENNYLANE_INTRO,
      widget_item_clicked: WidgetItemClicked.PENNYLANE_CONNECTED,
    })
  })

  it('should call amplitude event with string widgetItemClicked', () => {
    widgetClick({
      event: AmplitudeEvent.FEATURE_CONSULTED,
      widgetName: WidgetName.PENNYLANE_INTRO,
      featureName: AmplitudeFeatureName.HOMEPAGE,
      widgetItemClicked: 'clicked',
    })
    expect(AmplitudeService.track).toHaveBeenCalledWith(AmplitudeEvent.FEATURE_CONSULTED, {
      feature_name: AmplitudeFeatureName.HOMEPAGE,
      widget_name: WidgetName.PENNYLANE_INTRO,
      widget_item_clicked: 'clicked',
    })
  })
})
