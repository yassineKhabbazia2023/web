import { WidgetName, WidgetSize } from '../../../enums/widgets.enums'
import { WidgetsManager } from '../../../managers/widgets.manager'
import type { WidgetDefinition } from '../../../types/widget.types'
import { defineAsyncComponent, type App } from 'vue'

export default {
  install(app: App, _options: any) {
    const widgetDefinition: WidgetDefinition = {
      name: WidgetName.DIGILAB,
      size: WidgetSize.ONE_CELL,
    }
    // add the widget as a component to the Vue app
    app.component(widgetDefinition.name, defineAsyncComponent(() => import('./Digilab.widget.vue')))
    // register the widget in the WidgetsManager
    WidgetsManager.registerWidget(widgetDefinition)
  },
}
