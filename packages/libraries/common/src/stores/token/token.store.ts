import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getTokenExpSub } from './token.store.utils'

export const useTokenStore = defineStore('token', () => {
  const isAuthenticated = ref(false)
  const token = ref('')
  const tokenExp = ref<number | undefined>(undefined)
  const tokenSub = ref<string | undefined>(undefined)

  function setToken(tokenArg: string) {
    const { exp, sub } = getTokenExpSub(tokenArg)

    token.value = tokenArg
    tokenExp.value = exp
    tokenSub.value = sub
    isAuthenticated.value = tokenArg !== ''
  }
  function setIsAuthenticated(isAuthenticatedArg: boolean) {
    isAuthenticated.value = isAuthenticatedArg
  }

  function getIsTokenExpired() {
    const nowInSeconds = Date.now() / 1000

    return (tokenExp.value ?? 0) < nowInSeconds
  }

  return {
    isAuthenticated,
    token,
    tokenExp,
    tokenSub,
    setToken,
    setIsAuthenticated,
    getIsTokenExpired,
  }
})
