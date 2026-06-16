import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { LoginService } from '@pulse/common/services/login'
import { RouteName } from '@pulse/common/enums'

export function useLoginCollab() {
  const route = useRoute()
  const router = useRouter()
  const isLoading = ref(false)

  function handleLoginCollab() {
    isLoading.value = true
    LoginService.redirectToSso()
  }

  async function handleSsoRedirectionAfterLogin() {
    isLoading.value = true
    try {
      const isAuthenticated = await LoginService.handleSsoRedirectResult()
      if (isAuthenticated) {
        await router.push({ name: RouteName.LANDING })
      }
    } finally {
      isLoading.value = false
    }
  }

  onMounted(() => {
    if (route.query.sessionExpired === 'true') {
      return
    }

    // The SSO provider redirects to this page after login.
    // We handle the redirection and check whether the user is successfully authenticated.
    handleSsoRedirectionAfterLogin()
  })

  return {
    isLoading,
    handleLoginCollab,
  }
}
