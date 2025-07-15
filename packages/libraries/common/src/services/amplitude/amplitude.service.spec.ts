import { SERVER_ZONE } from './constants'
import { Identify } from '@amplitude/analytics-browser'
import { AmplitudeService } from './amplitude.service'
import { AmplitudeUserType } from '@common/enums/amplitude.enums'

const initSpy = vi.fn()
const resetSpy = vi.fn()
const trackSpy = vi.fn()
const identifySpy = vi.fn()
const setUserIdSpy = vi.fn()

vi.mock('@amplitude/analytics-browser', async () => {
  const actual = await vi.importActual('@amplitude/analytics-browser')
  return {
    ...(actual as object),
    init: (apiKey: string, userId = undefined, options: object) =>
      initSpy(apiKey, userId, options),
    setUserId: (arg: string) => setUserIdSpy(arg),
    track: (arg: string) => trackSpy(arg),
    identify: (arg: string) => identifySpy(arg),
    reset: () => resetSpy(),
  }
})

const FAKE_API_KEY = '42'
const serverUrl = 'https://api.eu.amplitude.com/2/httpapi'
const CUSTOM_EVENT = 'custom event'
const CUSTOM_USER_ID = '123'

// Helper function to reset AmplitudeService static properties
const resetAmplitudeService = () => {
  // Use defensive semicolon to prevent Automatic Semicolon Insertion issues
  ;(AmplitudeService as any).initialized = false
  ;(AmplitudeService as any).currentUserId = ''
  ;(AmplitudeService as any).userProperty = {}
}


describe('amplitude', () => {
  beforeEach(() => {
    resetAmplitudeService()
  })

  it('can init with serverUrl', () => {
    expect(initSpy).toHaveBeenCalledTimes(0)

    AmplitudeService.init(FAKE_API_KEY, serverUrl)
    AmplitudeService.init(FAKE_API_KEY) // call init twice

    expect(initSpy).toHaveBeenCalledOnce()

    expect(initSpy).toHaveBeenCalledWith(FAKE_API_KEY, undefined, {
      serverZone: SERVER_ZONE,
      defaultTracking: false,
      serverUrl,
      minIdLength: 1,
    })
  })

  it('can init without serverUrl', () => {
    expect(initSpy).toHaveBeenCalledTimes(0)

    AmplitudeService.init(FAKE_API_KEY)

    expect(initSpy).toHaveBeenCalledOnce()

    expect(initSpy).toHaveBeenCalledWith(FAKE_API_KEY, undefined, {
      serverZone: SERVER_ZONE,
      defaultTracking: false,
      serverUrl: undefined,
      minIdLength: 1,
    })
  })

  it('can track', () => {
    AmplitudeService.init(FAKE_API_KEY)

    expect(trackSpy).toHaveBeenCalledTimes(0)

    AmplitudeService.track(CUSTOM_EVENT)

    expect(trackSpy).toHaveBeenCalledOnce()
    expect(trackSpy).toHaveBeenCalledWith(CUSTOM_EVENT)
  })

  it('can set a user id', () => {
    AmplitudeService.init(FAKE_API_KEY)

    expect(setUserIdSpy).toHaveBeenCalledTimes(0)

    AmplitudeService.setUserId(CUSTOM_USER_ID)
    AmplitudeService.setUserId(CUSTOM_USER_ID) // second call should not change anything

    expect(setUserIdSpy).toHaveBeenCalledOnce()
    expect(setUserIdSpy).toHaveBeenCalledWith(CUSTOM_USER_ID)
  })

  it('identifyCustomer can set new user property', () => {
    AmplitudeService.init(FAKE_API_KEY)

    const identifyEvent = new Identify()
    identifyEvent.set('user_type', AmplitudeUserType.CUSTOMER)

    expect(identifySpy).toHaveBeenCalledTimes(0)

    AmplitudeService.identifyCustomer()
    AmplitudeService.identifyCustomer() // second call should not change anything

    expect(identifySpy).toHaveBeenCalledOnce()
    expect(identifySpy).toHaveBeenCalledWith(identifyEvent)
  })

  it('identifyCollaborator can set new user property', () => {
    AmplitudeService.init(FAKE_API_KEY)

    const identifyEvent = new Identify()
    identifyEvent.set('user_type', AmplitudeUserType.COLLAB)

    expect(identifySpy).toHaveBeenCalledTimes(0)

    AmplitudeService.identifyCollaborator()
    AmplitudeService.identifyCollaborator() // second call should not change anything

    expect(identifySpy).toHaveBeenCalledOnce()
    expect(identifySpy).toHaveBeenCalledWith(identifyEvent)
  })

  it('can reset a user session', () => {
    AmplitudeService.init(FAKE_API_KEY)

    expect(resetSpy).toHaveBeenCalledTimes(0)

    AmplitudeService.reset()

    expect(resetSpy).toHaveBeenCalledOnce()
  })

  describe('when isInitialized is false', () => {
    beforeEach(() => {
      resetAmplitudeService()
    })

    it('track should not operate', () => {
      expect(AmplitudeService.track(CUSTOM_EVENT)).toBeUndefined()
      expect(trackSpy).not.toHaveBeenCalled()
    })

    it('setUserId should not operate', () => {
      AmplitudeService.setUserId(CUSTOM_USER_ID)

      expect(setUserIdSpy).not.toHaveBeenCalled()
    })

    it('identifyCustomer should not operate', () => {
      AmplitudeService.identifyCustomer()

      expect(identifySpy).not.toHaveBeenCalled()
    })

    it('identifyCollaborator should not operate', () => {
      AmplitudeService.identifyCollaborator()

      expect(identifySpy).not.toHaveBeenCalled()
    })

    it('reset should not operate', () => {
      AmplitudeService.reset()

      expect(resetSpy).not.toHaveBeenCalled()
    })
  })
})
