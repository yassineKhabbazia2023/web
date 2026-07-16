import { loggerMock } from '@pulse/toolbox/mocks'
import { DataGovernance } from '@configcat/sdk'
import { OpenFeatureService } from './open-feature.service'

vi.mock('@pulse/toolbox', () => ({
  logger: loggerMock,
}))

const setProviderAndWaitMock = vi.fn()
const setContextMock = vi.fn()
const clearContextMock = vi.fn()
const getBooleanDetailsMock = vi.fn()
const getStringDetailsMock = vi.fn()
const getNumberDetailsMock = vi.fn()
const getObjectDetailsMock = vi.fn()

vi.mock('@openfeature/web-sdk', () => ({
  OpenFeature: {
    setProviderAndWait: (provider: unknown) => setProviderAndWaitMock(provider),
    setContext: (context: unknown) => setContextMock(context),
    clearContext: () => clearContextMock(),
    getClient: () => ({
      getBooleanDetails: (flagKey: string, defaultValue: boolean) => getBooleanDetailsMock(flagKey, defaultValue),
      getStringDetails: (flagKey: string, defaultValue: string) => getStringDetailsMock(flagKey, defaultValue),
      getNumberDetails: (flagKey: string, defaultValue: number) => getNumberDetailsMock(flagKey, defaultValue),
      getObjectDetails: (flagKey: string, defaultValue: unknown) => getObjectDetailsMock(flagKey, defaultValue),
    }),
  },
}))

const configCatCreateMock = vi.fn((_sdkKey: string, _options?: unknown) => 'mocked-provider')

vi.mock('@openfeature/config-cat-web-provider', () => ({
  ConfigCatWebProvider: {
    create: (sdkKey: string, options?: unknown) => configCatCreateMock(sdkKey, options),
  },
}))

describe('OpenFeatureService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    OpenFeatureService.resetForTesting()
  })

  describe('before init', () => {
    it('should return default boolean value when not initialized', () => {
      const result = OpenFeatureService.getBooleanValue('someFlag', false)

      expect(result).toBe(false)
      expect(getBooleanDetailsMock).not.toHaveBeenCalled()
    })

    it('should return default string value when not initialized', () => {
      const result = OpenFeatureService.getStringValue('someFlag', 'default')

      expect(result).toBe('default')
      expect(getStringDetailsMock).not.toHaveBeenCalled()
    })

    it('should return default number value when not initialized', () => {
      const result = OpenFeatureService.getNumberValue('someFlag', 42)

      expect(result).toBe(42)
      expect(getNumberDetailsMock).not.toHaveBeenCalled()
    })

    it('should return default object value when not initialized', () => {
      const defaultValue = { key: 'value' }
      const result = OpenFeatureService.getObjectValue('someFlag', defaultValue)

      expect(result).toEqual({ key: 'value' })
      expect(getObjectDetailsMock).not.toHaveBeenCalled()
    })
  })

  describe('init', () => {
    it('should initialize with ConfigCat provider', async () => {
      setProviderAndWaitMock.mockResolvedValue(undefined)

      await OpenFeatureService.init('test-sdk-key')

      expect(configCatCreateMock).toHaveBeenCalledWith('test-sdk-key', {
        dataGovernance: DataGovernance.EuOnly,
        flagOverrides: undefined,
      })
      expect(setProviderAndWaitMock).toHaveBeenCalledWith('mocked-provider')
      expect(loggerMock.info).toHaveBeenCalledWith('OpenFeature initialized with ConfigCat provider')
    })

    it('should pass flagOverrides to ConfigCat provider when provided', async () => {
      setProviderAndWaitMock.mockResolvedValue(undefined)
      const fakeFlagOverrides = { dataSource: {}, behaviour: 1 } as never

      await OpenFeatureService.init('test-sdk-key', { flagOverrides: fakeFlagOverrides })

      expect(configCatCreateMock).toHaveBeenCalledWith('test-sdk-key', {
        dataGovernance: DataGovernance.EuOnly,
        flagOverrides: fakeFlagOverrides,
      })
    })

    it('should log error when initialization fails', async () => {
      const error = new Error('init failed')
      setProviderAndWaitMock.mockRejectedValue(error)

      await OpenFeatureService.init('bad-key')

      expect(loggerMock.error).toHaveBeenCalledWith('Failed to initialize OpenFeature', error)
    })
  })

  describe('after init', () => {
    beforeEach(async () => {
      setProviderAndWaitMock.mockResolvedValue(undefined)
      await OpenFeatureService.init('test-sdk-key')
      vi.clearAllMocks()
    })

    it('should delegate getBooleanValue to OpenFeature client', () => {
      getBooleanDetailsMock.mockReturnValue({ flagKey: 'myFlag', value: true, flagMetadata: {} })

      const result = OpenFeatureService.getBooleanValue('myFlag', false)

      expect(getBooleanDetailsMock).toHaveBeenCalledWith('myFlag', false)
      expect(result).toBe(true)
    })

    it('should delegate getStringValue to OpenFeature client', () => {
      getStringDetailsMock.mockReturnValue({ flagKey: 'myFlag', value: 'hello', flagMetadata: {} })

      const result = OpenFeatureService.getStringValue('myFlag', 'default')

      expect(getStringDetailsMock).toHaveBeenCalledWith('myFlag', 'default')
      expect(result).toBe('hello')
    })

    it('should delegate getNumberValue to OpenFeature client', () => {
      getNumberDetailsMock.mockReturnValue({ flagKey: 'myFlag', value: 99, flagMetadata: {} })

      const result = OpenFeatureService.getNumberValue('myFlag', 0)

      expect(getNumberDetailsMock).toHaveBeenCalledWith('myFlag', 0)
      expect(result).toBe(99)
    })

    it('should delegate getObjectValue to OpenFeature client', () => {
      const expected = { foo: 'bar' }
      getObjectDetailsMock.mockReturnValue({ flagKey: 'myFlag', value: expected, flagMetadata: {} })

      const result = OpenFeatureService.getObjectValue('myFlag', {})

      expect(getObjectDetailsMock).toHaveBeenCalledWith('myFlag', {})
      expect(result).toEqual(expected)
    })

    it('should log error when evaluation fails and still return the value', () => {
      getBooleanDetailsMock.mockReturnValue({
        flagKey: 'failingFlag',
        value: false,
        errorCode: 'FLAG_NOT_FOUND',
        errorMessage: 'Flag not found',
        flagMetadata: {},
      })

      const result = OpenFeatureService.getBooleanValue('failingFlag', false)

      expect(result).toBe(false)
      expect(loggerMock.trace).toHaveBeenCalledWith(
        'OpenFeature flag \'failingFlag\' evaluation failed: Flag not found',
        'FLAG_NOT_FOUND',
      )
    })

    it('should not log error when evaluation succeeds', () => {
      getBooleanDetailsMock.mockReturnValue({ flagKey: 'myFlag', value: true, flagMetadata: {} })

      OpenFeatureService.getBooleanValue('myFlag', false)

      expect(loggerMock.trace).not.toHaveBeenCalled()
    })

    it('should set the user context with the email as targeting key', async () => {
      await OpenFeatureService.setUserContext('user@example.com')

      expect(setContextMock).toHaveBeenCalledWith({ targetingKey: 'user@example.com', email: 'user@example.com' })
    })

    it('should clear the user context', async () => {
      await OpenFeatureService.clearUserContext()

      expect(clearContextMock).toHaveBeenCalled()
    })
  })

  describe('user context before init', () => {
    it('should not set the context when not initialized', async () => {
      await OpenFeatureService.setUserContext('user@example.com')

      expect(setContextMock).not.toHaveBeenCalled()
    })

    it('should not clear the context when not initialized', async () => {
      await OpenFeatureService.clearUserContext()

      expect(clearContextMock).not.toHaveBeenCalled()
    })
  })
})
