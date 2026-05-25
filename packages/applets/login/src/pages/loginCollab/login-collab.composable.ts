import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { logger } from '@pulse/toolbox'
import { isNullOrEmpty } from '@pulse/toolbox/utils/validator'
import { MsalService } from '@pulse/common/services/msal'
import { CurrentUserManager } from '@pulse/common/managers'
import { AmplitudeService } from '@pulse/common/services/amplitude'
import { CurrentUserService } from '@pulse/common/services/current-user'
import { useUserStore } from '@pulse/common/stores'
import { RouteName } from '@pulse/common/enums'

export function useLoginCollab() {
  const router = useRouter()
  const isLoading = ref(false)

  function handleLoginCollab() {
    isLoading.value = true
    MsalService.loginRedirect()
  }

  async function handleMSALRedirectionAfterLogin() {
    isLoading.value = true
    try {
      const msalToken = await MsalService.getMSALToken()
      CurrentUserManager.persistToken(msalToken ?? '')

      if (isNullOrEmpty(msalToken)) {
        return
      }

      const currentUser = await CurrentUserService.getCurrentUser()
      const userStore = useUserStore()
      userStore.setUser(currentUser)
      const userId = userStore.getUserId()
      if (userId === undefined || userId <= 0) {
        throw new Error('useLoginCollab: invalid user id from getCurrentUser')
      }
      AmplitudeService.identifyCollaborator()
      AmplitudeService.setUserId(userId.toString())
      AmplitudeService.setUserEmail(userStore.getUserEmail())
      AmplitudeService.track('Sign In Completed', {
        sign_in_method: 'SSO',
        sign_in_result: 'succeeded',
      })
      return router.push({ name: RouteName.LANDING })
    } catch (e) {
      // Roll back token and user store so we never leave the user in a
      // partially-authenticated state. Idempotent: no-op if nothing was
      // persisted in the first place.
      CurrentUserManager.clearUser()
      logger.error(e)
    } finally {
      isLoading.value = false
    }
  }

  onMounted(() => {
    // MSAL redirects to this page after SSO login
    // We need to handle the redirection and check if the user is successfully authenticated
    handleMSALRedirectionAfterLogin()
  })

  return {
    isLoading,
    handleLoginCollab,
  }
}
