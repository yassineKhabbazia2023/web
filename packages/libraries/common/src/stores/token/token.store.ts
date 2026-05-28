import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getTokenExp, nowInSeconds } from './token.store.utils'
import { LocalStorageService } from '../../services/storage'

export const useTokenStore = defineStore('token', () => {
  const tokenExp = ref<number | undefined>(undefined)
  const cachedToken = ref<string | undefined>(undefined)
  // When disabled, the token lives only in memory (no localStorage read/write).
  // Apps handling sensitive data (e.g. the backoffice) opt out at startup.
  const isPersistenceEnabled = ref(true)

  // #region Token Management
  function setTokenPersistence(enabled: boolean) {
    isPersistenceEnabled.value = enabled
  }

  function setToken(token: string) {
    if (isPersistenceEnabled.value) {
      LocalStorageService.setToken(token)
    }
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

    // In-memory only mode: never fall back to (potentially stale) storage
    if (isPersistenceEnabled.value === false) {
      return ''
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
    setTokenPersistence,
    getToken,
    removeToken,
    hasActiveToken,
    timeUntilExpirationInMinutes,
    reset,
  }
})
