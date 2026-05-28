import { ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchUserPermissions, fetchUserAccountPermissions } from '@pulse/common/services/permissions'
import type { Permission } from '../../types/permission.type'

export const usePermissionsStore = defineStore('permissions', () => {
  const userPermissions = ref<Permission[]>([])
  const currentEntityPermissions = ref<Permission[]>([])

  function setUserPermissions(userPermissionsArg: Permission[]) {
    userPermissions.value = userPermissionsArg
  }

  function setCurrentEntityPermissions(currentEntityPermissionsArg: Permission[]) {
    currentEntityPermissions.value = currentEntityPermissionsArg
  }

  function reset() {
    userPermissions.value = []
    currentEntityPermissions.value = []
  }

  async function updateUserPermission() {
    userPermissions.value = await fetchUserPermissions()
  }

  async function updateCurrentEntityPermissions(accountId: number) {
    currentEntityPermissions.value = await fetchUserAccountPermissions(accountId)
  }

  return {
    userPermissions,
    currentEntityPermissions,
    setUserPermissions,
    setCurrentEntityPermissions,
    reset,
    updateUserPermission,
    updateCurrentEntityPermissions,
  }
})
