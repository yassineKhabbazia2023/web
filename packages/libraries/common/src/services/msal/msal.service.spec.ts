import { describe, it, expect, vi, beforeEach } from 'vitest'
import { envVarsMock } from '@pulse/common/mocks'
import { MsalService } from './msal.service'
import {
  PublicClientApplication,
  AccountInfo,
  AuthenticationResult,
} from '@azure/msal-browser'

vi.mock('env-vars', () => envVarsMock)

vi.mock('@pulse/toolbox', () => ({
  logger: {
    warn: vi.fn(),
  },
}))

vi.mock('@azure/msal-browser', () => ({
  PublicClientApplication: vi.fn(),
  InteractionRequiredAuthError: class InteractionRequiredAuthError extends Error {
    constructor(message: string) {
      super(message)
      this.name = 'InteractionRequiredAuthError'
    }
  },
}))

describe('MsalService', () => {
  let mockMsalInstance: any
  const mockAccount: AccountInfo = {
    homeAccountId: 'test-home-id',
    environment: 'test-env',
    tenantId: 'test-tenant',
    username: 'test@example.com',
    localAccountId: 'test-local-id',
    name: 'Test User',
  }
  const mockAuthResult: AuthenticationResult = {
    account: mockAccount,
    accessToken: 'test-access-token',
    idToken: 'test-id-token',
    scopes: ['api://test-scope/.default'],
    tokenType: 'Bearer',
    uniqueId: 'test-unique-id',
    expiresOn: new Date(Date.now() + 3600000),
    extExpiresOn: new Date(Date.now() + 3600000),
    state: 'test-state',
    authority: 'https://login.microsoftonline.com/test-tenant',
    cloudGraphHostName: 'graph.microsoft.com',
    msGraphHost: 'graph.microsoft.com',
    fromCache: false,
    correlationId: 'test-correlation-id',
    requestId: 'test-request-id',
    tenantId: 'tenantId',
    idTokenClaims: Object,
  }

  beforeEach(() => {
    ;(MsalService as any).instance = null
    sessionStorage.removeItem('msal.interaction.status')

    mockMsalInstance = {
      initialize: vi.fn().mockResolvedValue(undefined),
      handleRedirectPromise: vi.fn().mockResolvedValue(null),
      setActiveAccount: vi.fn(),
      getAllAccounts: vi.fn().mockReturnValue([]),
      loginRedirect: vi.fn().mockResolvedValue(undefined),
      logoutRedirect: vi.fn().mockResolvedValue(undefined),
      acquireTokenSilent: vi.fn().mockResolvedValue(mockAuthResult),
      acquireTokenRedirect: vi.fn().mockResolvedValue(undefined),
    }

    ;(PublicClientApplication as any).mockImplementation(function() {
      return mockMsalInstance
    })
  })

  describe('getInstance', () => {
    it('should create and initialize MSAL instance', async () => {
      const instance = await (MsalService as any).getInstance()

      expect(PublicClientApplication).toHaveBeenCalledWith({
        auth: {
          clientId: 'pulse-client-id',
          authority: undefined,
          redirectUri: 'https://collaborateur',
          postLogoutRedirectUri: 'https://collaborateur',
        },
        cache: {
          cacheLocation: 'sessionStorage',
          storeAuthStateInCookie: false,
        },
      })

      expect(mockMsalInstance.initialize).toHaveBeenCalled()
      expect(mockMsalInstance.handleRedirectPromise).toHaveBeenCalled()
      expect(instance).toBe(mockMsalInstance)
    })

    it('should return existing instance if already created', async () => {
      // First call
      const instance1 = await (MsalService as any).getInstance()

      // Second call
      const instance2 = await (MsalService as any).getInstance()

      expect(instance1).toBe(instance2)
      expect(PublicClientApplication).toHaveBeenCalledTimes(1)
    })

    it('should set active account if redirect response contains account', async () => {
      const redirectResponse = { account: mockAccount }
      mockMsalInstance.handleRedirectPromise.mockResolvedValue(redirectResponse)

      await (MsalService as any).getInstance()

      expect(mockMsalInstance.setActiveAccount).toHaveBeenCalledWith(mockAccount)
    })
  })

  describe('getConfiguration', () => {
    it('should return the correct configuration', () => {
      const result = (MsalService as any).getConfiguration()
      const configurationExpected = {
        auth: {
          clientId: 'pulse-client-id',
          authority: undefined,
          redirectUri: 'https://collaborateur',
          postLogoutRedirectUri: 'https://collaborateur',
        },
        cache: {
          cacheLocation: 'sessionStorage',
          storeAuthStateInCookie: false,
        },
      }
      expect(result).toEqual(configurationExpected)
    })
  })

  describe('getRedirectUri', () => {
    it('should return the correct uri with sub env', () => {
      const uriExpected = 'https://localhost/transverse/collaborateur'
      Object.defineProperty(window, 'location', {
        writable: true,
        value: { href: 'https://localhost/transverse/collaborateur' },
      })
      const result = (MsalService as any).getRedirectUri('https://localhost/collaborateur')

      expect(result).toEqual(uriExpected)
    })
  })

  describe('getAccount', () => {
    it('should return first account when accounts exist', async () => {
      mockMsalInstance.getAllAccounts.mockReturnValue([mockAccount])

      const result = await MsalService.getAccount()

      expect(result).toBe(mockAccount)
      expect(mockMsalInstance.getAllAccounts).toHaveBeenCalled()
    })

    it('should return null when no accounts exist', async () => {
      mockMsalInstance.getAllAccounts.mockReturnValue([])

      const result = await MsalService.getAccount()

      expect(result).toBeNull()
    })
  })

  describe('loginRedirect', () => {
    it('should call loginRedirect on MSAL instance', async () => {
      const request = { scopes: ['user.read'] }

      await MsalService.loginRedirect(request)
      await new Promise(res => setTimeout(res, 150))

      expect(mockMsalInstance.loginRedirect).toHaveBeenCalledWith(request)
    })

    it('should call loginRedirect without request parameter', async () => {
      await MsalService.loginRedirect()
      await new Promise(res => setTimeout(res, 150))

      expect(mockMsalInstance.loginRedirect).toHaveBeenCalledWith(undefined)
    })
  })

  describe('logout', () => {
    it('should call logoutRedirect on MSAL instance', async () => {
      await MsalService.logout()

      expect(mockMsalInstance.logoutRedirect).toHaveBeenCalled()
    })
  })

  describe('acquireTokenSilent', () => {
    it('should return authentication result', async () => {
      const silentRequest = {
        account: mockAccount,
        scopes: ['user.read'],
      }

      const result = await MsalService.acquireTokenSilent(silentRequest)

      expect(result).toBe(mockAuthResult)
      expect(mockMsalInstance.acquireTokenSilent).toHaveBeenCalledWith(silentRequest)
    })
  })

  describe('getMSALToken', () => {
    it('should return access token when account exists and token acquired successfully', async () => {
      mockMsalInstance.getAllAccounts.mockReturnValue([mockAccount])

      const result = await MsalService.getMSALToken()

      expect(result).toBe('test-access-token')
      expect(mockMsalInstance.acquireTokenSilent).toHaveBeenCalledWith({
        account: mockAccount,
        forceRefresh: false,
        scopes: ['pulse-tenant.com'],
      })
    })

    it('should return null when no account exists', async () => {
      mockMsalInstance.getAllAccounts.mockReturnValue([])

      const result = await MsalService.getMSALToken()

      expect(result).toBeNull()
    })

    it('should handle generic error', async () => {
      const { logger } = await import('@pulse/toolbox')
      mockMsalInstance.getAllAccounts.mockReturnValue([mockAccount])

      const genericError = new Error('Generic error')
      mockMsalInstance.acquireTokenSilent.mockRejectedValue(genericError)

      await MsalService.getMSALToken()

      expect(logger.warn).toHaveBeenCalledWith(genericError)
    })
  })

  describe('Error handling', () => {
    it('should handle MSAL initialization errors', async () => {
      const initError = new Error('Initialization failed')
      mockMsalInstance.initialize.mockRejectedValue(initError)

      await expect((MsalService as any).getInstance()).rejects.toThrow('Initialization failed')
    })

    it('should handle redirect promise errors', async () => {
      const redirectError = new Error('Redirect failed')
      mockMsalInstance.handleRedirectPromise.mockRejectedValue(redirectError)

      await expect((MsalService as any).getInstance()).rejects.toThrow('Redirect failed')
    })
  })

  describe('Integration scenarios', () => {
    it('should handle complete authentication flow', async () => {
      // Simule the entire scenario authorization
      mockMsalInstance.getAllAccounts.mockReturnValue([mockAccount])

      // Test getAccount
      const account = await MsalService.getAccount()
      expect(account).toBe(mockAccount)

      // Test getMSALToken
      const token = await MsalService.getMSALToken()
      expect(token).toBe('test-access-token')

      // Test logout
      await MsalService.logout()
      expect(mockMsalInstance.logoutRedirect).toHaveBeenCalled()
    })
  })
})
