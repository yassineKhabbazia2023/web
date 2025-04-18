import { dataProvider } from '@pulse/common'
import { getTermsByCurrentUser } from '@pulse/common/services/cgu'
import { LoginRouteName } from '@pulse/common/constants'
import { useUserStore } from '@pulse/common/stores'

export async function loadUserData() {
  const { fetchUserData } = dataProvider()
  const user = await fetchUserData()

  return user
}

export async function checkCgu() {
  const { isCurrent, terms } = await getTermsByCurrentUser()

  if (!isCurrent) {
    return {
      name: LoginRouteName.CGU_VALIDATION,
      params: {
        termsId: terms.termsId,
      },
    }
  }
}

export async function checkAuthenticatedUser() {
  const userStore = useUserStore()
  const user = await loadUserData()
  userStore.setUser(user)
  const { isCollab } = user ?? {}

  const redirection = isCollab ? undefined : await checkCgu()

  return redirection
}
