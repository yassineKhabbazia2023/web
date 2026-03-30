import { TokenRefreshService } from './token-refresh.service'
import { refreshClientToken } from './authentication.service'
import { MsalService } from './msal'
import { useUserStore } from '../stores/user/user.store'
import { tokenIsValid } from '../stores/token/token.store.utils'

vi.mock('./authentication.service')
vi.mock('./msal')
vi.mock('../stores/user/user.store')
vi.mock('../stores/token/token.store.utils')
vi.mock('@pulse/toolbox')

describe('TokenRefreshService', () => {
  beforeEach(() => {
    // Reset static properties
    TokenRefreshService['refreshPromise'] = undefined
  })

  describe('refreshToken', () => {
    it('should refresh Gigya token for client users', async () => {
      const mockToken = 'new-gigya-token'

      vi.mocked(useUserStore).mockReturnValue({
        isCollab: false,
      } as any)

      vi.mocked(refreshClientToken).mockResolvedValue(mockToken)
      vi.mocked(tokenIsValid).mockReturnValue(true)

      const result = await TokenRefreshService.refreshToken()

      expect(result).toBe(mockToken)
      expect(refreshClientToken).toHaveBeenCalled()
      expect(tokenIsValid).toHaveBeenCalledWith(mockToken)
    })

    it('should refresh MSAL token for collaborator users', async () => {
      const mockToken = 'new-msal-token'

      vi.mocked(useUserStore).mockReturnValue({
        isCollab: true,
      } as any)

      vi.mocked(MsalService.getFreshMSALToken).mockResolvedValue(mockToken)
      vi.mocked(tokenIsValid).mockReturnValue(true)

      const result = await TokenRefreshService.refreshToken()

      expect(result).toBe(mockToken)
      expect(MsalService.getFreshMSALToken).toHaveBeenCalled()
      expect(tokenIsValid).toHaveBeenCalledWith(mockToken)
    })

    it('should return shared promise if refresh is already in progress', async () => {
      const mockToken = 'shared-token'

      vi.mocked(useUserStore).mockReturnValue({
        isCollab: false,
      } as any)

      vi.mocked(refreshClientToken).mockResolvedValue(mockToken)
      vi.mocked(tokenIsValid).mockReturnValue(true)

      // Launch two simultaneous refreshes
      const promise1 = TokenRefreshService.refreshToken()
      const promise2 = TokenRefreshService.refreshToken()

      const [result1, result2] = await Promise.all([promise1, promise2])

      expect(result1).toBe(mockToken)
      expect(result2).toBe(mockToken)
      // refreshClientToken should only be called once
      expect(refreshClientToken).toHaveBeenCalledTimes(1)
    })

    it('should throw error if invalid token is received from Gigya', async () => {
      vi.mocked(useUserStore).mockReturnValue({
        isCollab: false,
      } as any)

      vi.mocked(refreshClientToken).mockResolvedValue('invalid-token')
      vi.mocked(tokenIsValid).mockReturnValue(false)

      await expect(TokenRefreshService.refreshToken()).rejects.toThrow('Invalid token received from Gigya refresh')
      expect(tokenIsValid).toHaveBeenCalledWith('invalid-token')
    })

    it('should throw error if invalid token is received from MSAL', async () => {
      vi.mocked(useUserStore).mockReturnValue({
        isCollab: true,
      } as any)

      vi.mocked(MsalService.getFreshMSALToken).mockResolvedValue('invalid-token')
      vi.mocked(tokenIsValid).mockReturnValue(false)

      await expect(TokenRefreshService.refreshToken()).rejects.toThrow('Invalid token received from MSAL refresh')
      expect(tokenIsValid).toHaveBeenCalledWith('invalid-token')
    })
  })

  describe('getRefreshPromise', () => {
    it('should return undefined when not refreshing', () => {
      expect(TokenRefreshService.getRefreshPromise()).toBe(undefined)
    })

    it('should return promise when refresh is in progress', async () => {
      vi.mocked(useUserStore).mockReturnValue({
        isCollab: false,
      } as any)

      // Mock that takes time to execute and returns a valid token
      vi.mocked(refreshClientToken).mockImplementation(() =>
        new Promise(resolve => setTimeout(() => resolve('valid-token'), 100)),
      )

      vi.mocked(tokenIsValid).mockReturnValue(true)

      // Launch refresh without waiting
      TokenRefreshService.refreshToken()

      // During refresh, getRefreshPromise should return a promise
      const currentRefreshPromise = TokenRefreshService.getRefreshPromise()
      expect(currentRefreshPromise).toBeInstanceOf(Promise)

      // Wait for refresh to complete
      await currentRefreshPromise

      // After refresh, getRefreshPromise should return undefined
      expect(TokenRefreshService.getRefreshPromise()).toBe(undefined)
    })
  })
})
