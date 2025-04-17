import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { UserInfo } from '../types'

export const useUserStore = defineStore('user', () => {
  const user = ref<UserInfo>()
  const gigyaUserId = ref<string>()

  const isCollab = computed(() => user.value?.isCollab)

  function setUser(userArg?: UserInfo) {
    const { gigyaUserId } = userArg ?? {}

    user.value = userArg
    setGigyaUserId(gigyaUserId)
  }

  function setGigyaUserId(gigyaUserIdArg?: string) {
    gigyaUserId.value = gigyaUserIdArg
  }

  return {
    user,
    isCollab,
    gigyaUserId,
    setUser,
    setGigyaUserId,
  }
})
