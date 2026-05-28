/**
 * Supported application types for E2E testing
 * - 'customer': Customer app with standard handlers (isCustomer: true)
 * - 'collaborator': Collaborator app with standard handlers (isCustomer: false)
 * - 'backoffice': Backoffice app with app-settings handlers and MSAL shim
 */
export type AppType = 'customer' | 'collaborator' | 'backoffice'

/**
 * Options for the E2E Vite plugin
 */
export type E2EPluginOptions = {
  /**
   * The app type to use for E2E testing
   * @default 'customer'
   */
  app?: AppType
}
