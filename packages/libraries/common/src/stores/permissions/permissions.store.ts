import { ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchUserPermissions, fetchUserAccountPermissions } from '@pulse/common/services/permissions'
import type { Permission } from '../../types/permission.type'

export const usePermissionsStore = defineStore('permissions', () => {
  const userPermissions = ref<Permission[]>([])
  const selectedEntityPermissions = ref<Permission[]>([])

  function setUserPermissions(userPermissionsArg: Permission[]) {
    userPermissions.value = userPermissionsArg
  }

  function setSelectedEntityPermissions(selectedEntityPermissionsArg: Permission[]) {
    selectedEntityPermissions.value = selectedEntityPermissionsArg
  }

  function reset() {
    userPermissions.value = []
    selectedEntityPermissions.value = []
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
    updateUserPermission,
    updateSelectedEntityPermissions,
  }
})
