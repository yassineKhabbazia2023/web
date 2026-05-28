import { useRouter } from 'vue-router'
import { AmplitudeService } from '@pulse/common/services/amplitude'
import { useLoadingStore, useUserStore } from '@pulse/common/stores'
import { CurrentUserManager } from '@pulse/common/managers'
import { RouteName } from '@pulse/common/enums'

export function useLogout() {
  const userStore = useUserStore()
  const loadingStore = useLoadingStore()
  const router = useRouter()

  const handleLogout = async () => {
    loadingStore.startGlobalLoading({ immediate: true })

    const isCollab = userStore.isCollab
    try {
      await CurrentUserManager.logout()
      AmplitudeService.track('Sign Out Completed', {
        sign_out_result: 'succeeded',
      })
    } catch {
      AmplitudeService.track('Sign Out Completed', {
        sign_out_result: 'failed',
      })
    }
    const routeName = isCollab ? RouteName.LOGIN_COLLAB : RouteName.LOGIN_CLIENT
    // Give some time for the logout process to complete before navigating
    // especially for amplitude events to be sent before the user context is lost
    setTimeout(async () => {
      try {
        await router.push({ name: routeName })
      } catch {
        // On successful navigation, loading is stopped by anonymous flow guards.
        // Stop it here only when navigation fails to avoid blocking the UI.
        loadingStore.stopGlobalLoading()
      }
    }, 250)
  }

  return {
    handleLogout,
  }
}
