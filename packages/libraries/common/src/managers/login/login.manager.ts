import { AmplitudeService } from '@pulse/common/services/amplitude'
import { CurrentUserManager } from '@pulse/common/managers'
import { useUserStore, useTokenStore } from '@pulse/common/stores'
import { CurrentUserService } from '@pulse/common/services/current-user'
import { MsalService } from '@pulse/common/services/msal'
import { login } from '@pulse/common/services/authentication'
import { GigyaManager } from '../gigya/gigya.manager'

export class LoginManager {
  private static async initAuthClient() {
    const tokenStore = useTokenStore()
    const token = tokenStore.getToken()

    if (token !== null && token !== undefined && token !== '') {
      await this.fetchAndStoreCurrentUser()
      const userStore = useUserStore()
      const userId = userStore.getUserId()
      const userEmail = userStore.getUserEmail()

      if (userId !== undefined && userId > 0) {
        AmplitudeService.identifyCustomer()
        AmplitudeService.setUserId(userId.toString())
        AmplitudeService.setUserEmail(userEmail)
        // we only track the sign in success when the userId exists
        // this is to avoid tracking the sign in success with unknown user
        AmplitudeService.track('Sign In Completed', {
          sign_in_method: 'email',
          sign_in_result: 'succeeded',
        })
      }
    }
  }

  static async initAuthCollab(): Promise<boolean> {
    let success = false
    const msalToken = await MsalService.getMSALToken()
    CurrentUserManager.persistToken(msalToken ?? '')

    if (msalToken !== null && msalToken !== undefined && msalToken !== '') {
      await this.fetchAndStoreCurrentUser()
      const userStore = useUserStore()
      const userId = userStore.getUserId()
      const userEmail = userStore.getUserEmail()

      if (userId !== undefined && userId > 0) {
        AmplitudeService.identifyCollaborator()
        AmplitudeService.setUserId(userId.toString())
        AmplitudeService.setUserEmail(userEmail)
        // we only track the sign in success when the userId exists
        // this is to avoid tracking the sign in success with unknown user
        AmplitudeService.track('Sign In Completed', {
          sign_in_method: 'SSO',
          sign_in_result: 'succeeded',
        })

        success = true
      }
    }

    return success
  }

  static async authenticateCustomer(email: string, password: string) {
    const { webToken, userId } = await login({ email, password })

    if (webToken === undefined || webToken === null || webToken.trim() === '') {
      throw new Error('No token received')
    }

    CurrentUserManager.persistToken(webToken)
    await this.initAuthClient()
    GigyaManager.setStoreGigyaUserId(userId)
    GigyaManager.loginSSO(email, password)
  }

  private static async fetchAndStoreCurrentUser(): Promise<void> {
    const currentUser = await CurrentUserService.getCurrentUser()
    const userStore = useUserStore()
    userStore.setUser(currentUser)
  }
}
