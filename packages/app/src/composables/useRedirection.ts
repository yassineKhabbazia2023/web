import { useRouter } from 'vue-router'
import { CurrentUserManager } from '@pulse/common/managers'

export const useRedirection = () => {
  const router = useRouter()

  const redirectToHome = () => {
    router.push('/')
  }

  const logoutAndRedirectToLogin = async () => {
    await CurrentUserManager.logout()
    redirectToHome()
  }

  return { redirectToHome, logoutAndRedirectToLogin }
}
