const defaults = {
  headers: {
    'Content-Type': '',
    Authorization: '',
  },
}

export const requestInterceptorMock = vi.fn(() => defaults)
export const responseInterceptorSuccessMock = vi.fn()
export const responseInterceptorErrorMock = vi.fn()

export default {
  defaults,
  create: vi.fn(function() {
    return {
      defaults,
      get: vi.fn((data) => Promise.resolve({ data })),
      post: vi.fn((data) => Promise.resolve({ data })),
      put: vi.fn((data) => Promise.resolve({ data })),
      delete: vi.fn((data) => Promise.resolve({ data })),
    }
  }),
}
