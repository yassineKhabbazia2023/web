import { defineAsyncComponent, type App } from 'vue'
import { WidgetName, WidgetSize } from '@pulse/widgets/enums'
import { WidgetsGridManager } from '@pulse/widgets/managers'
import type { WidgetGridDefinition } from '@pulse/widgets/types'

export default {
  install(app: App, _options: any) {
    const widgetGridDefinition: WidgetGridDefinition = {
      name: WidgetName.PENNYLANE_DOCUMENTS,
      size: WidgetSize.ONE_CELL,
    }
    // add the widget as a component to the Vue app
    app.component(widgetGridDefinition.name, defineAsyncComponent(() => import('./pennylane-documents.widget.vue')))
    // register the widget in the WidgetsGridManager
    WidgetsGridManager.registerWidget(widgetGridDefinition)
  },
}
