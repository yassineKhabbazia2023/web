import { PublicClientApplication, AccountInfo, AuthenticationResult } from '@azure/msal-browser'
import {
  VITE_MSAL_CLIENT_ID,
  VITE_MSAL_REDIRECT_URI,
  VITE_MSAL_POST_LOGOUT_REDIRECT_URI,
  VITE_MSAL_AUTHORITY,
} from 'env-vars'
import { loggerMock } from '@pulse/toolbox/mocks'
import { AdminMsalService } from './admin-msal.service'

vi.mock('@azure/msal-browser')
vi.mock('@pulse/toolbox', () => ({ logger: loggerMock }))

const mockedPublicClientApplication = vi.mocked(PublicClientApplication)

describe('AdminMsalService', () => {
  let mockPcaInstance: any
  let mockAccountInfo: AccountInfo
  let mockAuthResult: AuthenticationResult

  beforeEach(() => {
    // Reset static instance and flags before each test
    ;(AdminMsalService as any).instance = undefined
    ;(AdminMsalService as any).initializationFailed = false

    mockAccountInfo = {
      homeAccountId: 'test-home-id',
      environment: 'test-env',
      tenantId: 'test-tenant',
      username: 'test@example.com',
      localAccountId: 'test-local-id',
      name: 'Test User',
    } as AccountInfo

    mockAuthResult = {
      account: mockAccountInfo,
      accessToken: 'test-access-token',
      idToken: 'test-id-token',
      scopes: ['openid', 'profile'],
      uniqueId: 'test-unique-id',
      tenantId: 'test-tenant',
    } as AuthenticationResult

    mockPcaInstance = {
      initialize: vi.fn().mockResolvedValue(undefined),
      handleRedirectPromise: vi.fn(),
      loginRedirect: vi.fn(),
      logoutRedirect: vi.fn(),
      getAllAccounts: vi.fn(),
      getActiveAccount: vi.fn(),
      setActiveAccount: vi.fn(),
      acquireTokenSilent: vi.fn(),
    }

    mockedPublicClientApplication.mockImplementation(() => mockPcaInstance)

    // Mock sessionStorage
    Object.defineProperty(window, 'sessionStorage', {
      value: {
        getItem: vi.fn(),
        removeItem: vi.fn(),
        setItem: vi.fn(),
        clear: vi.fn(),
      },
      writable: true,
    })

    vi.clearAllMocks()
  })

  describe('getInstance', () => {
    it('should create PublicClientApplication with correct configuration', async () => {
      mockPcaInstance.handleRedirectPromise.mockResolvedValue(null)

      await (AdminMsalService as any).getInstance()

      expect(mockedPublicClientApplication).toBeCalledWith({
        auth: {
          clientId: VITE_MSAL_CLIENT_ID,
          authority: VITE_MSAL_AUTHORITY,
          redirectUri: VITE_MSAL_REDIRECT_URI,
          postLogoutRedirectUri: VITE_MSAL_POST_LOGOUT_REDIRECT_URI,
        },
        cache: {
          cacheLocation: 'localStorage',
          storeAuthStateInCookie: false,
        },
      })
      expect(mockPcaInstance.initialize).toHaveBeenCalled()
    })

    it('should set active account when redirect response contains account', async () => {
      mockPcaInstance.handleRedirectPromise.mockResolvedValue(mockAuthResult)

      await (AdminMsalService as any).getInstance()

      expect(mockPcaInstance.setActiveAccount).toBeCalledWith(mockAccountInfo)
    })

    it('should not set active account when redirect response has no account', async () => {
      mockPcaInstance.handleRedirectPromise.mockResolvedValue(null)

      await (AdminMsalService as any).getInstance()

      expect(mockPcaInstance.setActiveAccount).not.toHaveBeenCalled()
    })

    it('should reuse existing instance on subsequent calls', async () => {
      mockPcaInstance.handleRedirectPromise.mockResolvedValue(null)

      const instance1 = await (AdminMsalService as any).getInstance()
      const instance2 = await (AdminMsalService as any).getInstance()

      expect(instance1).toBe(instance2)
      expect(mockedPublicClientApplication).toHaveBeenCalledTimes(1)
    })
  })

  describe('getAccount', () => {
    beforeEach(() => {
      mockPcaInstance.handleRedirectPromise.mockResolvedValue(null)
    })

    it('should return first account when accounts exist', async () => {
      const secondAccount = { ...mockAccountInfo, username: 'second@example.com' }
      mockPcaInstance.getAllAccounts.mockReturnValue([mockAccountInfo, secondAccount])

      const result = await AdminMsalService.getAccount()

      expect(mockPcaInstance.getAllAccounts).toHaveBeenCalled()
      expect(result).toBe(mockAccountInfo)
    })

    it('should return null when no accounts exist', async () => {
      mockPcaInstance.getAllAccounts.mockReturnValue([])

      const result = await AdminMsalService.getAccount()

      expect(mockPcaInstance.getAllAccounts).toHaveBeenCalled()
      expect(result).toBeNull()
    })

    it('should return null when instance initialization fails', async () => {
      const error = new Error('Init failed')
      mockPcaInstance.initialize.mockRejectedValue(error)

      const result = await AdminMsalService.getAccount()

      expect(result).toBeNull()
    })
  })

  describe('loginRedirect', () => {
    beforeEach(() => {
      mockPcaInstance.handleRedirectPromise.mockResolvedValue(null)
    })

    it('should call loginRedirect with provided request', async () => {
      const loginRequest = {
        scopes: ['openid', 'profile'],
        redirectUri: 'http://localhost:9000/test',
      }

      await AdminMsalService.loginRedirect(loginRequest)

      expect(mockPcaInstance.loginRedirect).toBeCalledWith(loginRequest)
    })

    it('should call loginRedirect without request when none provided', async () => {
      await AdminMsalService.loginRedirect()

      expect(mockPcaInstance.loginRedirect).toBeCalledWith(undefined)
    })

    it('should remove interaction status from sessionStorage before login', async () => {
      const mockSessionStorage = window.sessionStorage as any
      mockSessionStorage.getItem.mockReturnValue('in_progress')

      await AdminMsalService.loginRedirect()

      expect(mockSessionStorage.getItem).toBeCalledWith('msal.interaction.status')
      expect(mockSessionStorage.removeItem).toBeCalledWith('msal.interaction.status')
    })

    it('should not remove interaction status if not present', async () => {
      const mockSessionStorage = window.sessionStorage as any
      mockSessionStorage.getItem.mockReturnValue(null)

      await AdminMsalService.loginRedirect()

      expect(mockSessionStorage.getItem).toBeCalledWith('msal.interaction.status')
      expect(mockSessionStorage.removeItem).not.toHaveBeenCalled()
    })

    it('should warn and return when instance is null', async () => {
      const error = new Error('Init failed')
      mockPcaInstance.initialize.mockRejectedValue(error)

      await AdminMsalService.loginRedirect()

      expect(mockPcaInstance.loginRedirect).not.toHaveBeenCalled()
    })
  })

  describe('logout', () => {
    beforeEach(() => {
      mockPcaInstance.handleRedirectPromise.mockResolvedValue(null)
    })

    it('should call logoutRedirect', async () => {
      await AdminMsalService.logout()

      expect(mockPcaInstance.logoutRedirect).toHaveBeenCalled()
    })

    it('should warn and return when instance is null', async () => {
      const error = new Error('Init failed')
      mockPcaInstance.initialize.mockRejectedValue(error)

      await AdminMsalService.logout()

      expect(mockPcaInstance.logoutRedirect).not.toHaveBeenCalled()
    })
  })

  describe('isUserAuthenticated', () => {
    beforeEach(() => {
      mockPcaInstance.handleRedirectPromise.mockResolvedValue(null)
    })

    it('should return true when user has account', async () => {
      mockPcaInstance.getAllAccounts.mockReturnValue([mockAccountInfo])

      const result = await AdminMsalService.isUserAuthenticated()

      expect(result).toBe(true)
    })

    it('should return false when user has no account', async () => {
      mockPcaInstance.getAllAccounts.mockReturnValue([])

      const result = await AdminMsalService.isUserAuthenticated()

      expect(result).toBe(false)
    })
  })

  describe('handleRedirectResult', () => {
    beforeEach(() => {
      mockPcaInstance.handleRedirectPromise.mockResolvedValue(null)
    })

    it('should return true when active account exists', async () => {
      mockPcaInstance.getActiveAccount.mockReturnValue(mockAccountInfo)

      const result = await AdminMsalService.handleRedirectResult()

      expect(mockPcaInstance.getActiveAccount).toHaveBeenCalled()
      expect(result).toBe(true)
    })

    it('should return false when no active account exists', async () => {
      mockPcaInstance.getActiveAccount.mockReturnValue(null)

      const result = await AdminMsalService.handleRedirectResult()

      expect(mockPcaInstance.getActiveAccount).toHaveBeenCalled()
      expect(result).toBe(false)
    })

    it('should return false when instance is null', async () => {
      const error = new Error('Init failed')
      mockPcaInstance.initialize.mockRejectedValue(error)

      const result = await AdminMsalService.handleRedirectResult()

      expect(result).toBe(false)
    })
  })

  describe('error handling', () => {
    it('should handle initialization errors and return null', async () => {
      const error = new Error('Initialization failed')
      mockPcaInstance.initialize.mockRejectedValue(error)

      const result = await (AdminMsalService as any).getInstance()

      expect(result).toBeNull()
      expect((AdminMsalService as any).initializationFailed).toBe(true)
    })

    it('should handle redirect promise errors and return null', async () => {
      const error = new Error('Redirect failed')
      mockPcaInstance.handleRedirectPromise.mockRejectedValue(error)

      const result = await (AdminMsalService as any).getInstance()

      expect(result).toBeNull()
      expect((AdminMsalService as any).initializationFailed).toBe(true)
    })

    it('should handle login redirect errors gracefully', async () => {
      mockPcaInstance.handleRedirectPromise.mockResolvedValue(null)
      const error = new Error('Login failed')
      mockPcaInstance.loginRedirect.mockRejectedValue(error)

      // Should not throw, but the method will propagate the error from loginRedirect
      await expect(AdminMsalService.loginRedirect()).rejects.toThrow('Login failed')
    })

    it('should return null from getInstance on subsequent calls after initialization failure', async () => {
      const error = new Error('Initialization failed')
      mockPcaInstance.initialize.mockRejectedValue(error)

      const result1 = await (AdminMsalService as any).getInstance()
      const result2 = await (AdminMsalService as any).getInstance()

      expect(result1).toBeNull()
      expect(result2).toBeNull()
      // Should only try to initialize once
      expect(mockPcaInstance.initialize).toHaveBeenCalledTimes(1)
    })
  })

  describe('acquireTokenSilent', () => {
    beforeEach(() => {
      mockPcaInstance.handleRedirectPromise.mockResolvedValue(null)
    })

    it('should return token result when successful', async () => {
      mockPcaInstance.acquireTokenSilent.mockResolvedValue(mockAuthResult)

      const result = await AdminMsalService.acquireTokenSilent({ account: mockAccountInfo, scopes: [] })

      expect(result).toBe(mockAuthResult)
    })

    it('should return null when instance is null', async () => {
      const error = new Error('Init failed')
      mockPcaInstance.initialize.mockRejectedValue(error)

      const result = await AdminMsalService.acquireTokenSilent({ account: mockAccountInfo, scopes: [] })

      expect(result).toBeNull()
    })
  })

  describe('getMSALToken', () => {
    beforeEach(() => {
      mockPcaInstance.handleRedirectPromise.mockResolvedValue(null)
    })

    it('should return access token when successful', async () => {
      mockPcaInstance.getAllAccounts.mockReturnValue([mockAccountInfo])
      mockPcaInstance.acquireTokenSilent.mockResolvedValue(mockAuthResult)

      const result = await AdminMsalService.getMSALToken()

      expect(result).toBe('test-access-token')
    })

    it('should return null when no account exists', async () => {
      mockPcaInstance.getAllAccounts.mockReturnValue([])

      const result = await AdminMsalService.getMSALToken()

      expect(result).toBeNull()
    })

    it('should return null when instance is null after account check', async () => {
      mockPcaInstance.getAllAccounts.mockReturnValue([mockAccountInfo])
      const error = new Error('Init failed')
      mockPcaInstance.initialize.mockRejectedValue(error)

      const result = await AdminMsalService.getMSALToken()

      expect(result).toBeNull()
    })

    it('should return null when token acquisition fails', async () => {
      mockPcaInstance.getAllAccounts.mockReturnValue([mockAccountInfo])
      mockPcaInstance.acquireTokenSilent.mockRejectedValue(new Error('Token error'))

      const result = await AdminMsalService.getMSALToken()

      expect(result).toBeNull()
    })

    it('should return null when response has no accessToken', async () => {
      mockPcaInstance.getAllAccounts.mockReturnValue([mockAccountInfo])
      mockPcaInstance.acquireTokenSilent.mockResolvedValue({ ...mockAuthResult, accessToken: '' })

      const result = await AdminMsalService.getMSALToken()

      expect(result).toBeNull()
    })

    it('should force refresh when parameter is true', async () => {
      mockPcaInstance.getAllAccounts.mockReturnValue([mockAccountInfo])
      mockPcaInstance.acquireTokenSilent.mockResolvedValue(mockAuthResult)

      await AdminMsalService.getMSALToken(true)

      expect(mockPcaInstance.acquireTokenSilent).toHaveBeenCalledWith(
        expect.objectContaining({ forceRefresh: true }),
      )
    })
  })

  describe('getFreshMSALToken', () => {
    beforeEach(() => {
      mockPcaInstance.handleRedirectPromise.mockResolvedValue(null)
    })

    it('should call getMSALToken with forceRefresh=true', async () => {
      mockPcaInstance.getAllAccounts.mockReturnValue([mockAccountInfo])
      mockPcaInstance.acquireTokenSilent.mockResolvedValue(mockAuthResult)

      const result = await AdminMsalService.getFreshMSALToken()

      expect(result).toBe('test-access-token')
      expect(mockPcaInstance.acquireTokenSilent).toHaveBeenCalledWith(
        expect.objectContaining({ forceRefresh: true }),
      )
    })
  })
})
