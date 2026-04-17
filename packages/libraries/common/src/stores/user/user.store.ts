import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Entity } from '../../types/entities.type'
import type { UserInfo, UserWalletInformation } from '../../types/user.type'

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

  function getUserEmail() {
    return getUser()?.email
  }

  function setGigyaUserId(gigyaUserIdArg?: string) {
    gigyaUserId.value = gigyaUserIdArg
  }

  /* #region wallet */
  const walletInformation = ref<UserWalletInformation>(
    {
      prospectEntitiesCount: 0,
      regularEntitiesCount: 0,
    },
  )

  function setWalletInformation(newUserWalletInformation: UserWalletInformation) {
    walletInformation.value = newUserWalletInformation
  }

  function getProspectEntitiesCount() {
    return walletInformation.value.prospectEntitiesCount
  }

  function getRegularEntitiesCount() {
    return walletInformation.value.regularEntitiesCount
  }
  /* #endregion */

  /* #region curent entity */

  const hasSingleEntity = computed(() => {
    return (getProspectEntitiesCount() + getRegularEntitiesCount()) === 1
  })

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
    favoriteEntities.value = []
    setWalletInformation({
      prospectEntitiesCount: 0,
      regularEntitiesCount: 0,
    })
  }

  return {
    user,
    isCollab,
    isCustomer,
    gigyaUserId,
    setUser,
    getUser,
    getUserId,
    getUserEmail,
    setGigyaUserId,
    reset,
    hasSingleEntity,
    favoriteEntities,
    setFavoriteEntities,
    getHasAcceptedCGU,
    setHasAcceptedCGU,
    walletInformation,
    setWalletInformation,
    getProspectEntitiesCount,
    getRegularEntitiesCount,
  }
})
