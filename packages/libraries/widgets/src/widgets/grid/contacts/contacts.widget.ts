import { defineAsyncComponent, type App } from 'vue'
import type { WidgetGridDefinition } from '../../../types/widget.types'
import { WidgetName, WidgetSize } from '../../../enums/widgets.enums'
import { WidgetsGridManager } from '../../../managers/widgets-grid.manager'

export default {
  install(app: App, _options: any) {
    const widgetGridDefinition: WidgetGridDefinition = {
      name: WidgetName.CONTACTS,
      size: WidgetSize.ONE_CELL,
    }
    app.component(widgetGridDefinition.name, defineAsyncComponent(() => import('./contacts.widget.vue')))
    WidgetsGridManager.registerWidget(widgetGridDefinition)
  },
}
