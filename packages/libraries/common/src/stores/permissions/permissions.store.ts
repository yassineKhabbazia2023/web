import { ref } from 'vue'
import { defineStore } from 'pinia'
import { UserEntityPermissions } from '@pulse/common/enums'
import { fetchUserPermissions, fetchUserAccountPermissions } from '@pulse/common/services/permissions'

export const usePermissionsStore = defineStore('permissions', () => {
  const userPermissions = ref<string[]>([])
  const selectedEntityPermissions = ref<string[]>([])

  function setUserPermissions(userPermissionsArg: string[]) {
    userPermissions.value = userPermissionsArg
  }

  function setSelectedEntityPermissions(selectedEntityPermissionsArg: string[]) {
    selectedEntityPermissions.value = selectedEntityPermissionsArg
  }

  function reset() {
    userPermissions.value = []
    selectedEntityPermissions.value = []
  }

  function getHasPennylanePermission() {
    return selectedEntityPermissions.value.some((entityPermission) =>
      UserEntityPermissions.PENNYLANE.includes(entityPermission),
    )
  }

  async function updateUserPermission() {
    userPermissions.value = await fetchUserPermissions()
  }

  async function updateSelectedEntityPermissions(accountId: number) {
    selectedEntityPermissions.value = await fetchUserAccountPermissions(accountId)
  }

  return {
    userPermissions,
    selectedEntityPermissions,
    setUserPermissions,
    setSelectedEntityPermissions,
    reset,
    getHasPennylanePermission,
    updateUserPermission,
    updateSelectedEntityPermissions,
  }
})
