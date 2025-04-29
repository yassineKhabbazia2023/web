import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Entity, UserInfo } from '../types'

export const useUserStore = defineStore('user', () => {
  const user = ref<UserInfo>()
  const gigyaUserId = ref<string>()

  const isCollab = computed(() => user.value?.isCollab)
  const isCustomer = computed(() => isCollab.value === false)

  function setUser(userArg?: UserInfo) {
    const { gigyaUserId } = userArg ?? {}

    user.value = userArg
    setGigyaUserId(gigyaUserId)
  }

  function getUser() {
    return user.value
  }

  function getUserId() {
    return getUser()?.id
  }

  function setGigyaUserId(gigyaUserIdArg?: string) {
    gigyaUserId.value = gigyaUserIdArg
  }

  /* #region curent entity */
  const isSingleEntity = ref(false)

  function setIsSingleEntity(newIsSingleEntity: boolean) {
    isSingleEntity.value = newIsSingleEntity
  }

  function getIsSingleEntity() {
    return isSingleEntity.value
  }
  /* #endregion */

  /* #region favorite entities */
  const favoriteEntities = ref<Entity[]>([])

  function setFavoriteEntities(newFavoriteEntities: Entity[]) {
    favoriteEntities.value = newFavoriteEntities
  }
  /* #endregion */

  /* #region cgu */
  const hasAcceptedCGU = ref(false)
  function getHasAcceptedCGU() {
    return hasAcceptedCGU.value
  }

  function setHasAcceptedCGU(newHasAcceptedCGU: boolean) {
    hasAcceptedCGU.value = newHasAcceptedCGU
  }
  /* #endregion */

  function reset() {
    user.value = undefined
    gigyaUserId.value = undefined
    hasAcceptedCGU.value = false
    isSingleEntity.value = false
    favoriteEntities.value = []
  }

  return {
    user,
    isCollab,
    isCustomer,
    gigyaUserId,
    setUser,
    getUser,
    getUserId,
    setGigyaUserId,
    reset,
    setIsSingleEntity,
    getIsSingleEntity,
    favoriteEntities,
    setFavoriteEntities,
    getHasAcceptedCGU,
    setHasAcceptedCGU,
  }
})
