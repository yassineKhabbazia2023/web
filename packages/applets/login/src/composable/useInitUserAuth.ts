
import { dataProvider, commonStore as store, tokenService } from '@pulse/common'
import { getToken } from '@login/services/msal'
import { ref } from 'vue'

export default function useInitUserAuth() {
  const isTokenRetrieve = ref(false)
  const { fetchUserData } = dataProvider()

  const setStoreGigyaUserId = (gigyaUserId: string) => {
    const token = tokenService.getToken()

    if (token) {
      store().$patch({
        user: {
          gigyaUserId,
        },
      })
    }
  }

  const initAuthClient = async () => {
    const token = tokenService.getToken()
    isTokenRetrieve.value = !!token
    if (token) {
      return await updateUserState(token)
    }
  }
  const initAuthCollab = async () => {
    const token = await getToken()
    isTokenRetrieve.value = !!token
    if (token) {
      await updateUserState(token)
    }
  }
  const updateUserState = async (token: string) => {
    tokenService.setToken(token)
    const data = await fetchUserData()
    store().$patch({
      user: {
        id: data?.id,
        firstName: data?.firstName,
        lastName: data?.lastName,
        email: data?.email,
        isCollab: data?.isCollab,
      },
    })
    return data
  }

  return { initAuthCollab, initAuthClient, isTokenRetrieve, setStoreGigyaUserId }
}
