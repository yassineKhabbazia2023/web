import type { ProxyMode } from './proxy.type.ts'

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

  /**
   * Configures the recording/replay proxy middleware on the dev server.
   * The proxy only mounts when the `VITE_PROXY_ENABLED=true` env var is set (see the `dev:proxy`
   * npm script), so a plain `dev` never pays for it even though a default `target` is configured.
   * Once enabled, it intercepts requests on `pathPrefix` with four modes: 'passthrough' (record),
   * 'mock' (replay only), 'hybrid' (replay then record), 'remote-first' (record then replay on
   * remote failure). The control UI is served at `/__proxy__`.
   */
  proxy?: {
    /** Remote API base URL to forward to (overridden by env VITE_PROXY_TARGET). */
    target?: string
    /** Absolute folder where recorded mocks are persisted. Defaults to `<repo>/packages/apps/e2e-mocks/recorded`. */
    recordedDir?: string
    /** Initial mode, overridden by persisted `.proxy-mode.json`. @default 'remote-first' */
    defaultMode?: ProxyMode
    /** URL prefix the proxy intercepts. @default '/proxy-api' */
    pathPrefix?: string
    /** Whether to record on hybrid cache miss. @default true */
    recordOnHybridMiss?: boolean
    /** Timeout (ms) of the remote call in 'remote-first' mode before falling back to the mock. @default 10000 */
    remoteTimeoutMs?: number
  }
}
