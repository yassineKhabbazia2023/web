import { useRouter } from 'vue-router'
import { commonStore as useStore } from '@pulse/Common'

export const useRedirection = () => {
  const router = useRouter()
  const store = useStore()

  const redirectToHome = () => {
    router.push('/')
  }

  const logoutAndRedirectToLogin = async () => {
    await store.logout(store.$state)
    redirectToHome()
  }

  return { redirectToHome, logoutAndRedirectToLogin }
}
