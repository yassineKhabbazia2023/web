import { loggerWarnSpy, loggerErrorSpy, loggerMock } from '@pulse/toolbox/mocks'
import { SERVER_ZONE } from './constants'
import { Identify } from '@amplitude/analytics-browser'
import { AmplitudeUserType, AmplitudeDeviceSize } from '../../enums/amplitude.enums'

import { AmplitudeService } from './amplitude.service'

vi.mock('@pulse/toolbox', () => ({ logger: loggerMock }))

const initSpy = vi.fn()
const resetSpy = vi.fn()
const trackSpy = vi.fn()
const identifySpy = vi.fn()
const setUserIdSpy = vi.fn()
const addSpy = vi.fn()

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
    add: (plugin: any) => addSpy(plugin),
  }
})

const FAKE_API_KEY = '42'
const serverUrl = 'https://api.eu.amplitude.com/2/httpapi'
const CUSTOM_EVENT = 'custom event'
const CUSTOM_USER_ID = '123'
const mockAmplitudeSetup = {
  serverZone: SERVER_ZONE,
  defaultTracking: false,
  minIdLength: 1,
}

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

    expect(initSpy).toHaveBeenCalledExactlyOnceWith(FAKE_API_KEY, undefined, {
      ...mockAmplitudeSetup,
      serverUrl,
    })

  })

  it('can init without serverUrl', () => {
    expect(initSpy).toHaveBeenCalledTimes(0)

    AmplitudeService.init(FAKE_API_KEY)

    expect(initSpy).toHaveBeenCalledExactlyOnceWith(FAKE_API_KEY, undefined, mockAmplitudeSetup)

  })

  it('can track', () => {
    AmplitudeService.init(FAKE_API_KEY)

    expect(trackSpy).toHaveBeenCalledTimes(0)

    AmplitudeService.track(CUSTOM_EVENT)

    expect(trackSpy).toHaveBeenCalledExactlyOnceWith(CUSTOM_EVENT)
  })

  it('can set a user id', () => {
    AmplitudeService.init(FAKE_API_KEY)

    expect(setUserIdSpy).toHaveBeenCalledTimes(0)

    AmplitudeService.setUserId(CUSTOM_USER_ID)
    AmplitudeService.setUserId(CUSTOM_USER_ID) // second call should not change anything

    expect(setUserIdSpy).toHaveBeenCalledExactlyOnceWith(CUSTOM_USER_ID)
  })

  it('identifyCustomer can set new user property', () => {
    AmplitudeService.init(FAKE_API_KEY)

    const identifyEvent = new Identify()
    identifyEvent.set('user_type', AmplitudeUserType.CUSTOMER)

    expect(identifySpy).toHaveBeenCalledTimes(0)

    AmplitudeService.identifyCustomer()
    AmplitudeService.identifyCustomer() // second call should not change anything

    expect(identifySpy).toHaveBeenCalledExactlyOnceWith(identifyEvent)
  })

  it('identifyCollaborator can set new user property', () => {
    AmplitudeService.init(FAKE_API_KEY)

    const identifyEvent = new Identify()
    identifyEvent.set('user_type', AmplitudeUserType.COLLAB)

    expect(identifySpy).toHaveBeenCalledTimes(0)

    AmplitudeService.identifyCollaborator()
    AmplitudeService.identifyCollaborator() // second call should not change anything

    expect(identifySpy).toHaveBeenCalledExactlyOnceWith(identifyEvent)
  })

  it('setUserEmail can set new user property', () => {
    AmplitudeService.init(FAKE_API_KEY)

    const identifyEvent = new Identify()
    identifyEvent.set('email', 'john@example.com')

    expect(identifySpy).toHaveBeenCalledTimes(0)

    AmplitudeService.setUserEmail('john@example.com')
    AmplitudeService.setUserEmail('john@example.com') // second call should not change anything

    expect(identifySpy).toHaveBeenCalledExactlyOnceWith(identifyEvent)
  })

  it('init adds dynamic device size enrichment plugin', () => {
    AmplitudeService.init(FAKE_API_KEY)

    // Should have been called twice: once for session replay, once for device size
    expect(addSpy).toHaveBeenCalledTimes(2)
    const deviceSizePlugin = addSpy.mock.calls[1][0]
    expect(deviceSizePlugin.name).toBe('device-size-enrichment')
    expect(deviceSizePlugin.type).toBe('enrichment')
  })

  it('dynamic device size plugin enriches event based on window.innerWidth', async () => {
    Object.defineProperty(window, 'innerWidth', { value: 767, writable: true, configurable: true })

    AmplitudeService.init(FAKE_API_KEY)

    const deviceSizePlugin = addSpy.mock.calls[1][0]
    const testEvent = { event_type: 'test', event_properties: { existing: 'prop' } }
    const enrichedEvent = await deviceSizePlugin.execute(testEvent)

    expect(enrichedEvent.event_properties).toEqual({
      existing: 'prop',
      device_size: AmplitudeDeviceSize.MOBILE,
    })
  })

  it('dynamic device size plugin returns DESKTOP for width >= 768', async () => {
    Object.defineProperty(window, 'innerWidth', { value: 768, writable: true, configurable: true })

    AmplitudeService.init(FAKE_API_KEY)

    const deviceSizePlugin = addSpy.mock.calls[1][0]
    const testEvent = { event_type: 'test', event_properties: {} }
    const enrichedEvent = await deviceSizePlugin.execute(testEvent)

    expect(enrichedEvent.event_properties).toEqual({
      device_size: AmplitudeDeviceSize.DESKTOP,
    })
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

    it('setUserEmail should not operate', () => {
      AmplitudeService.setUserEmail('john@example.com')

      expect(identifySpy).not.toHaveBeenCalled()
    })

    it('reset should not operate', () => {
      AmplitudeService.reset()

      expect(resetSpy).not.toHaveBeenCalled()
    })
  })

  describe('error handling', () => {
    beforeEach(() => {
      resetAmplitudeService()
    })

    it('should log error when init is called with empty API key', () => {
      AmplitudeService.init('')

      expect(loggerErrorSpy).toHaveBeenCalledWith('Amplitude - API key is required for initialization')
      expect(initSpy).not.toHaveBeenCalled()
    })

    it('should log error when init is called with whitespace-only API key', () => {
      AmplitudeService.init('   ')

      expect(loggerErrorSpy).toHaveBeenCalledWith('Amplitude - API key is required for initialization')
      expect(initSpy).not.toHaveBeenCalled()
    })

    it('should log warning when track throws error', () => {
      AmplitudeService.init(FAKE_API_KEY)
      const trackError = new Error('Track failed')
      trackSpy.mockImplementationOnce(() => {
        throw trackError
      })

      AmplitudeService.track(CUSTOM_EVENT)

      expect(loggerWarnSpy).toHaveBeenCalledWith('Amplitude - failed to track event:', trackError)
    })

    it('should log warning when setUserId throws error', () => {
      AmplitudeService.init(FAKE_API_KEY)
      const setUserIdError = new Error('SetUserId failed')
      setUserIdSpy.mockImplementationOnce(() => {
        throw setUserIdError
      })

      AmplitudeService.setUserId(CUSTOM_USER_ID)

      expect(loggerWarnSpy).toHaveBeenCalledWith('Amplitude - failed to set user id:', setUserIdError)
    })

    it('should log warning when identify throws error', () => {
      AmplitudeService.init(FAKE_API_KEY)
      const identifyError = new Error('Identify failed')
      identifySpy.mockImplementationOnce(() => {
        throw identifyError
      })

      AmplitudeService.identifyCustomer()

      expect(loggerWarnSpy).toHaveBeenCalledWith('Amplitude - failed to set user property:', identifyError)
    })

    it('should log warning when reset throws error', () => {
      AmplitudeService.init(FAKE_API_KEY)
      const resetError = new Error('Reset failed')
      resetSpy.mockImplementationOnce(() => {
        throw resetError
      })

      AmplitudeService.reset()

      expect(loggerWarnSpy).toHaveBeenCalledWith('Amplitude - failed to reset:', resetError)
    })

    it.each([
      ['empty email', ''],
      ['undefined email', undefined],
      ['whitespace-only email', '   '],
    ])('should log warning when setUserEmail is called with %s', (_description, email) => {
      AmplitudeService.init(FAKE_API_KEY)

      AmplitudeService.setUserEmail(email)

      expect(loggerWarnSpy).toHaveBeenCalledWith('Amplitude - setUserEmail called with empty email, skipping')
      expect(identifySpy).not.toHaveBeenCalled()
    })
  })
})
