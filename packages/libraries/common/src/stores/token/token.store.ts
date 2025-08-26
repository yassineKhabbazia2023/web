import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getTokenExp } from './token.store.utils'

// TODO rename in useTokenExpirationStore ?
// TODO or move the logic to a token expiration manager ?
// https://dev.azure.com/FR-TPEME/Pulse/_workitems/edit/47386
export const useTokenStore = defineStore('token', () => {
  const tokenExp = ref<number | undefined>(undefined)

  function setTokenExpiration(tokenArg: string) {
    const { exp } = getTokenExp(tokenArg)

    tokenExp.value = exp
  }

  function getIsTokenExpired() {
    const nowInSeconds = Date.now() / 1000

    return (tokenExp.value ?? 0) < nowInSeconds
  }

  function reset() {
    tokenExp.value = undefined
  }

  return {
    tokenExp,
    setTokenExpiration,
    getIsTokenExpired,
    reset,
  }
})
