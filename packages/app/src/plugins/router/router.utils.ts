import { dataProvider } from '@pulse/common'
import { getTermsByCurrentUser } from '@pulse/common/services/cgu'
import { LoginRouteName } from '@pulse/common/constants'

export async function loadUserData(store: any) {
  const { fetchUserData } = dataProvider()
  const user = await fetchUserData()
  store.$patch({
    user,
  })

  return user?.isCollab ?? false
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

export async function checkAuthenticatedUser(store: any) {
  const isCollab = await loadUserData(store)

  const redirection = isCollab ? undefined : await checkCgu()

  return redirection
}
