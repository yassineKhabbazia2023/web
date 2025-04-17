
import { dataProvider } from '@pulse/common'
import { CurrentUserManager } from '@pulse/common/managers'
import { useUserStore, useTokenStore } from '@pulse/common/stores'
import { getToken } from '@login/services/msal'
import { ref } from 'vue'

export default function useInitUserAuth() {
  const userStore = useUserStore()
  const tokenStore = useTokenStore()
  const isTokenRetrieve = ref(false)
  const { fetchUserData } = dataProvider()

  const setStoreGigyaUserId = (gigyaUserId: string) => {
    const token = getCurrentToken()

    if (token) {
      userStore.setGigyaUserId(gigyaUserId)
    }
  }

  const initAuthClient = async () => {
    const token = getCurrentToken()
    isTokenRetrieve.value = !!token
    if (token) {
      return await updateUserState(token)
    }
  }
  const initAuthCollab = async () => {
    const token = await getToken()
    CurrentUserManager.saveTokenLocally(token)
    isTokenRetrieve.value = !!token
    if (token) {
      await updateUserState(token)
    }
  }
  const updateUserState = async (token: string) => {
    tokenStore.setToken(token)
    const data = await fetchUserData()
    userStore.setUser(data)

    return data
  }

  const getCurrentToken = () => tokenStore.token || CurrentUserManager.getTokenLocally()

  return { initAuthCollab, initAuthClient, isTokenRetrieve, setStoreGigyaUserId }
}
