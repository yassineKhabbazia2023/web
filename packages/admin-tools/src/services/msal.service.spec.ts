import { PublicClientApplication, AccountInfo, AuthenticationResult } from '@azure/msal-browser'
import {
  MSAL_AUTHORITY,
  MSAL_CLIENT_ID,
  MSAL_POST_LOGOUT_REDIRECT_URI,
  MSAL_REDIRECT_URI,
} from '@admin-tools/constants/admin-tool.const'
import { MsalService } from './msal.service'

vi.mock('@azure/msal-browser')

const mockedPublicClientApplication = vi.mocked(PublicClientApplication)

describe('MsalService', () => {
  let mockPcaInstance: any
  let mockAccountInfo: AccountInfo
  let mockAuthResult: AuthenticationResult

  beforeEach(() => {
    // Reset static instance before each test
    ;(MsalService as any).instance = undefined

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

      await (MsalService as any).getInstance()

      expect(mockedPublicClientApplication).toHaveBeenCalledWith({
        auth: {
          clientId: MSAL_CLIENT_ID,
          authority: MSAL_AUTHORITY,
          redirectUri: MSAL_REDIRECT_URI,
          postLogoutRedirectUri: MSAL_POST_LOGOUT_REDIRECT_URI,
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

      await (MsalService as any).getInstance()

      expect(mockPcaInstance.setActiveAccount).toHaveBeenCalledWith(mockAccountInfo)
    })

    it('should not set active account when redirect response has no account', async () => {
      mockPcaInstance.handleRedirectPromise.mockResolvedValue(null)

      await (MsalService as any).getInstance()

      expect(mockPcaInstance.setActiveAccount).not.toHaveBeenCalled()
    })

    it('should reuse existing instance on subsequent calls', async () => {
      mockPcaInstance.handleRedirectPromise.mockResolvedValue(null)

      const instance1 = await (MsalService as any).getInstance()
      const instance2 = await (MsalService as any).getInstance()

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

      const result = await MsalService.getAccount()

      expect(mockPcaInstance.getAllAccounts).toHaveBeenCalled()
      expect(result).toBe(mockAccountInfo)
    })

    it('should return null when no accounts exist', async () => {
      mockPcaInstance.getAllAccounts.mockReturnValue([])

      const result = await MsalService.getAccount()

      expect(mockPcaInstance.getAllAccounts).toHaveBeenCalled()
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

      await MsalService.loginRedirect(loginRequest)

      expect(mockPcaInstance.loginRedirect).toHaveBeenCalledWith(loginRequest)
    })

    it('should call loginRedirect without request when none provided', async () => {
      await MsalService.loginRedirect()

      expect(mockPcaInstance.loginRedirect).toHaveBeenCalledWith(undefined)
    })

    it('should remove interaction status from sessionStorage before login', async () => {
      const mockSessionStorage = window.sessionStorage as any
      mockSessionStorage.getItem.mockReturnValue('in_progress')

      await MsalService.loginRedirect()

      expect(mockSessionStorage.getItem).toHaveBeenCalledWith('msal.interaction.status')
      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith('msal.interaction.status')
    })

    it('should not remove interaction status if not present', async () => {
      const mockSessionStorage = window.sessionStorage as any
      mockSessionStorage.getItem.mockReturnValue(null)

      await MsalService.loginRedirect()

      expect(mockSessionStorage.getItem).toHaveBeenCalledWith('msal.interaction.status')
      expect(mockSessionStorage.removeItem).not.toHaveBeenCalled()
    })
  })

  describe('logout', () => {
    beforeEach(() => {
      mockPcaInstance.handleRedirectPromise.mockResolvedValue(null)
    })

    it('should call logoutRedirect', async () => {
      await MsalService.logout()

      expect(mockPcaInstance.logoutRedirect).toHaveBeenCalled()
    })
  })

  describe('isUserAuthenticated', () => {
    beforeEach(() => {
      mockPcaInstance.handleRedirectPromise.mockResolvedValue(null)
    })

    it('should return true when user has account', async () => {
      mockPcaInstance.getAllAccounts.mockReturnValue([mockAccountInfo])

      const result = await MsalService.isUserAuthenticated()

      expect(result).toBe(true)
    })

    it('should return false when user has no account', async () => {
      mockPcaInstance.getAllAccounts.mockReturnValue([])

      const result = await MsalService.isUserAuthenticated()

      expect(result).toBe(false)
    })
  })

  describe('handleRedirectResult', () => {
    beforeEach(() => {
      mockPcaInstance.handleRedirectPromise.mockResolvedValue(null)
    })

    it('should return true when active account exists', async () => {
      mockPcaInstance.getActiveAccount.mockReturnValue(mockAccountInfo)

      const result = await MsalService.handleRedirectResult()

      expect(mockPcaInstance.getActiveAccount).toHaveBeenCalled()
      expect(result).toBe(true)
    })

    it('should return false when no active account exists', async () => {
      mockPcaInstance.getActiveAccount.mockReturnValue(null)

      const result = await MsalService.handleRedirectResult()

      expect(mockPcaInstance.getActiveAccount).toHaveBeenCalled()
      expect(result).toBe(false)
    })
  })

  describe('error handling', () => {
    it('should handle initialization errors', async () => {
      const error = new Error('Initialization failed')
      mockPcaInstance.initialize.mockRejectedValue(error)

      await expect((MsalService as any).getInstance()).rejects.toThrow('Initialization failed')
    })

    it('should handle redirect promise errors', async () => {
      const error = new Error('Redirect failed')
      mockPcaInstance.handleRedirectPromise.mockRejectedValue(error)

      await expect((MsalService as any).getInstance()).rejects.toThrow('Redirect failed')
    })

    it('should handle login redirect errors', async () => {
      mockPcaInstance.handleRedirectPromise.mockResolvedValue(null)
      const error = new Error('Login failed')
      mockPcaInstance.loginRedirect.mockRejectedValue(error)

      await expect(MsalService.loginRedirect()).rejects.toThrow('Login failed')
    })
  })
})
