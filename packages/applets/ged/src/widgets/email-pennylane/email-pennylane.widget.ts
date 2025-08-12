import { WidgetName } from '@pulse/widgets/enums'
import { defineAsyncComponent, type App } from 'vue'

export default {
  install(app: App, _options: any) {

    app.component(WidgetName.EMAIL_PENNYLANE, defineAsyncComponent(() => import('./email-pennylane.vue')))
  },
}
