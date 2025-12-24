import { useUserStore, useTokenStore } from '@pulse/common/stores'
import {
  getStoreMock,
  getMockedUser,
  AmplitudeServiceMock,
} from '@pulse/common/mocks'
import { CurrentUserManager } from '@pulse/common/managers'
import { CurrentUserService } from '@pulse/common/services/current-user'
import { MsalService } from '@pulse/common/services/msal'

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

  describe('initAuthClient', () => {
    it('should init auth when user is client', async () => {
      // Setup
      vi.spyOn(CurrentUserService, 'getCurrentUser').mockResolvedValue(userMock)
      tokenStoreMock.getToken.mockReturnValue(tokenMock)
      userStoreMock.getUserId.mockReturnValue(userMock.id)

      // Act
      await LoginManager.initAuthClient()

      // Assert
      expect(tokenStoreMock.getToken).toHaveBeenCalledOnce()
      expect(userStoreMock.setUser).toHaveBeenCalledExactlyOnceWith(userMock)
    })

    it('should not update state if the token is not present', async () => {
      // Setup
      tokenStoreMock.getToken.mockReturnValue('')

      // Act
      await LoginManager.initAuthClient()

      // Assert
      expect(userStoreMock.setUser).not.toHaveBeenCalled()
    })

    it('should track amplitude events when user has valid ID', async () => {
      // Setup
      vi.spyOn(CurrentUserService, 'getCurrentUser').mockResolvedValue(userMock)
      tokenStoreMock.getToken.mockReturnValue(tokenMock)
      userStoreMock.getUserId.mockReturnValue(userMock.id)
      userStoreMock.getUserEmail.mockReturnValue(userMock.email)

      // Act
      await LoginManager.initAuthClient()

      // Assert
      expect(AmplitudeServiceMock.identifyCustomer).toHaveBeenCalledOnce()
      expect(AmplitudeServiceMock.setUserId).toHaveBeenCalledWith(userMock.id.toString())
      expect(AmplitudeServiceMock.setUserEmail).toHaveBeenCalledWith(userMock.email)
      expect(AmplitudeServiceMock.track).toHaveBeenCalledWith('Sign In Completed', {
        sign_in_method: 'email',
        sign_in_result: 'succeeded',
      })
    })
  })

  describe('setStoreGigyaUserId', () => {
    it('should not set gigyaUserId given that the token is not available', () => {
      // Setup
      tokenStoreMock.getToken.mockReturnValue('')
      const mockGigyaUserId = 'gigya-user-id'

      // Act
      LoginManager.setStoreGigyaUserId(mockGigyaUserId)

      // Assert
      expect(userStoreMock.setGigyaUserId).not.toHaveBeenCalled()
    })

    it('should set gigyaUserId given that the token is available', () => {
      // Setup
      tokenStoreMock.getToken.mockReturnValue(tokenMock)
      const mockGigyaUserId = 'gigya-user-id'

      // Act
      LoginManager.setStoreGigyaUserId(mockGigyaUserId)

      // Assert
      expect(userStoreMock.setGigyaUserId).toHaveBeenCalledExactlyOnceWith(mockGigyaUserId)
    })
  })
})
