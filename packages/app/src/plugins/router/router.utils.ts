import { dataProvider } from '@pulse/common'

export async function loadUserData(store: any) {
  const { fetchUserData } = dataProvider()
  const user = await fetchUserData()
  store.$patch({
    user,
  })

  return user?.isCollab ?? false
}

export async function loadUserContext(store: any) {
  await loadUserData(store)
}
