import { useUserStore } from '@pulse/common/stores'

/**
 * The page will be only reloaded if the current user's permissions are changed
 * to ensure that the interface is aligned with the new permission.
 * @param userId - The user's id we want to compare with the current user.
  */
export function refreshPageWhenCurrentUserPermissionChange(userId: number): void {
  const userStore = useUserStore()
  if (userStore.getUserId() === userId) {
    setTimeout(() => {
      globalThis.location.reload()
    }, 30)
  }
}
