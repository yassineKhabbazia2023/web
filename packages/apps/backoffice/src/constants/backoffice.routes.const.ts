import { AdminRouteNames } from './backoffice-route-names.enum'

export const BACKOFFICE_ROUTES = {
  root: { path: '/', name: AdminRouteNames.ROOT },
  anonymous: {
    login: { path: '', name: AdminRouteNames.LOGIN },
  },
  authenticated: {
    root: { path: '', name: AdminRouteNames.AUTHENTICATED },
    appSettings: { path: 'app-settings', name: AdminRouteNames.APP_SETTINGS },
    azureDevops: { path: 'azure-devops', name: AdminRouteNames.AZURE_DEVOPS },
    aiMonitoring: { path: 'ai-monitoring', name: AdminRouteNames.AI_MONITORING },
    agentsDashboard: { path: 'agents-dashboard', name: AdminRouteNames.AGENTS_DASHBOARD },
  },
}
