import type { App } from 'vue'
import { routes, pennylaneAccountingRoutes } from './routes/ged.routes'
import { RoutesManager } from '@pulse/common/managers'
import EmailPnlWidget from '@ged/widgets/email-pennylane/email-pennylane.widget'
import { SidebarManager } from '@pulse/shared/manager'

export default {
  install(app: App, options: any) {
    const { router } = options

    RoutesManager.addRoutesToEntity(router, routes)
    RoutesManager.addRoutesToPennylaneAccounting(router, pennylaneAccountingRoutes)

    // register GED widgets
    app.use(EmailPnlWidget, options)

    // Register sidebar menu item
    SidebarManager.register({
      id: 'documents-legacy',
      title: 'shared.sidebar.documents',
      icon: 'folder',
      route: (entityId) => `/dossier/${entityId}/ged`,
      shouldDisplay: (ctx) =>
        ctx.permissions.hasGed &&
        !ctx.permissions.hasPennylaneAccounting &&
        !ctx.permissions.hasSocialManagementV2,
      order: 2,
    })
  },
}
