import type { App } from 'vue'
import { routes, pennylaneAccountingRoutes } from './routes/ged.routes'
import { RoutesManager } from '@pulse/common/managers'
import EmailPnlWidget from '@ged/widgets/email-pennylane/email-pennylane.widget'

export default {
  install(app: App, options: any) {
    const { router } = options

    RoutesManager.addRoutesToEntity(router, routes)
    RoutesManager.addRoutesToPennylaneAccounting(router, pennylaneAccountingRoutes)

    // register GED widgets
    app.use(EmailPnlWidget, options)
  },
}
