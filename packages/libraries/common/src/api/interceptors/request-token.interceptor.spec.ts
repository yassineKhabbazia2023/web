import { createPinia, setActivePinia } from 'pinia'
import { TokenProviderService } from '../../services/token-provider/token-provider.service'
import { nowInSeconds } from '../../stores/token/token.store.utils'

import { requestTokenInterceptor } from './request-token.interceptor'

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

vi.mock('../../services/token-provider/token-provider.service')
vi.mock('@pulse/toolbox')


// Helper function to create JWT tokens for testing
function createTestToken(payload: Record<string, any> = {}): string {
  const header = { alg: 'HS256', typ: 'JWT' }
  const encodedHeader = btoa(JSON.stringify(header))
  const encodedPayload = btoa(JSON.stringify(payload))
  return `${encodedHeader}.${encodedPayload}.signature`
}

describe('requestTokenInterceptor', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should add Authorization header when token exists', async () => {
    const mockToken = createTestToken({ exp: nowInSeconds() + 3600 })
    localStorageMock.getItem.mockReturnValue(mockToken)
    const mockConfig = { headers: {} }

    const result = await requestTokenInterceptor(mockConfig)

    expect(result.headers.Authorization).toBe(`Bearer ${mockToken}`)
  })

  it('should not add Authorization header when token does not exist', async () => {
    localStorageMock.getItem.mockReturnValue('')
    const mockConfig = { headers: {} }

    const result = await requestTokenInterceptor(mockConfig)

    expect(result.headers.Authorization).toBeUndefined()
  })

  it('should bypass refresh when skipTokenRefresh is true', async () => {
    const mockToken = createTestToken({ exp: nowInSeconds() + 180 }) // expires in 3 minutes
    localStorageMock.getItem.mockReturnValue(mockToken)

    const mockConfig = {
      url: '/api/refreshToken?userId=123',
      headers: {},
      skipTokenRefresh: true,
    }

    const result = await requestTokenInterceptor(mockConfig)

    expect(TokenProviderService.refreshToken).not.toHaveBeenCalled()
    expect(result.headers.Authorization).toBe(`Bearer ${mockToken}`)
  })

  it('should not bypass refresh when skipTokenRefresh is false', async () => {
    const oldToken = createTestToken({ exp: nowInSeconds() + 180 }) // expires in 3 minutes
    const newToken = createTestToken({ exp: nowInSeconds() + 3600 }) // expires in 1 hour

    localStorageMock.getItem.mockReturnValue(oldToken)
    vi.mocked(TokenProviderService.getRefreshPromise).mockReturnValue(undefined)
    vi.mocked(TokenProviderService.refreshToken).mockResolvedValue(newToken)

    const mockConfig = {
      url: '/api/normal-request',
      headers: {},
      skipTokenRefresh: false,
    }

    const result = await requestTokenInterceptor(mockConfig)

    expect(TokenProviderService.refreshToken).toHaveBeenCalled()
    expect(result.headers.Authorization).toBe(`Bearer ${newToken}`)
  })

  it('should wait for existing refresh and use new token', async () => {
    const oldToken = createTestToken({ exp: nowInSeconds() + 180 }) // expires in 3 minutes
    const newToken = createTestToken({ exp: nowInSeconds() + 3600 }) // expires in 1 hour

    localStorageMock.getItem.mockReturnValue(oldToken)

    // Mock an existing refresh promise
    const refreshPromise = Promise.resolve(newToken)
    vi.mocked(TokenProviderService.getRefreshPromise).mockReturnValue(refreshPromise)

    const mockConfig = {
      url: '/api/normal-request',
      headers: {},
    }

    const result = await requestTokenInterceptor(mockConfig)

    expect(TokenProviderService.refreshToken).not.toHaveBeenCalled()
    expect(result.headers.Authorization).toBe(`Bearer ${newToken}`)
  })

  it('should refresh token when expiring within 5 minutes', async () => {
    const oldToken = createTestToken({ exp: nowInSeconds() + 180 }) // expires in 3 minutes
    const newToken = createTestToken({ exp: nowInSeconds() + 3600 }) // expires in 1 hour

    localStorageMock.getItem.mockReturnValue(oldToken)
    vi.mocked(TokenProviderService.getRefreshPromise).mockReturnValue(undefined)
    vi.mocked(TokenProviderService.refreshToken).mockResolvedValue(newToken)

    const mockConfig = {
      url: '/api/normal-request',
      headers: {},
    }

    const result = await requestTokenInterceptor(mockConfig)

    expect(TokenProviderService.refreshToken).toHaveBeenCalled()
    expect(result.headers.Authorization).toBe(`Bearer ${newToken}`)
  })

  it('should refresh token when already expired (Gigya/MSAL strategies do not need a valid local token)', async () => {
    const expiredToken = createTestToken({ exp: nowInSeconds() - 60 }) // expired 1 minute ago
    const newToken = createTestToken({ exp: nowInSeconds() + 3600 }) // expires in 1 hour

    localStorageMock.getItem.mockReturnValue(expiredToken)
    vi.mocked(TokenProviderService.getRefreshPromise).mockReturnValue(undefined)
    vi.mocked(TokenProviderService.refreshToken).mockResolvedValue(newToken)

    const mockConfig = {
      url: '/api/normal-request',
      headers: {},
    }

    const result = await requestTokenInterceptor(mockConfig)

    expect(TokenProviderService.refreshToken).toHaveBeenCalled()
    expect(result.headers.Authorization).toBe(`Bearer ${newToken}`)
  })

  it('should not refresh token when not expiring soon', async () => {
    const mockToken = createTestToken({ exp: nowInSeconds() + 3600 }) // expires in 1 hour
    localStorageMock.getItem.mockReturnValue(mockToken)

    const mockConfig = {
      url: '/api/normal-request',
      headers: {},
    }

    const result = await requestTokenInterceptor(mockConfig)

    expect(TokenProviderService.refreshToken).not.toHaveBeenCalled()
    expect(result.headers.Authorization).toBe(`Bearer ${mockToken}`)
  })

  it('should continue with current token when refresh fails', async () => {
    const oldToken = createTestToken({ exp: nowInSeconds() + 180 }) // expires in 3 minutes

    localStorageMock.getItem.mockReturnValue(oldToken)
    vi.mocked(TokenProviderService.getRefreshPromise).mockReturnValue(undefined)
    vi.mocked(TokenProviderService.refreshToken).mockRejectedValue(new Error('Refresh failed'))

    const mockConfig = {
      url: '/api/normal-request',
      headers: {},
    }

    const result = await requestTokenInterceptor(mockConfig)

    expect(TokenProviderService.refreshToken).toHaveBeenCalled()
    expect(result.headers.Authorization).toBe(`Bearer ${oldToken}`)
  })
})
