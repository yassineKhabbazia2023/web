import { loggerMock } from '@pulse/toolbox/mocks'
import { envVarsMock } from '@pulse/common/mocks'
import { CurrentUserManager, FeatureFlagManager } from '@pulse/common/managers'
import { AmplitudeService } from '@pulse/common/services/amplitude'

import { CollaboratorBootManager } from './collaborator.boot.manager'

describe('CollaboratorBootManager', () => {
  describe('checkMaintenanceMode', () => {
    it('should return true and log when maintenance mode is activated', () => {
      vi.spyOn(FeatureFlagManager, 'isMaintenanceModeActivated').mockReturnValue(true)

      const result = CollaboratorBootManager.checkMaintenanceMode()

      expect(result).toBe(true)
      expect(loggerMock.info).toHaveBeenCalledWith('Maintenance mode is activated')
    })

    it('should return false when maintenance mode is not activated', () => {
      vi.spyOn(FeatureFlagManager, 'isMaintenanceModeActivated').mockReturnValue(false)

      const result = CollaboratorBootManager.checkMaintenanceMode()

      expect(result).toBe(false)
    })
  })
  describe('getDefaultRedirection', () => {
    it('should return the default authenticated route when user is authenticated', () => {
      vi.spyOn(CurrentUserManager, 'isAuthenticated').mockReturnValue(true)

      const result = CollaboratorBootManager.getDefaultRedirection()

      expect(result).toEqual(CollaboratorBootManager.getDefaultAuthenticatedRoute())
    })
    it('should return the default anonymous route when user is not authenticated', () => {
      vi.spyOn(CurrentUserManager, 'isAuthenticated').mockReturnValue(false)

      const result = CollaboratorBootManager.getDefaultRedirection()

      expect(result).toEqual(CollaboratorBootManager.getDefaultAnonymousRoute())
    })
  })
  describe('initAmplitude', () => {
    it('should initialize amplitude with the correct parameters', () => {
      const amplitudeInitSpy = vi.spyOn(AmplitudeService, 'init')
      const originalValue = envVarsMock.VITE_AMPLITUDE_API_KEY
      vi.spyOn(FeatureFlagManager, 'isAmplitudeActivated').mockReturnValue(true)
      envVarsMock.VITE_AMPLITUDE_API_KEY = 'existing-key'

      CollaboratorBootManager.initAmplitude()

      expect(amplitudeInitSpy).toHaveBeenCalledWith(
        envVarsMock.VITE_AMPLITUDE_API_KEY,
        envVarsMock.VITE_AMPLITUDE_SERVER_URL,
      )
      // restore the original value of the mock
      envVarsMock.VITE_AMPLITUDE_API_KEY = originalValue
    })
    it('should NOT initialize amplitude if there is no VITE_AMPLITUDE_API_KEY', () => {
      const amplitudeInitSpy = vi.spyOn(AmplitudeService, 'init')
      const originalValue = envVarsMock.VITE_AMPLITUDE_API_KEY
      vi.spyOn(FeatureFlagManager, 'isAmplitudeActivated').mockReturnValue(true)
      envVarsMock.VITE_AMPLITUDE_API_KEY = ''

      CollaboratorBootManager.initAmplitude()
      expect(amplitudeInitSpy).not.toHaveBeenCalled()
      // restore the original value of the mock
      envVarsMock.VITE_AMPLITUDE_API_KEY = originalValue
    })
    it('does not initialize Amplitude when the feature flag is disabled', () => {
      const amplitudeInitSpy = vi.spyOn(AmplitudeService, 'init')
      vi.spyOn(FeatureFlagManager, 'isAmplitudeActivated').mockReturnValue(false)

      CollaboratorBootManager.initAmplitude()

      expect(amplitudeInitSpy).not.toHaveBeenCalled()
    })
    it('should not throw an error if amplitude initialization fails', () => {
      vi.spyOn(FeatureFlagManager, 'isAmplitudeActivated').mockReturnValue(true)
      const amplitudeInitError = new Error('Initialization failed')
      const amplitudeInitSpy = vi.spyOn(AmplitudeService, 'init').mockImplementation(() => {
        throw amplitudeInitError
      })

      expect(() => CollaboratorBootManager.initAmplitude()).not.toThrow()
      expect(amplitudeInitSpy).toHaveBeenCalled()
      expect(loggerMock.error).toHaveBeenCalledExactlyOnceWith('Amplitude initialization failed:', amplitudeInitError)
    })
  })
})
