import { envVarsMock } from '@pulse/core/mocks'
import { CurrentUserManager } from '@pulse/common/managers'
import { amplitudeService } from '@pulse/common'

import { BootManager } from './boot.manager'

vi.mock('env-vars', () => envVarsMock)

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
      envVarsMock.VITE_AMPLITUDE_API_KEY = ''

      BootManager.initAmplitude()
      expect(amplitudeInitSpy).not.toHaveBeenCalled()
      // restore the original value of the mock
      envVarsMock.VITE_AMPLITUDE_API_KEY = originalValue
    })
    it('should not throw an error if amplitude initialization fails', () => {
      const amplitudeInitSpy = vi.spyOn(amplitudeService, 'init').mockImplementation(() => {
        throw new Error('Initialization failed')
      })

      expect(() => BootManager.initAmplitude()).not.toThrow()
      expect(amplitudeInitSpy).toHaveBeenCalled()
    })
  })
})
