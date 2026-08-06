import { loggerMock } from '@pulse/toolbox/mocks'
import { DataGovernance } from '@configcat/sdk'
import { OpenFeatureService } from './open-feature.service'

import {
  setProviderAndWaitMock,
  getBooleanDetailsMock,
  getStringDetailsMock,
  getNumberDetailsMock,
  getObjectDetailsMock,
  configCatCreateMock,
  setContextMock,
} from '../../__mocks__/vitest'

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

    it('should not set any context when not initialized', async () => {
      await OpenFeatureService.setUserContext('user@pulse.fr')
      await OpenFeatureService.resetToAnonymousContext()

      expect(setContextMock).not.toHaveBeenCalled()
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

    it('should set an anonymous targeting key so ConfigCat always gets an identifier', async () => {
      setProviderAndWaitMock.mockResolvedValue(undefined)

      await OpenFeatureService.init('test-sdk-key')

      expect(setContextMock).toHaveBeenCalledWith({ targetingKey: 'anonymous' })
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

    it('should log a dedicated error and stay usable when the anonymous context cannot be set', async () => {
      setProviderAndWaitMock.mockResolvedValue(undefined)
      const error = new Error('context failed')
      setContextMock.mockRejectedValue(error)

      await OpenFeatureService.init('test-sdk-key')

      expect(loggerMock.error).toHaveBeenCalledWith('Failed to set the anonymous evaluation context', error)
      expect(loggerMock.info).toHaveBeenCalledWith('OpenFeature initialized with ConfigCat provider')
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

    it('should set the user email as targeting key', async () => {
      await OpenFeatureService.setUserContext('user@pulse.fr')

      expect(setContextMock).toHaveBeenCalledWith({ targetingKey: 'user@pulse.fr', email: 'user@pulse.fr' })
    })

    it('should fall back to the anonymous targeting key when the user context is reset', async () => {
      await OpenFeatureService.resetToAnonymousContext()

      expect(setContextMock).toHaveBeenCalledWith({ targetingKey: 'anonymous' })
    })
  })
})
