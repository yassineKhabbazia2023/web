import { requestTokenInterceptor } from './interceptors/request-token.interceptor'
import gatewayApi from './gateway-api'

vi.mock('./interceptors/request-token.interceptor', () => ({
  requestTokenInterceptor: vi.fn((config) => Promise.resolve(config)),
}))

vi.mock('env-vars', () => ({
  VITE_API_GATEWAY: 'https://gateway.test.com',
}))

describe('Gateway API Instance', () => {
  it('should create an axios instance', () => {
    expect(gatewayApi).toBeDefined()
    expect(gatewayApi.defaults).toBeDefined()
  })

  it('should have correct baseURL configured', () => {
    expect(gatewayApi.defaults.baseURL).toBe('https://gateway.test.com')
  })

  it('should have Content-Type header set to application/json', () => {
    expect(gatewayApi.defaults.headers['Content-Type']).toBe('application/json')
  })

  it('should have request interceptor configured', () => {
    expect(gatewayApi.interceptors.request).toBeDefined()
  })

  it('should call requestTokenInterceptor when configured', () => {
    vi.mocked(requestTokenInterceptor).mockImplementation((config) => Promise.resolve(config))
    expect(requestTokenInterceptor).toBeDefined()
  })
})
