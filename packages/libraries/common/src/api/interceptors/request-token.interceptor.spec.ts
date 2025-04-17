import { requestTokenInterceptor } from './request-token.interceptor'
import { useTokenStore } from '../../stores/token/token.store'
import { getStoreMock } from '../../__mocks__/store.mocks'

const tokenStoreMock = getStoreMock(useTokenStore)

describe('requestTokenInterceptor', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should add Authorization header when token exists', () => {
    const mockToken = 'test-token'
    const mockConfig = { headers: {} }

    tokenStoreMock.token = mockToken

    const result = requestTokenInterceptor(mockConfig)

    expect(result.headers.Authorization).toBe(`Bearer ${mockToken}`)
  })

  it('should not add Authorization header when token does not exist', () => {
    const mockConfig = { headers: {} }

    tokenStoreMock.token = ''

    const result = requestTokenInterceptor(mockConfig)

    expect(result.headers.Authorization).toBeUndefined()
  })
})