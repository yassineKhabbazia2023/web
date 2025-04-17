import { ref } from 'vue'
import { defineStore } from 'pinia'

export const usePermissionsStore = defineStore('permissions', () => {
  const userPermissions = ref<string[]>([])
  const selectedEntityPermissions = ref<string[]>([])

  function setUserPermissions(userPermissionsArg: string[]) {
    userPermissions.value = userPermissionsArg
  }

  function setSelectedEntityPermissions(selectedEntityPermissionsArg: string[]) {
    selectedEntityPermissions.value = selectedEntityPermissionsArg
  }

  return {
    userPermissions,
    selectedEntityPermissions,
    setUserPermissions,
    setSelectedEntityPermissions,
  }
})
