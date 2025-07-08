import { vi } from 'vitest'

export const commonMock = {
  getInitials: vi.fn(),
  commonApi: () => ({
    gateway: {
      get: () => Promise.resolve({ data: {} }),
    },
  }),
  routes: {
    value: [],
  },
}
