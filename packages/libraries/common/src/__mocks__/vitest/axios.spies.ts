import type { Mock } from 'vitest'

const defaults = {
  headers: {
    'Content-Type': '',
    Authorization: '',
  },
}

export const requestInterceptorMock: Mock = vi.fn(() => defaults)
export const responseInterceptorSuccessMock: Mock = vi.fn()
export const responseInterceptorErrorMock: Mock = vi.fn()

export const axiosMock = {
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
