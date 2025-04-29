import { requestTokenInterceptor } from './request-token.interceptor'
import { TokenManager } from '../../managers/token/token.manager'

describe('requestTokenInterceptor', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should add Authorization header when token exists', () => {
    const mockToken = 'test-token'
    vi.spyOn(TokenManager, 'getToken').mockReturnValue(mockToken)
    const mockConfig = { headers: {} }

    const result = requestTokenInterceptor(mockConfig)

    expect(result.headers.Authorization).toBe(`Bearer ${mockToken}`)
  })

  it('should not add Authorization header when token does not exist', () => {
    const mockConfig = { headers: {} }

    const result = requestTokenInterceptor(mockConfig)

    expect(result.headers.Authorization).toBeUndefined()
  })
})