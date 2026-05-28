/**
 * MSAL shim for E2E testing
 * Replaces @azure/msal-browser to bypass Azure AD authentication
 */

const mockAccount = {
  homeAccountId: 'e2e-mock-home-account-id',
  environment: 'login.microsoftonline.com',
  tenantId: 'e2e-mock-tenant-id',
  username: 'e2e-test@example.com',
  localAccountId: 'e2e-mock-local-account-id',
  name: 'E2E Test User',
  idTokenClaims: {
    aud: 'e2e-mock-client-id',
    iss: 'https://login.microsoftonline.com/e2e-mock-tenant-id/v2.0',
    iat: Math.floor(Date.now() / 1000),
    nbf: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
    name: 'E2E Test User',
    preferred_username: 'e2e-test@example.com',
    oid: 'e2e-mock-oid',
    sub: 'e2e-mock-sub',
    tid: 'e2e-mock-tenant-id',
  },
}

const mockAuthenticationResult = {
  authority: 'https://login.microsoftonline.com/e2e-mock-tenant-id',
  uniqueId: 'e2e-mock-unique-id',
  tenantId: 'e2e-mock-tenant-id',
  scopes: ['user.read', 'openid', 'profile'],
  account: mockAccount,
  idToken: 'e2e-mock-id-token',
  idTokenClaims: mockAccount.idTokenClaims,
  accessToken: 'e2e-mock-access-token',
  fromCache: true,
  expiresOn: new Date(Date.now() + 3600 * 1000),
  tokenType: 'Bearer',
  correlationId: 'e2e-mock-correlation-id',
}

export class PublicClientApplication {
  private readonly config: Configuration
  private activeAccount: typeof mockAccount | null = mockAccount

  constructor(config: Configuration) {
    this.config = config
  }

  async initialize(): Promise<void> {
    // No-op for E2E
  }

  async handleRedirectPromise(): Promise<typeof mockAuthenticationResult | null> {
    return mockAuthenticationResult
  }

  getAllAccounts(): typeof mockAccount[] {
    return [mockAccount]
  }

  getActiveAccount(): typeof mockAccount | null {
    return this.activeAccount
  }

  setActiveAccount(account: typeof mockAccount | null): void {
    this.activeAccount = account
  }

  async loginRedirect(): Promise<void> {
    // No-op for E2E - we're already "authenticated"
  }

  async logoutRedirect(): Promise<void> {
    this.activeAccount = null
  }

  async acquireTokenSilent(): Promise<typeof mockAuthenticationResult> {
    return mockAuthenticationResult
  }

  async acquireTokenPopup(): Promise<typeof mockAuthenticationResult> {
    return mockAuthenticationResult
  }
}

// Re-export types that might be imported from @azure/msal-browser
export type AccountInfo = typeof mockAccount
export type AuthenticationResult = typeof mockAuthenticationResult

// Minimal type definitions for MSAL configuration objects
export interface Configuration {
  auth: {
    clientId: string
    authority?: string
    redirectUri?: string
  }
  cache?: Record<string, unknown>
  system?: Record<string, unknown>
}

export interface RedirectRequest {
  scopes: string[]
  redirectUri?: string
}

export interface SilentRequest {
  scopes: string[]
  account?: AccountInfo
}
