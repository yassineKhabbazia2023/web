import { useRouter } from 'vue-router'
import { CurrentUserManager } from '@pulse/common/managers'
import { useUserStore } from '@pulse/common/stores'
import { RouteName } from '@pulse/common/enums'

export const useRedirection = () => {
  const router = useRouter()

  const redirectToLoginClient = (query?: Record<string, any>) => {
    router.replace({ name: RouteName.LOGIN_CLIENT, query })
  }

  const redirectToLoginCollab = (query?: Record<string, any>) => {
    router.replace({ name: RouteName.LOGIN_COLLAB, query })
  }

  const logoutAndRedirectToLogin = async (query?: Record<string, any>) => {
    const userStore = useUserStore()
    const isCollab = userStore.isCollab

    await CurrentUserManager.logout()

    if (isCollab === true) {
      redirectToLoginCollab(query)
    } else {
      redirectToLoginClient(query)
    }
  }

  return {
    redirectToLoginClient,
    redirectToLoginCollab,
    logoutAndRedirectToLogin,
  }
}
