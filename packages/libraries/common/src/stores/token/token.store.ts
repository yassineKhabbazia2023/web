import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getTokenExpSub } from './token.store.utils'

// TODO rename in useTokenExpirationStore ?
// TODO or move the logic to a token expiration manager ?
// https://dev.azure.com/FR-TPEME/Pulse/_workitems/edit/47386
export const useTokenStore = defineStore('token', () => {
  const tokenExp = ref<number | undefined>(undefined)
  const tokenSub = ref<string | undefined>(undefined)

  function setTokenExpiration(tokenArg: string) {
    const { exp, sub } = getTokenExpSub(tokenArg)

    tokenExp.value = exp
    tokenSub.value = sub
  }

  function getIsTokenExpired() {
    const nowInSeconds = Date.now() / 1000

    return (tokenExp.value ?? 0) < nowInSeconds
  }

  function reset() {
    tokenExp.value = undefined
    tokenSub.value = undefined
  }

  return {
    tokenExp,
    tokenSub,
    setTokenExpiration,
    getIsTokenExpired,
    reset,
  }
})
