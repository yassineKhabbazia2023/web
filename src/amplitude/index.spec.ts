import { describe, expect, it, vi } from 'vitest'
import { SERVER_ZONE } from './constants'
import { Identify } from '@amplitude/analytics-browser'
import AmplitudeService from '.'

const initSpy = vi.fn()
const resetSpy = vi.fn()
const trackSpy = vi.fn()
const identifySpy = vi.fn()
const setUserIdSpy = vi.fn()

vi.mock('@amplitude/analytics-browser', async () => {
  const actual = await vi.importActual('@amplitude/analytics-browser')
  return {
    ...(actual as Object),
    init: (apiKey: string, userId = undefined, options: object) =>
      initSpy(apiKey, userId, options),
    setUserId: (arg: string) => setUserIdSpy(arg),
    track: (arg: string) => trackSpy(arg),
    identify: (arg: string) => identifySpy(arg),
    reset: () => resetSpy(),
  }
})

describe('amplitude', () => {
  let amplitudeService: AmplitudeService
  beforeEach(() => {
    amplitudeService = new AmplitudeService()
  })

  it('can init with serverUrl', () => {
    const FAKE_API_KEY = '42'

    expect(initSpy).toHaveBeenCalledTimes(0)

    const serverUrl = 'https://api.eu.amplitude.com/2/httpapi'

    amplitudeService.init(FAKE_API_KEY, serverUrl)
    amplitudeService.init(FAKE_API_KEY) // call init twice

    expect(initSpy).toHaveBeenCalledOnce()

    expect(initSpy).toHaveBeenCalledWith(FAKE_API_KEY, undefined, {
      serverZone: SERVER_ZONE,
      defaultTracking: false,
      serverUrl,
      minIdLength: 1,
    })
  })

  it('can init without serverUrl', () => {
    const FAKE_API_KEY = '42'

    expect(initSpy).toHaveBeenCalledTimes(0)

    amplitudeService.init(FAKE_API_KEY)

    expect(initSpy).toHaveBeenCalledOnce()

    expect(initSpy).toHaveBeenCalledWith(FAKE_API_KEY, undefined, {
      serverZone: SERVER_ZONE,
      defaultTracking: false,
      serverUrl: undefined,
      minIdLength: 1,
    })
  })

  it('can track', () => {
    const CUSTOM_EVENT = 'custom event'

    expect(trackSpy).toHaveBeenCalledTimes(0)

    amplitudeService.track(CUSTOM_EVENT)

    expect(trackSpy).toHaveBeenCalledOnce()
    expect(trackSpy).toHaveBeenCalledWith(CUSTOM_EVENT)
  })

  it('can set a user id', () => {
    const CUSTOM_USER_ID = 123

    expect(setUserIdSpy).toHaveBeenCalledTimes(0)

    amplitudeService.setUserId(CUSTOM_USER_ID)

    expect(setUserIdSpy).toHaveBeenCalledOnce()
    expect(setUserIdSpy).toHaveBeenCalledWith(CUSTOM_USER_ID.toString())
  })

  it('can set new user property', () => {
    const identifyEvent = new Identify()
    identifyEvent.set('user_type', 'Collaborator')

    expect(identifySpy).toHaveBeenCalledTimes(0)

    amplitudeService.setNewUserProperty('user_type', 'Collaborator')

    expect(identifySpy).toHaveBeenCalledOnce()
    expect(identifySpy).toHaveBeenCalledWith(identifyEvent)
  })

  it('can reset a user session', () => {
    expect(resetSpy).toHaveBeenCalledTimes(0)

    amplitudeService.reset()

    expect(resetSpy).toHaveBeenCalledOnce()
  })
})
