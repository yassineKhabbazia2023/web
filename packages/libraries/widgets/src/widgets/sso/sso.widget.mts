import { WidgetName, WidgetSize } from '../../enums/widgets.enums'
import { WidgetsManager } from '../../managers/widgets.manager'
import type { WidgetDefinition } from '../../types/widget.types'
import { defineAsyncComponent, type App } from 'vue'

export default {
  install(app: App, _options: any) {
    const widgetDefinition: WidgetDefinition = {
      name: WidgetName.SSO,
      size: WidgetSize.THREE_SPANS,
    }
    // add the widget as a component to the Vue app
    app.component(widgetDefinition.name, defineAsyncComponent(() => import('./SSO.widget.vue')))
    // register the widget in the WidgetsManager
    WidgetsManager.registerWidget(widgetDefinition)
  },
}
