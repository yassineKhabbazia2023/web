import { useUserStore, useTokenStore } from '@pulse/common/stores'
import { getMockedUser } from '@pulse/common/mocks'
import { getStoreMock, AmplitudeServiceMock } from '@pulse/common/mocks/vitest'
import { CurrentUserManager } from '@pulse/common/managers'
import { CurrentUserService } from '@pulse/common/services/current-user'
import { MsalService } from '@pulse/common/services/msal'
import { login } from '@pulse/common'
import { GigyaManager } from '../gigya/gigya.manager'

import { LoginManager } from './login.manager'

const userStoreMock = getStoreMock(useUserStore)
const tokenStoreMock = getStoreMock(useTokenStore)

const msalTokenMock = 'msal-token'
const msalGetTokenMock = vi.mocked(MsalService.getMSALToken)

vi.mock('@pulse/common/services/msal', () => ({
  MsalService: {
    getMSALToken: vi.fn(),
  },
}))

vi.mock('@pulse/common/managers', () => ({
  CurrentUserManager: {
    persistToken: vi.fn(),
  },
}))

vi.mock('@pulse/common/services/amplitude', () => ({
  AmplitudeService: AmplitudeServiceMock,
}))

vi.mock('../gigya/gigya.manager')
vi.mock('@pulse/common')

const userMock = getMockedUser()
const tokenMock = 'mock-token'

describe('LoginManager', () => {
  describe('initAuthCollab', () => {
    it('should init auth when the user is collab', async () => {
      // Setup
      msalGetTokenMock.mockResolvedValue(msalTokenMock)
      vi.spyOn(CurrentUserService, 'getCurrentUser').mockResolvedValue(userMock)
      userStoreMock.getUserId.mockReturnValue(userMock.id)

      // Act
      const result = await LoginManager.initAuthCollab()

      // Assert
      expect(msalGetTokenMock).toHaveBeenCalledWith()
      expect(CurrentUserManager.persistToken).toHaveBeenCalledWith(msalTokenMock)
      expect(result).toBe(true)
      expect(userStoreMock.setUser).toHaveBeenCalledExactlyOnceWith(userMock)
    })

    it('should NOT init auth when msal getToken returns empty token', async () => {
      // Setup
      msalGetTokenMock.mockResolvedValue('')

      // Act
      const result = await LoginManager.initAuthCollab()

      // Assert
      expect(msalGetTokenMock).toHaveBeenCalledWith()
      expect(CurrentUserManager.persistToken).toHaveBeenCalledWith('')
      expect(result).toBe(false)
      expect(userStoreMock.setUser).not.toHaveBeenCalled()
    })

    it('should track amplitude events when user has valid ID', async () => {
      // Setup
      msalGetTokenMock.mockResolvedValue(msalTokenMock)
      vi.spyOn(CurrentUserService, 'getCurrentUser').mockResolvedValue(userMock)
      userStoreMock.getUserId.mockReturnValue(userMock.id)
      userStoreMock.getUserEmail.mockReturnValue(userMock.email)

      // Act
      await LoginManager.initAuthCollab()

      // Assert
      expect(AmplitudeServiceMock.identifyCollaborator).toHaveBeenCalledOnce()
      expect(AmplitudeServiceMock.setUserId).toHaveBeenCalledWith(userMock.id.toString())
      expect(AmplitudeServiceMock.setUserEmail).toHaveBeenCalledWith(userMock.email)
      expect(AmplitudeServiceMock.track).toHaveBeenCalledWith('Sign In Completed', {
        sign_in_method: 'SSO',
        sign_in_result: 'succeeded',
      })
    })
  })

  describe('authenticateCustomer', () => {
    it('should login, persist token, fetch user, set gigya userId and login SSO', async () => {
      // Setup
      vi.mocked(login).mockResolvedValue({ webToken: tokenMock, userId: 'gigya-user-id' })
      vi.spyOn(CurrentUserService, 'getCurrentUser').mockResolvedValue(userMock)
      tokenStoreMock.getToken.mockReturnValue(tokenMock)
      userStoreMock.getUserId.mockReturnValue(userMock.id)

      // Act
      await LoginManager.authenticateCustomer('test@email.com', 'password123')

      // Assert
      expect(vi.mocked(login)).toHaveBeenCalledWith({ email: 'test@email.com', password: 'password123' })
      expect(CurrentUserManager.persistToken).toHaveBeenCalledWith(tokenMock)
      expect(userStoreMock.setUser).toHaveBeenCalledExactlyOnceWith(userMock)
      expect(vi.mocked(GigyaManager.setStoreGigyaUserId)).toHaveBeenCalledWith('gigya-user-id')
      expect(vi.mocked(GigyaManager.loginSSO)).toHaveBeenCalledWith('test@email.com', 'password123')
    })

    it('should track amplitude events when user has valid ID', async () => {
      // Setup
      vi.mocked(login).mockResolvedValue({ webToken: tokenMock, userId: 'gigya-user-id' })
      vi.spyOn(CurrentUserService, 'getCurrentUser').mockResolvedValue(userMock)
      tokenStoreMock.getToken.mockReturnValue(tokenMock)
      userStoreMock.getUserId.mockReturnValue(userMock.id)
      userStoreMock.getUserEmail.mockReturnValue(userMock.email)

      // Act
      await LoginManager.authenticateCustomer('test@email.com', 'password123')

      // Assert
      expect(AmplitudeServiceMock.identifyCustomer).toHaveBeenCalledOnce()
      expect(AmplitudeServiceMock.setUserId).toHaveBeenCalledWith(userMock.id.toString())
      expect(AmplitudeServiceMock.setUserEmail).toHaveBeenCalledWith(userMock.email)
      expect(AmplitudeServiceMock.track).toHaveBeenCalledWith('Sign In Completed', {
        sign_in_method: 'email',
        sign_in_result: 'succeeded',
      })
    })

    it('should throw when no token is received', async () => {
      // Setup
      vi.mocked(login).mockResolvedValue({ webToken: '', userId: 'gigya-user-id' })

      // Act & Assert
      await expect(LoginManager.authenticateCustomer('test@email.com', 'password123'))
        .rejects.toThrow('No token received')
    })
  })

})
