import type { App } from 'vue'
import PennylaneDocumentsWidget from './widgets/pennylane-documents/pennylane-documents.widget'
import { routes } from './router/pennylane.router'
import { RoutesManager } from '@pulse/common/managers'

export default {
  install(app: App, options: any) {
    const { router } = options

    app.use(PennylaneDocumentsWidget, options)

    RoutesManager.addRoutesToEntity(router, routes)
  },
}
