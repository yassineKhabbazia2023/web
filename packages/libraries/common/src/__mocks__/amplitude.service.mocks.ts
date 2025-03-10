export const mockedAmplitudeServiceInit = vi.fn()
export const mockedAmplitudeServiceReset = vi.fn()
export const mockedAmplitudeServiceTrack = vi.fn()
export const mockedAmplitudeServiceSetUserId = vi.fn()
export const mockedAmplitudeServiceSetNewUserProperty = vi.fn()

export const mockedAmplitudeService = {
  init: mockedAmplitudeServiceInit,
  reset: mockedAmplitudeServiceReset,
  track: mockedAmplitudeServiceTrack,
  setUserId: mockedAmplitudeServiceSetUserId,
  setNewUserProperty: mockedAmplitudeServiceSetNewUserProperty,
}
