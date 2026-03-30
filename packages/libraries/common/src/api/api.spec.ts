import { envVarsMock } from '@pulse/common/mocks'

const {
  axiosCreateMock,
  requestUseMock,
  responseUseMock,
  requestTokenInterceptorMock,
}: {
  axiosCreateMock: any
  requestUseMock: any
  responseUseMock: any
  requestTokenInterceptorMock: any
} = vi.hoisted(() => {
  const requestUseMock = vi.fn()
  const responseUseMock = vi.fn()
  const requestTokenInterceptorMock = vi.fn((config: any) => config)
  const axiosCreateMock = vi.fn(() => ({
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: {
        use: requestUseMock,
      },
      response: {
        use: responseUseMock,
      },
    },
  }))

  return {
    axiosCreateMock,
    requestUseMock,
    responseUseMock,
    requestTokenInterceptorMock,
  }
})

vi.mock('env-vars', () => envVarsMock)

vi.mock('axios', () => ({
  default: {
    create: axiosCreateMock,
  },
}))

vi.mock('./interceptors/request-token.interceptor', () => ({
  requestTokenInterceptor: requestTokenInterceptorMock,
}))

describe('api', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
  })

  it('should create gateway, backofficeGateway and backofficeApi with expected interceptors', async () => {
    const { api } = await import('./api')
    const { responseInterceptorSuccess } = await import('./interceptors/response-success.interceptor')
    const { responseInterceptorError } = await import('./interceptors/response-error.interceptor')

    expect(api.gateway).toBeDefined()
    expect(api.backofficeGateway).toBeDefined()
    expect(api.backofficeApi).toBeDefined()
    expect(axiosCreateMock).toHaveBeenCalledTimes(3)
    expect(axiosCreateMock).toHaveBeenNthCalledWith(1, {
      baseURL: envVarsMock.VITE_API_GATEWAY,
      headers: { 'Content-type': 'application/json' },
    })
    expect(axiosCreateMock).toHaveBeenNthCalledWith(2, {
      baseURL: envVarsMock.VITE_API_GATEWAY,
      headers: { 'Content-type': 'application/json' },
    })
    expect(axiosCreateMock).toHaveBeenNthCalledWith(3, {
      baseURL: envVarsMock.VITE_API_BASE_URL,
      headers: { 'Content-type': 'application/json' },
    })
    // All instances use requestTokenInterceptor directly
    expect(requestUseMock).toHaveBeenCalledTimes(3)
    expect(requestUseMock).toHaveBeenNthCalledWith(1, requestTokenInterceptorMock)
    expect(requestUseMock).toHaveBeenNthCalledWith(2, requestTokenInterceptorMock)
    expect(requestUseMock).toHaveBeenNthCalledWith(3, requestTokenInterceptorMock)
    expect(responseUseMock).toHaveBeenCalledTimes(3)
    expect(responseUseMock).toHaveBeenNthCalledWith(1, responseInterceptorSuccess, responseInterceptorError)
    expect(responseUseMock).toHaveBeenNthCalledWith(2, responseInterceptorSuccess, responseInterceptorError)
    expect(responseUseMock).toHaveBeenNthCalledWith(3, responseInterceptorSuccess, responseInterceptorError)
  })
})
