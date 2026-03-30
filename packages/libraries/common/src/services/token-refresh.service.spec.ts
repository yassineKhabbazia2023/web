import { TokenRefreshService } from './token-refresh.service'
import { tokenIsValid } from '../stores/token/token.store.utils'

vi.mock('../stores/token/token.store.utils')
vi.mock('@pulse/toolbox')

describe('TokenRefreshService', () => {
  beforeEach(() => {
    TokenRefreshService['refreshPromise'] = undefined
    TokenRefreshService.resetRefreshStrategy()
  })

  describe('refreshToken', () => {
    it('should call the registered refresh strategy and return the token', async () => {
      const mockToken = 'new-token'
      const mockStrategy = vi.fn().mockResolvedValue(mockToken)

      TokenRefreshService.registerRefreshStrategy(mockStrategy)
      vi.mocked(tokenIsValid).mockReturnValue(true)

      const result = await TokenRefreshService.refreshToken()

      expect(result).toBe(mockToken)
      expect(mockStrategy).toHaveBeenCalled()
      expect(tokenIsValid).toHaveBeenCalledWith(mockToken)
    })

    it('should throw if no refresh strategy is registered', async () => {
      await expect(TokenRefreshService.refreshToken()).rejects.toThrow(
        'No token refresh strategy registered. Call TokenRefreshService.registerRefreshStrategy() at app startup.',
      )
    })

    it('should throw if the strategy returns an invalid token', async () => {
      const mockStrategy = vi.fn().mockResolvedValue('invalid-token')

      TokenRefreshService.registerRefreshStrategy(mockStrategy)
      vi.mocked(tokenIsValid).mockReturnValue(false)

      await expect(TokenRefreshService.refreshToken()).rejects.toThrow(
        'Invalid token received from refresh strategy',
      )
      expect(tokenIsValid).toHaveBeenCalledWith('invalid-token')
    })

    it('should return shared promise if refresh is already in progress', async () => {
      const mockToken = 'shared-token'
      const mockStrategy = vi.fn().mockResolvedValue(mockToken)

      TokenRefreshService.registerRefreshStrategy(mockStrategy)
      vi.mocked(tokenIsValid).mockReturnValue(true)

      // Launch two simultaneous refreshes
      const promise1 = TokenRefreshService.refreshToken()
      const promise2 = TokenRefreshService.refreshToken()

      const [result1, result2] = await Promise.all([promise1, promise2])

      expect(result1).toBe(mockToken)
      expect(result2).toBe(mockToken)
      // Strategy should only be called once
      expect(mockStrategy).toHaveBeenCalledTimes(1)
    })
  })

  describe('registerRefreshStrategy', () => {
    it('should allow overriding the refresh strategy', async () => {
      const firstStrategy = vi.fn().mockResolvedValue('first-token')
      const secondStrategy = vi.fn().mockResolvedValue('second-token')

      vi.mocked(tokenIsValid).mockReturnValue(true)

      TokenRefreshService.registerRefreshStrategy(firstStrategy)
      TokenRefreshService.registerRefreshStrategy(secondStrategy)

      const result = await TokenRefreshService.refreshToken()

      expect(result).toBe('second-token')
      expect(firstStrategy).not.toHaveBeenCalled()
      expect(secondStrategy).toHaveBeenCalled()
    })
  })

  describe('resetRefreshStrategy', () => {
    it('should clear the registered strategy', async () => {
      const mockStrategy = vi.fn().mockResolvedValue('token')

      TokenRefreshService.registerRefreshStrategy(mockStrategy)
      TokenRefreshService.resetRefreshStrategy()

      await expect(TokenRefreshService.refreshToken()).rejects.toThrow(
        'No token refresh strategy registered',
      )
    })
  })

  describe('getRefreshPromise', () => {
    it('should return undefined when not refreshing', () => {
      expect(TokenRefreshService.getRefreshPromise()).toBe(undefined)
    })

    it('should return promise when refresh is in progress', async () => {
      // Mock that takes time to execute and returns a valid token
      const mockStrategy = vi.fn().mockImplementation(() =>
        new Promise(resolve => setTimeout(() => resolve('valid-token'), 100)),
      )

      TokenRefreshService.registerRefreshStrategy(mockStrategy)
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
