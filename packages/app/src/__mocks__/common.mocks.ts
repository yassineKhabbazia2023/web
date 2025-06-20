import { vi } from 'vitest'

export const commonMock = {
  getInitials: vi.fn(),
  commoni18n: vi.fn(),
  commonApi: () => ({
    gateway: {
      get: () => Promise.resolve({ data: {} }),
    },
  }),
  routes: {
    value: [],
  },
  amplitudeService: {
    init: vi.fn(),
    track: vi.fn(),
    setUserId: vi.fn(),
  },
}
