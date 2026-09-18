import { defineAsyncComponent, type App } from 'vue'
import type { WidgetGridDefinition } from '../../../types/widget.types'
import { WidgetName, WidgetScope, WidgetSize } from '../../../enums/widgets.enums'
import { WidgetsGridManager } from '../../../managers/widgets-grid.manager'

export default {
  install(app: App, _options: any) {
    const widgetGridDefinition: WidgetGridDefinition = {
      name: WidgetName.KEY_MOMENTS,
      // Takes a row of its own at the top of the grid — the card itself stops
      // at half the width, it is an announcement and not a dashboard
      size: WidgetSize.THREE_SPANS,
      // The firm reads and arbitrates the key moment from the report itself; the
      // widget only exists to tell the client that there is one to read
      scope: [WidgetScope.CUSTOMER],
    }
    app.component(widgetGridDefinition.name, defineAsyncComponent(() => import('./key-moments.widget.vue')))
    WidgetsGridManager.registerWidget(widgetGridDefinition)
  },
}
