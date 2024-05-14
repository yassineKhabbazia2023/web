import { storeToRefs } from 'pinia'
import store from '../stores'

export const useUserPermissions = () => {
  const commonStore = store()
  const { userPermissions, defaultEntity } = storeToRefs(commonStore)

  const hasPermission = (
    permissionCode: string | string[],
  ): boolean => {
    const defaultEntityPermissions = defaultEntity.value?.permissions ?? []
    const permissionsList = [...defaultEntityPermissions, ...userPermissions.value]

    if (Array.isArray(permissionCode)) {
      return permissionCode.some((permission) =>
        permissionsList.includes(permission),
      )
    }

    return permissionsList.includes(permissionCode)
  }

  return { hasPermission }
}
