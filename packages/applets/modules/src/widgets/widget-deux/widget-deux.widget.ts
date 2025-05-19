import { WidgetsManager } from '../../managers/widgets.manager'
import { defineAsyncComponent, type App } from 'vue'

export default {
  install(app: App, _options: any) {
    const widgetName = 'WidgetDeux'
    // add the widget as a component to the Vue app
    app.component(widgetName, defineAsyncComponent(() => import('./WidgetDeux.widget.vue')))
    // register the widget for future use
    WidgetsManager.registerWidget(widgetName)
  },
}
