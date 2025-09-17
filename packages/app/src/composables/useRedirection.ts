import { useRouter } from 'vue-router'
import { CurrentUserManager } from '@pulse/common/managers'
import { useUserStore } from '@pulse/common/stores'
import { APP_ROUTES } from '@pulse/common/constants'

export const useRedirection = () => {
  const router = useRouter()

  const redirectToHome = () => {
    router.push('/')
  }

  const redirectToLoginClient = (query?: Record<string, any>) => {
    router.replace({ name: APP_ROUTES.login.client.name, query })
  }

  const redirectToLoginCollab = (query?: Record<string, any>) => {
    router.replace({ name: APP_ROUTES.login.collab.name, query })
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
    redirectToHome,
    redirectToLoginClient,
    redirectToLoginCollab,
    logoutAndRedirectToLogin,
  }
}
