import type { App } from 'vue'
import PennylaneDocumentsWidget from './widgets/pennylane-documents/pennylane-documents.widget'
import { routes, pennylaneAccountingRoutes } from './routes/pennylane.routes'
import { RoutesManager } from '@pulse/common/managers'
import { SidebarManager } from '@pulse/shared/manager'

export default {
  install(app: App, options: any) {
    const { router } = options

    app.use(PennylaneDocumentsWidget, options)

    RoutesManager.addRoutesToEntity(router, routes)
    RoutesManager.addRoutesToPennylaneAccounting(router, pennylaneAccountingRoutes)

    // Register sidebar menu items
    SidebarManager.register({
      id: 'pennylane-accounting-v2',
      title: 'shared.sidebar.pennylaneAccounting',
      icon: 'archive',
      route: (entityId) => `/dossier/${entityId}/comptabilite/rydge`,
      shouldDisplay: (ctx) =>
        ctx.permissions.hasPennylaneAccounting &&
        ctx.permissions.hasPennylaneAccountingGedV2,
      hasSubmenuSelected: (ctx) => ctx.currentRoute.path === ctx.legacyGedPath,
      featureName: 'documents comptables',
      order: 3,
    })

    SidebarManager.register({
      id: 'pennylane-accounting-legacy',
      title: 'shared.sidebar.pennylaneAccounting',
      icon: 'archive',
      route: (_entityId, ctx) => ctx.legacyGedPath,
      shouldDisplay: (ctx) =>
        ctx.permissions.hasPennylaneAccounting &&
        !ctx.permissions.hasPennylaneAccountingGedV2 &&
        ctx.permissions.hasPennylaneAccountingGedLegacy,
      featureName: 'documents comptables',
      order: 4,
    })

    SidebarManager.register({
      id: 'social-management',
      title: 'shared.sidebar.pennylaneSocialManagement',
      icon: 'archive',
      route: (entityId) => `/dossier/${entityId}/gestion-sociale`,
      shouldDisplay: (ctx) => ctx.permissions.hasSocialManagementV2,
      featureName: 'documents gestion sociale',
      order: 5,
    })
  },
}
