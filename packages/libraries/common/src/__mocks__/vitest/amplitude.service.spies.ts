import { type Mock, vi } from 'vitest'

export const AmplitudeServiceMock: {
  init: Mock
  reset: Mock
  track: Mock
  setUserId: Mock
  setUserEmail: Mock
  setNewUserProperty: Mock
  identifyCustomer: Mock
  identifyCollaborator: Mock
} = {
  init: vi.fn(),
  reset: vi.fn(),
  track: vi.fn(),
  setUserId: vi.fn(),
  setUserEmail: vi.fn(),
  setNewUserProperty: vi.fn(),
  identifyCustomer: vi.fn(),
  identifyCollaborator: vi.fn(),
}

export const TrackingCenterMock: {
  trackHomepageConsulted: Mock
} = {
  trackHomepageConsulted: vi.fn(),
}
