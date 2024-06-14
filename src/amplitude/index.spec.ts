import { describe, expect, it, vi } from 'vitest'
import { DEFAULT_TRACKING, SERVER_ZONE } from './constants'
import { AmplitudeService } from '.'

const initSpy = vi.fn()
const trackSpy = vi.fn()
const setUserIdSpy = vi.fn()
vi.mock('@amplitude/analytics-browser', () => ({
  init: (apiKey: string, options: object) => initSpy(apiKey, options),
  setUserId: (arg: string) => setUserIdSpy(arg),
  track: (arg: string) => trackSpy(arg),
}))

let amplitudeService: AmplitudeService

describe('amplitude', () => {
  beforeEach(() => {
    amplitudeService = AmplitudeService.getInstance()
  })

  it('can init', () => {
    const FAKE_API_KEY = '42'

    expect(initSpy).toHaveBeenCalledTimes(0)

    amplitudeService.init(FAKE_API_KEY)

    expect(initSpy).toHaveBeenCalledTimes(1)
    expect(initSpy).toHaveBeenCalledWith(
      FAKE_API_KEY,
      {
        serverZone: SERVER_ZONE,
        defaultTracking: DEFAULT_TRACKING,
      }
    )
  })

  it('can track', () => {
    const CUSTOM_EVENT = 'custom event'

    expect(trackSpy).toHaveBeenCalledTimes(0)

    amplitudeService.track(CUSTOM_EVENT)

    expect(trackSpy).toHaveBeenCalledTimes(1)
    expect(trackSpy).toHaveBeenCalledWith(CUSTOM_EVENT)
  })

  it('can set a user id', () => {
    const CUSTOM_USER_ID = 'customUserId@labas.be'

    expect(setUserIdSpy).toHaveBeenCalledTimes(0)

    amplitudeService.setUserId(CUSTOM_USER_ID)

    expect(setUserIdSpy).toHaveBeenCalledTimes(1)
    expect(setUserIdSpy).toHaveBeenCalledWith(CUSTOM_USER_ID)
  })
})
