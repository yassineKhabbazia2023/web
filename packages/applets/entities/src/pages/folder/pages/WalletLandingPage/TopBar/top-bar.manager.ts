import { usePermissionsStore, useUserStore } from '@pulse/common/stores'
export class TopBarManager {
  static isPennylaneSSODisplayed() {
    const permissionsStore = usePermissionsStore()
    return permissionsStore.getHasPennylanePermission()
  }

  static shouldDisplayCustomerSSO() {
    const userStore = useUserStore()
    return userStore.isCustomer
  }
}
