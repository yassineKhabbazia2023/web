import { defineAsyncComponent, type App } from 'vue'
import type { WidgetGridDefinition } from '../../../types/widget.types'
import { WidgetName, WidgetSize } from '../../../enums/widgets.enums'
import { WidgetsGridManager } from '../../../managers/widgets-grid.manager'

export default {
  install(app: App, _options: any) {
    const widgetGridDefinition: WidgetGridDefinition = {
      name: WidgetName.DIGILAB,
      size: WidgetSize.ONE_CELL,
    }
    // add the widget as a component to the Vue app
    app.component(widgetGridDefinition.name, defineAsyncComponent(() => import('./digi-lab.widget.vue')))
    // register the widget in the WidgetsGridManager
    WidgetsGridManager.registerWidget(widgetGridDefinition)
  },
}
