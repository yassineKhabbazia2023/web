import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getTokenExp, nowInSeconds } from './token.store.utils'
import { LocalStorageService } from '../../services/storage'

export const useTokenStore = defineStore('token', () => {
  const tokenExp = ref<number | undefined>(undefined)
  const cachedToken = ref<string | undefined>(undefined)

  // #region Token Management
  function setToken(token: string) {
    LocalStorageService.setToken(token)
    cachedToken.value = token

    // Decode once and update store
    if (token) {
      tokenExp.value = getTokenExp(token)
    } else {
      reset()
    }
  }

  function getToken(): string {
    // Use cached token if available
    if (cachedToken.value) {
      return cachedToken.value
    }

    // Otherwise get from storage
    const token = LocalStorageService.getToken()
    if (token) {
      // Update cache and decode
      cachedToken.value = token
      tokenExp.value = getTokenExp(token)
    }
    return token
  }

  function removeToken() {
    LocalStorageService.removeToken()
    reset()
  }
  // #endregion

  // #region Token Expiration Methods
  function hasActiveToken(): boolean {
    if (!tokenExp.value) {
      return false
    }

    return nowInSeconds() < tokenExp.value
  }

  function timeUntilExpirationInMinutes(): number {
    if (!tokenExp.value) {
      return 0
    }

    return Math.max(0, (tokenExp.value - nowInSeconds()) / 60)
  }
  // #endregion

  // #region Reset
  function reset() {
    tokenExp.value = undefined
    cachedToken.value = undefined
  }
  // #endregion

  return {
    setToken,
    getToken,
    removeToken,
    hasActiveToken,
    timeUntilExpirationInMinutes,
    reset,
  }
})
