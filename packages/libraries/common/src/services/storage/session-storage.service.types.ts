import type { SsoProvider } from './session-storage.service.enums'

/**
 * Context for SAML SSO flow, stored in sessionStorage between login and redirect
 */
export interface SamlSsoContext {
  /** Service Provider name - the application requesting authentication (e.g., Pennylane) */
  spName: SsoProvider
  /** SAML context token from Gigya, used to resume the SSO flow after authentication */
  samlContext: string
  /** SSO operation mode (e.g., 'login') */
  mode: string
}
