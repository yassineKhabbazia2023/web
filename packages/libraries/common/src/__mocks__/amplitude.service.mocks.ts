import { vi } from 'vitest'

export const AmplitudeServiceMock = {
  init: vi.fn(),
  reset: vi.fn(),
  track: vi.fn(),
  setUserId: vi.fn(),
  setUserEmail: vi.fn(),
  setNewUserProperty: vi.fn(),
  identifyCustomer: vi.fn(),
  identifyCollaborator: vi.fn(),
}
