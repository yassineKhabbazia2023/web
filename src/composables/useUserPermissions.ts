import { storeToRefs } from 'pinia'
import store from '../stores'

export const useUserPermissions = () => {
  const commonStore = store()
  const { userPermissions } = storeToRefs(commonStore)

  const hasPermission = (permissionCode: string | string[]): boolean => {
    if (Array.isArray(permissionCode)) {
      return permissionCode.some((permission) =>
        userPermissions.value.includes(permission),
      )
    }

    return userPermissions.value.includes(permissionCode)
  }

  return { hasPermission }
}
