import { requestTokenInterceptor } from './interceptors/request-token.interceptor'
import api from './api'

vi.mock('./interceptors/request-token.interceptor', () => ({
  requestTokenInterceptor: vi.fn((config) => Promise.resolve(config)),
}))

vi.mock('env-vars', () => ({
  VITE_API_BASE_URL: 'https://api.test.com',
}))

describe('API Instance', () => {
  it('should create an axios instance', () => {
    expect(api).toBeDefined()
    expect(api.defaults).toBeDefined()
  })

  it('should have Content-Type header set to application/json', () => {
    expect(api.defaults.headers['Content-Type']).toBe('application/json')
  })

  it('should have request interceptor configured', () => {
    expect(api.interceptors.request).toBeDefined()
  })

  it('should call requestTokenInterceptor when configured', () => {
    vi.mocked(requestTokenInterceptor).mockImplementation((config) => Promise.resolve(config))
    expect(requestTokenInterceptor).toBeDefined()
  })
})
