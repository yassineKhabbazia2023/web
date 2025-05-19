import { WidgetsManager } from '../../managers/widgets.manager'
import { defineAsyncComponent, type App } from 'vue'

export default {
  install(app: App, _options: any) {
    const widgetName = 'WidgetTest'
    // add the widget as a component to the Vue app
    app.component(widgetName, defineAsyncComponent(() => import('./WidgetTest.widget.vue')))
    // register the widget for future use
    WidgetsManager.registerWidget(widgetName)
  },
}
