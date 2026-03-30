import { envVarsMock } from '@pulse/common/mocks'
import type { AccountInfo, AuthenticationResult } from '@azure/msal-browser'
import { AdminMsalService } from './admin-msal.service'

const {
  backofficeEnvVars,
  publicClientApplicationMock,
  loggerWarnMock,
  loggerErrorMock,
} = vi.hoisted(() => ({
  backofficeEnvVars: {
    VITE_MSAL_AUTHORITY: 'https://login.microsoftonline.com/mock-tenant',
    VITE_MSAL_BACK_CLIENT_ID: 'mock-back-client-id',
    VITE_MSAL_CLIENT_ID: 'mock-msal-client-id',
    VITE_MSAL_POST_LOGOUT_REDIRECT_URI: 'https://backoffice/logout',
    VITE_MSAL_REDIRECT_URI: 'https://backoffice',
  },
  publicClientApplicationMock: vi.fn(),
  loggerWarnMock: vi.fn(),
  loggerErrorMock: vi.fn(),
}))

vi.mock('env-vars', () => ({
  ...envVarsMock,
  ...backofficeEnvVars,
}))

vi.mock('@pulse/toolbox', () => ({
  logger: {
    warn: loggerWarnMock,
    error: loggerErrorMock,
  },
}))

vi.mock('@azure/msal-browser', () => ({
  PublicClientApplication: publicClientApplicationMock,
}))

describe('AdminMsalService', () => {
  const account: AccountInfo = {
    homeAccountId: 'home-id',
    environment: 'env',
    tenantId: 'tenant-id',
    username: 'admin@rydge.fr',
    localAccountId: 'local-id',
    name: 'Admin User',
  }

  const authenticationResult: AuthenticationResult = {
    account,
    accessToken: 'mock-backoffice-token',
    idToken: 'id-token',
    scopes: ['api://mock-back-client-id/AppConfig.ReadWrite'],
    tokenType: 'Bearer',
    uniqueId: 'unique-id',
    expiresOn: new Date(Date.now() + 3600000),
    extExpiresOn: new Date(Date.now() + 3600000),
    state: 'state',
    authority: 'https://login.microsoftonline.com/mock-tenant',
    cloudGraphHostName: 'graph.microsoft.com',
    msGraphHost: 'graph.microsoft.com',
    fromCache: false,
    correlationId: 'correlation-id',
    requestId: 'request-id',
    tenantId: 'tenant-id',
    idTokenClaims: {},
  }

  const createMsalInstance = () => ({
    initialize: vi.fn().mockResolvedValue(undefined),
    handleRedirectPromise: vi.fn().mockResolvedValue(null),
    setActiveAccount: vi.fn(),
    getActiveAccount: vi.fn().mockReturnValue(null),
    getAllAccounts: vi.fn().mockReturnValue([]),
    loginRedirect: vi.fn().mockResolvedValue(undefined),
    logoutRedirect: vi.fn(),
    acquireTokenSilent: vi.fn().mockResolvedValue(authenticationResult),
  })

  const mockPublicClientApplication = (msalInstance: ReturnType<typeof createMsalInstance>) => {
    publicClientApplicationMock.mockImplementation(function() {
      return msalInstance
    })
  }

  beforeEach(() => {
    ;(AdminMsalService as any).instance = null
    ;(AdminMsalService as any).initializationFailed = false
    sessionStorage.removeItem('msal.interaction.status')
    publicClientApplicationMock.mockReset()
    loggerWarnMock.mockReset()
    loggerErrorMock.mockReset()
  })

  it('should return MSAL configuration with expected env vars', () => {
    const config = (AdminMsalService as any).getConfiguration()

    expect(config).toEqual({
      auth: {
        clientId: backofficeEnvVars.VITE_MSAL_CLIENT_ID,
        authority: backofficeEnvVars.VITE_MSAL_AUTHORITY,
        redirectUri: backofficeEnvVars.VITE_MSAL_REDIRECT_URI,
        postLogoutRedirectUri: backofficeEnvVars.VITE_MSAL_POST_LOGOUT_REDIRECT_URI,
      },
      cache: {
        cacheLocation: 'localStorage',
        storeAuthStateInCookie: false,
      },
    })
  })

  it('should return null from getInstance when initialization is flagged as failed', async () => {
    ;(AdminMsalService as any).initializationFailed = true

    const instance = await (AdminMsalService as any).getInstance()

    expect(instance).toBeNull()
    expect(publicClientApplicationMock).not.toHaveBeenCalled()
  })

  it('should initialize MSAL instance and keep it as singleton', async () => {
    const msalInstance = createMsalInstance()
    mockPublicClientApplication(msalInstance)

    const instance1 = await (AdminMsalService as any).getInstance()
    const instance2 = await (AdminMsalService as any).getInstance()

    expect(instance1).toBe(msalInstance)
    expect(instance2).toBe(msalInstance)
    expect(publicClientApplicationMock).toHaveBeenCalledTimes(1)
    expect(msalInstance.initialize).toHaveBeenCalledOnce()
    expect(msalInstance.handleRedirectPromise).toHaveBeenCalledOnce()
  })

  it('should set active account when redirect response contains an account', async () => {
    const msalInstance = createMsalInstance()
    msalInstance.handleRedirectPromise.mockResolvedValue({ account })
    mockPublicClientApplication(msalInstance)

    await (AdminMsalService as any).getInstance()

    expect(msalInstance.setActiveAccount).toHaveBeenCalledWith(account)
  })

  it('should mark initialization as failed and log error when getInstance fails', async () => {
    const error = new Error('init failed')
    const msalInstance = createMsalInstance()
    msalInstance.initialize.mockRejectedValue(error)
    mockPublicClientApplication(msalInstance)

    const instance = await (AdminMsalService as any).getInstance()

    expect(instance).toBeNull()
    expect((AdminMsalService as any).initializationFailed).toBe(true)
    expect(loggerErrorMock).toHaveBeenCalledWith(
      'Failed to initialize MSAL. The application requires HTTPS to function properly.',
      error,
    )
  })

  it('should return the first account when available', async () => {
    const msalInstance = createMsalInstance()
    msalInstance.getAllAccounts.mockReturnValue([account])
    mockPublicClientApplication(msalInstance)

    const result = await AdminMsalService.getAccount()

    expect(result).toEqual(account)
  })

  it('should return null account when no account exists', async () => {
    const msalInstance = createMsalInstance()
    msalInstance.getAllAccounts.mockReturnValue([])
    mockPublicClientApplication(msalInstance)

    const result = await AdminMsalService.getAccount()

    expect(result).toBeNull()
  })

  it('should return null account when MSAL instance is unavailable', async () => {
    ;(AdminMsalService as any).initializationFailed = true

    const result = await AdminMsalService.getAccount()

    expect(result).toBeNull()
  })

  it('should clear interaction key and call loginRedirect', async () => {
    const msalInstance = createMsalInstance()
    mockPublicClientApplication(msalInstance)
    sessionStorage.setItem('msal.interaction.status', 'in-progress')
    const request = { scopes: ['scope-1'] }

    await AdminMsalService.loginRedirect(request)

    expect(sessionStorage.getItem('msal.interaction.status')).toBeNull()
    expect(msalInstance.loginRedirect).toHaveBeenCalledWith(request)
  })

  it('should warn and skip login when MSAL instance is unavailable', async () => {
    ;(AdminMsalService as any).initializationFailed = true

    await AdminMsalService.loginRedirect()

    expect(loggerWarnMock).toHaveBeenCalledWith('Cannot login: MSAL is not initialized')
  })

  it('should call logoutRedirect when instance exists', async () => {
    const msalInstance = createMsalInstance()
    mockPublicClientApplication(msalInstance)

    await AdminMsalService.logout()

    expect(msalInstance.logoutRedirect).toHaveBeenCalledOnce()
  })

  it('should warn and skip logout when MSAL instance is unavailable', async () => {
    ;(AdminMsalService as any).initializationFailed = true

    await AdminMsalService.logout()

    expect(loggerWarnMock).toHaveBeenCalledWith('Cannot logout: MSAL is not initialized')
  })

  it('should report authenticated user when account exists', async () => {
    const msalInstance = createMsalInstance()
    msalInstance.getAllAccounts.mockReturnValue([account])
    mockPublicClientApplication(msalInstance)

    const result = await AdminMsalService.isUserAuthenticated()

    expect(result).toBe(true)
  })

  it('should report unauthenticated user when account does not exist', async () => {
    const msalInstance = createMsalInstance()
    msalInstance.getAllAccounts.mockReturnValue([])
    mockPublicClientApplication(msalInstance)

    const result = await AdminMsalService.isUserAuthenticated()

    expect(result).toBe(false)
  })

  it('should return false in handleRedirectResult when instance is unavailable', async () => {
    ;(AdminMsalService as any).initializationFailed = true

    const result = await AdminMsalService.handleRedirectResult()

    expect(result).toBe(false)
  })

  it('should return active-account status in handleRedirectResult', async () => {
    const msalInstance = createMsalInstance()
    msalInstance.getActiveAccount.mockReturnValue(account)
    mockPublicClientApplication(msalInstance)

    const result = await AdminMsalService.handleRedirectResult()

    expect(result).toBe(true)
  })

  it('should return token from acquireTokenSilent when instance exists', async () => {
    const msalInstance = createMsalInstance()
    mockPublicClientApplication(msalInstance)
    const request = { account, scopes: ['scope-1'] }

    const result = await AdminMsalService.acquireTokenSilent(request as any)

    expect(result).toEqual(authenticationResult)
    expect(msalInstance.acquireTokenSilent).toHaveBeenCalledWith(request)
  })

  it('should return null from acquireTokenSilent when instance is unavailable', async () => {
    ;(AdminMsalService as any).initializationFailed = true

    const result = await AdminMsalService.acquireTokenSilent({} as any)

    expect(result).toBeNull()
    expect(loggerWarnMock).toHaveBeenCalledWith('Cannot acquire token: MSAL is not initialized')
  })

  it('should return null from getMSALToken when no account exists', async () => {
    const msalInstance = createMsalInstance()
    msalInstance.getAllAccounts.mockReturnValue([])
    mockPublicClientApplication(msalInstance)

    const token = await AdminMsalService.getMSALToken()

    expect(token).toBeNull()
  })

  it('should return token from getMSALToken with default forceRefresh false', async () => {
    const msalInstance = createMsalInstance()
    msalInstance.getAllAccounts.mockReturnValue([account])
    mockPublicClientApplication(msalInstance)

    const token = await AdminMsalService.getMSALToken()

    expect(token).toBe(authenticationResult.accessToken)
    expect(msalInstance.acquireTokenSilent).toHaveBeenCalledWith({
      account,
      scopes: [`api://${backofficeEnvVars.VITE_MSAL_BACK_CLIENT_ID}/AppConfig.ReadWrite`],
      forceRefresh: false,
    })
  })

  it('should pass forceRefresh true when requested', async () => {
    const msalInstance = createMsalInstance()
    msalInstance.getAllAccounts.mockReturnValue([account])
    mockPublicClientApplication(msalInstance)

    await AdminMsalService.getMSALToken(true)

    expect(msalInstance.acquireTokenSilent).toHaveBeenCalledWith({
      account,
      scopes: [`api://${backofficeEnvVars.VITE_MSAL_BACK_CLIENT_ID}/AppConfig.ReadWrite`],
      forceRefresh: true,
    })
  })

  it('should return null from getMSALToken when no accessToken is returned', async () => {
    const msalInstance = createMsalInstance()
    msalInstance.getAllAccounts.mockReturnValue([account])
    msalInstance.acquireTokenSilent.mockResolvedValue({})
    mockPublicClientApplication(msalInstance)

    const token = await AdminMsalService.getMSALToken()

    expect(token).toBeNull()
  })

  it('should log warning and return null when getMSALToken throws', async () => {
    const msalInstance = createMsalInstance()
    const error = new Error('silent token failed')
    msalInstance.getAllAccounts.mockReturnValue([account])
    msalInstance.acquireTokenSilent.mockRejectedValue(error)
    mockPublicClientApplication(msalInstance)

    const token = await AdminMsalService.getMSALToken()

    expect(token).toBeNull()
    expect(loggerWarnMock).toHaveBeenCalledWith('Failed to retrieve MSAL token:', error)
  })

  it('should call getMSALToken(true) in getFreshMSALToken', async () => {
    const tokenSpy = vi.spyOn(AdminMsalService, 'getMSALToken').mockResolvedValue('fresh-token')

    const token = await AdminMsalService.getFreshMSALToken()

    expect(token).toBe('fresh-token')
    expect(tokenSpy).toHaveBeenCalledWith(true)
  })
})
