import { requestTokenInterceptor } from './interceptors/request-token.interceptor'
import { responseInterceptorSuccess } from './interceptors/response-success.interceptor'
import { responseInterceptorError } from './interceptors/response-error.interceptor'

import { api, createApiInstance, domainToBaseUrl } from './api'

// Interceptor registrations are recorded into plain arrays (not vi mocks) so the
// import-time wiring of `api.gateway` survives the global clearMocks/restoreMocks.
const { createMock, requestHandlers, responseHandlers } = vi.hoisted(() => {
  const requestHandlers: unknown[] = []
  const responseHandlers: unknown[][] = []
  const createMock = vi.fn((config: { baseURL?: string; headers: Record<string, string> }) => ({
    defaults: config,
    interceptors: {
      request: { use: (handler: unknown) => requestHandlers.push(handler) },
      response: { use: (...handlers: unknown[]) => responseHandlers.push(handlers) },
    },
  }))
  return { createMock, requestHandlers, responseHandlers }
})

vi.mock('axios', () => ({ default: { create: createMock } }))
vi.mock('env-vars', () => ({ VITE_API_GATEWAY: 'https://api.example.com/gateway/' }))
vi.mock('./interceptors/request-token.interceptor', () => ({ requestTokenInterceptor: vi.fn() }))
vi.mock('./interceptors/response-success.interceptor', () => ({ responseInterceptorSuccess: vi.fn() }))
vi.mock('./interceptors/response-error.interceptor', () => ({ responseInterceptorError: vi.fn() }))

describe('domainToBaseUrl', () => {
  it('should return undefined when the domain is undefined', () => {
    expect(domainToBaseUrl(undefined)).toBeUndefined()
  })

  it('should strip a single trailing slash', () => {
    expect(domainToBaseUrl('https://api.example.com/gateway/')).toBe('https://api.example.com/gateway')
  })

  it('should leave a domain without trailing slash unchanged', () => {
    expect(domainToBaseUrl('https://api.example.com/gateway')).toBe('https://api.example.com/gateway')
  })
})

describe('api.gateway (default instance)', () => {
  it('should be built from VITE_API_GATEWAY with a normalized baseURL', () => {
    expect(api.gateway.defaults.baseURL).toBe('https://api.example.com/gateway')
  })

  it('should set the Content-Type header to application/json', () => {
    expect(api.gateway.defaults.headers['Content-Type']).toBe('application/json')
  })

  it('should wire the three shared interceptors', () => {
    expect(requestHandlers).toContain(requestTokenInterceptor)
    expect(responseHandlers).toContainEqual([responseInterceptorSuccess, responseInterceptorError])
  })
})

describe('createApiInstance', () => {
  beforeEach(() => {
    requestHandlers.length = 0
    responseHandlers.length = 0
  })

  it('should normalize the baseURL and set the Content-Type header', () => {
    const instance = createApiInstance('https://api.example.com/custom/')

    expect(instance.defaults.baseURL).toBe('https://api.example.com/custom')
    expect(instance.defaults.headers['Content-Type']).toBe('application/json')
  })

  it('should wire the shared request and response interceptors', () => {
    createApiInstance('https://api.example.com/custom')

    expect(requestHandlers).toEqual([requestTokenInterceptor])
    expect(responseHandlers).toEqual([[responseInterceptorSuccess, responseInterceptorError]])
  })

  it('should keep an undefined baseURL when no domain is provided', () => {
    const instance = createApiInstance(undefined)

    expect(instance.defaults.baseURL).toBeUndefined()
  })
})
