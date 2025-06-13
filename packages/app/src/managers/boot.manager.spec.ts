import { envVarsMock, featureFlagManagerMock, loggerMock } from '@pulse/core/mocks'
import { CurrentUserManager } from '@pulse/common/managers'
import { amplitudeService } from '@pulse/common'

import { BootManager } from './boot.manager'

vi.mock('env-vars', () => envVarsMock)
vi.mock('@pulse/core', () => ({
  logger: loggerMock,
  FeatureFlagManager: featureFlagManagerMock,
}))

describe('BootManager', () => {
  describe('getDefaultRedirection', () => {
    it('should return the default authenticated route when user is authenticated', () => {
      vi.spyOn(CurrentUserManager, 'isAuthenticated').mockReturnValue(true)

      const result = BootManager.getDefaultRedirection()

      expect(result).toEqual(BootManager.getDefaultAuthenticatedRoute())
    })
    it('should return the default anonymous route when user is not authenticated', () => {
      vi.spyOn(CurrentUserManager, 'isAuthenticated').mockReturnValue(false)

      const result = BootManager.getDefaultRedirection()

      expect(result).toEqual(BootManager.getDefaultAnonymousRoute())
    })
  })
  describe('initAmplitude', () => {
    it('should initialize amplitude with the correct parameters', () => {
      const amplitudeInitSpy = vi.spyOn(amplitudeService, 'init')
      const originalValue = envVarsMock.VITE_AMPLITUDE_API_KEY
      featureFlagManagerMock.isAmplitudeActivated.mockReturnValue(true)
      envVarsMock.VITE_AMPLITUDE_API_KEY = 'existing-key'

      BootManager.initAmplitude()

      expect(amplitudeInitSpy).toHaveBeenCalledWith(
        envVarsMock.VITE_AMPLITUDE_API_KEY,
        envVarsMock.VITE_AMPLITUDE_SERVER_URL,
      )
      // restore the original value of the mock
      envVarsMock.VITE_AMPLITUDE_API_KEY = originalValue
    })
    it('should NOT initialize amplitude if there is no VITE_AMPLITUDE_API_KEY', () => {
      const amplitudeInitSpy = vi.spyOn(amplitudeService, 'init')
      const originalValue = envVarsMock.VITE_AMPLITUDE_API_KEY
      featureFlagManagerMock.isAmplitudeActivated.mockReturnValue(true)
      envVarsMock.VITE_AMPLITUDE_API_KEY = ''

      BootManager.initAmplitude()
      expect(amplitudeInitSpy).not.toHaveBeenCalled()
      // restore the original value of the mock
      envVarsMock.VITE_AMPLITUDE_API_KEY = originalValue
    })
    it('does not initialize Amplitude when the feature flag is disabled', () => {
      const amplitudeInitSpy = vi.spyOn(amplitudeService, 'init')
      featureFlagManagerMock.isAmplitudeActivated.mockReturnValue(false) // Disable feature flag for Amplitude

      BootManager.initAmplitude()

      expect(amplitudeInitSpy).not.toHaveBeenCalled()
    })
    it('should not throw an error if amplitude initialization fails', () => {
      featureFlagManagerMock.isAmplitudeActivated.mockReturnValue(true)
      const amplitudeInitError = new Error('Initialization failed')
      const amplitudeInitSpy = vi.spyOn(amplitudeService, 'init').mockImplementation(() => {
        throw amplitudeInitError
      })

      expect(() => BootManager.initAmplitude()).not.toThrow()
      expect(amplitudeInitSpy).toHaveBeenCalled()
      expect(loggerMock.error).toHaveBeenCalledOnce()
      expect(loggerMock.error).toHaveBeenCalledWith('Amplitude initialization failed:', amplitudeInitError)
    })
  })
})
