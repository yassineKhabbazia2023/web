import { vi } from 'vitest'

export const amplitudeServiceInitMock = vi.fn()
export const amplitudeServiceResetMock = vi.fn()
export const amplitudeServiceTrackMock = vi.fn()
export const amplitudeServiceSetUserIdMock = vi.fn()
export const amplitudeServiceSetNewUserPropertyMock = vi.fn()
export const amplitudeServiceIdentifyCustomerMock = vi.fn()
export const amplitudeServiceIdentifyCollaboratorMock = vi.fn()

export const amplitudeServiceMock = {
  init: amplitudeServiceInitMock,
  reset: amplitudeServiceResetMock,
  track: amplitudeServiceTrackMock,
  setUserId: amplitudeServiceSetUserIdMock,
  setNewUserProperty: amplitudeServiceSetNewUserPropertyMock,
  identifyCustomer: amplitudeServiceIdentifyCustomerMock,
  identifyCollaborator: amplitudeServiceIdentifyCollaboratorMock,
}
