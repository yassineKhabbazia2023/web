import { AmplitudeService } from '@pulse/common/services/amplitude'
import { CurrentUserManager, TokenManager } from '@pulse/common/managers'
import { useUserStore } from '@pulse/common/stores'
import { CurrentUserService } from '@pulse/common/services/current-user'
import { MsalService } from '@pulse/common/services/msal'

export class LoginManager {
  static setStoreGigyaUserId(gigyaUserId: string) {
    const token = TokenManager.getToken()

    if (token) {
      const userStore = useUserStore()
      userStore.setGigyaUserId(gigyaUserId)
    }
  }

  static async initAuthClient() {
    const token = TokenManager.getToken()

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

  private static async fetchAndStoreCurrentUser(): Promise<void> {
    const currentUser = await CurrentUserService.getCurrentUser()
    const userStore = useUserStore()
    userStore.setUser(currentUser)
  }
}
