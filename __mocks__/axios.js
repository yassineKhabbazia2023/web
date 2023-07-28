import { vi } from 'vitest'
import {
  requestInterceptor,
  responseInterceptorSuccess,
  responseInterceptorError
} from '../src/api'

// this is just a default mock...
// we'll override it in our test with something more specific with:
// vi.mock('axios', yourmock)
const defaults = {
  headers: {
    'Content-Type': '',
    Authorization: ''
  }
}
export default {
  defaults,
  create: vi.fn(function() {
    return {
      interceptors: {
        request: {
          use: vi.fn(() => requestInterceptor(defaults))
        },
        response: {
          use: vi.fn(() => responseInterceptorSuccess, responseInterceptorError)
        }
      },

      defaults,
      get: vi.fn((data) => Promise.resolve({ data })),
      post: vi.fn((data) => Promise.resolve({ data })),
      put: vi.fn((data) => Promise.resolve({ data })),
      delete: vi.fn((data) => Promise.resolve({ data }))
    }
  })
}
