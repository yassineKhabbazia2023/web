import { WidgetName, WidgetSize } from '../../../enums/widgets.enums'
import { WidgetsGridManager } from '../../../managers/widgets-grid.manager'
import type { WidgetGridDefinition } from '../../../types/widget.types'
import { defineAsyncComponent, type App } from 'vue'

export default {
  install(app: App, _options: any) {
    const widgetGridDefinition: WidgetGridDefinition = {
      name: WidgetName.RSS_NEWS,
      size: WidgetSize.TWO_SPANS,
    }
    // add the widget as a component to the Vue app
    app.component(widgetGridDefinition.name, defineAsyncComponent(() => import('./RssNews.widget.vue')))
    // register the widget in the WidgetsGridManager
    WidgetsGridManager.registerWidget(widgetGridDefinition)
  },
}
