import type { App } from 'vue'
import PennylaneDocumentsWidget from './widgets/pennylane-documents/pennylane-documents.widget'
import { routes, pennylaneAccountingRoutes } from './routes/pennylane.routes'
import { RoutesManager } from '@pulse/common/managers'

export default {
  install(app: App, options: any) {
    const { router } = options

    app.use(PennylaneDocumentsWidget, options)

    RoutesManager.addRoutesToEntity(router, routes)
    RoutesManager.addRoutesToPennylaneAccounting(router, pennylaneAccountingRoutes)
  },
}
