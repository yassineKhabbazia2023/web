import { getTokenMock, tokenServiceMock } from '@common/__mocks__/token.service.mocks'
import { requestTokenInterceptor } from './request-token.interceptor'

vi.mock('../../token', () => tokenServiceMock)

describe('requestTokenInterceptor', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should add Authorization header when token exists', () => {
    const mockToken = 'test-token'
    const mockConfig = { headers: {} }

    // Mock token service to return a token
    getTokenMock.mockReturnValue(mockToken)

    const result = requestTokenInterceptor(mockConfig)

    expect(result.headers.Authorization).toBe(`Bearer ${mockToken}`)
    expect(getTokenMock).toHaveBeenCalledTimes(1)
  })

  it('should not add Authorization header when token does not exist', () => {
    const mockConfig = { headers: {} }

    // Mock token service to return no token
    getTokenMock.mockReturnValue('')

    const result = requestTokenInterceptor(mockConfig)

    expect(result.headers.Authorization).toBeUndefined()
    expect(getTokenMock).toHaveBeenCalledTimes(1)
  })
})