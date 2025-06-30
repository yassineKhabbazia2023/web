import { amplitudeService } from '@pulse/common'
import { CurrentUserManager, TokenManager } from '@pulse/common/managers'
import { useUserStore } from '@pulse/common/stores'
import { CurrentUserService } from '@pulse/common/services/current-user'
import { getMSALToken } from '@pulse/common/services/msal'

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

      if (userId !== undefined && userId > 0) {
        amplitudeService.identifyCustomer()
        amplitudeService.setUserId(userId.toString())
        // we only track the sign in success when the userId exists
        // this is to avoid tracking the sign in success with unknown user
        amplitudeService.track('Sign In Completed', {
          sign_in_method: 'email',
          sign_in_result: 'succeeded',
        })
      }
    }
  }

  static async initAuthCollab(): Promise<boolean> {
    let success = false
    const msalToken = await getMSALToken()
    CurrentUserManager.persistToken(msalToken)

    if (msalToken !== null && msalToken !== undefined && msalToken !== '') {
      await this.fetchAndStoreCurrentUser()
      const userStore = useUserStore()
      const userId = userStore.getUserId()

      if (userId !== undefined && userId > 0) {
        amplitudeService.identifyCollaborator()
        amplitudeService.setUserId(userId.toString())
        // we only track the sign in success when the userId exists
        // this is to avoid tracking the sign in success with unknown user
        amplitudeService.track('Sign In Completed', {
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
