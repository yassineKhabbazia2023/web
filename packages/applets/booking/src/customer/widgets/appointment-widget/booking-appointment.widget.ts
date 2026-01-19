import { defineAsyncComponent, type App } from 'vue'
import { WidgetName, WidgetScope, WidgetSize } from '@pulse/widgets/enums'
import { WidgetsGridManager } from '@pulse/widgets/managers'
import type { WidgetGridDefinition } from '@pulse/widgets/types'

export default {
  install(app: App, _options: any) {
    const widgetGridDefinition: WidgetGridDefinition = {
      name: WidgetName.BOOKING_APPOINTMENT,
      size: WidgetSize.ONE_CELL,
      scope: [WidgetScope.CUSTOMER],
    }
    // add the widget as a component to the Vue app
    app.component(widgetGridDefinition.name, defineAsyncComponent(() => import('./booking-appointment.widget.vue')))
    // register the widget in the WidgetsGridManager
    WidgetsGridManager.registerWidget(widgetGridDefinition)
  },
}
