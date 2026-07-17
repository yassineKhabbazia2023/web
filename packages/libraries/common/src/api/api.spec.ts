import { requestTokenInterceptor } from './interceptors/request-token.interceptor'
import { responseInterceptorSuccess } from './interceptors/response-success.interceptor'
import { responseInterceptorError } from './interceptors/response-error.interceptor'

import { api, createApiInstance, domainToBaseUrl } from './api'

// No vi.mock here on purpose: every assertion runs against a real axios
// instance (creating one fires no request), so this spec cannot poison the
// shared module registry nor be poisoned by it when isolation is disabled.
// Note it imports './api' (the file), which the '@pulse/common/api' hub mock
// registered in vitest.setup.ts does not cover (different module id).
const getHandlers = (manager: unknown): { fulfilled?: unknown, rejected?: unknown }[] =>
  (manager as { handlers: { fulfilled?: unknown, rejected?: unknown }[] }).handlers

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

describe('createApiInstance', () => {
  it('should normalize the baseURL and set the Content-Type header', () => {
    const instance = createApiInstance('https://api.example.com/custom/')

    expect(instance.defaults.baseURL).toBe('https://api.example.com/custom')
    expect(instance.defaults.headers['Content-Type']).toBe('application/json')
  })

  it('should keep an undefined baseURL when no domain is provided', () => {
    const instance = createApiInstance(undefined)

    expect(instance.defaults.baseURL).toBeUndefined()
  })

  it('should wire the shared request and response interceptors', () => {
    const instance = createApiInstance('https://api.example.com/custom')

    const requestHandlers = getHandlers(instance.interceptors.request)
    expect(requestHandlers.map((handler) => handler.fulfilled)).toEqual([requestTokenInterceptor])

    const responseHandlers = getHandlers(instance.interceptors.response)
    expect(responseHandlers).toHaveLength(1)
    expect(responseHandlers[0].fulfilled).toBe(responseInterceptorSuccess)
    expect(responseHandlers[0].rejected).toBe(responseInterceptorError)
  })
})

describe('api.gateway (default instance)', () => {
  it('should be a memoized singleton', () => {
    expect(api.gateway).toBe(api.gateway)
  })

  it('should be built from VITE_API_GATEWAY with a normalized baseURL', () => {
    // Stable literal from the canonical env fixture (envVarsMock.VITE_API_GATEWAY)
    // instead of reusing the SUT's own domainToBaseUrl in the expectation.
    expect(api.gateway.defaults.baseURL).toBe('https://api.example.com/gateway')
  })

  it('should set the Content-Type header to application/json', () => {
    expect(api.gateway.defaults.headers['Content-Type']).toBe('application/json')
  })

  it('should wire the shared request and response interceptors', () => {
    expect(getHandlers(api.gateway.interceptors.request).map((handler) => handler.fulfilled))
      .toEqual([requestTokenInterceptor])

    const responseHandlers = getHandlers(api.gateway.interceptors.response)
    expect(responseHandlers).toHaveLength(1)
    expect(responseHandlers[0].fulfilled).toBe(responseInterceptorSuccess)
    expect(responseHandlers[0].rejected).toBe(responseInterceptorError)
  })
})
