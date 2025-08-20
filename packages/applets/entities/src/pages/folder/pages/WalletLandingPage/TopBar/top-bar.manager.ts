import { CurrentUserManager } from '@pulse/common/managers'
import { useUserStore } from '@pulse/common/stores'

export class TopBarManager {
  static isPennylaneSSODisplayed() {
    const hasPennylanePermission = CurrentUserManager.hasSelectedEntityPennylanePermission()

    return hasPennylanePermission
  }

  static shouldDisplayCustomerSSO() {
    const userStore = useUserStore()
    return userStore.isCustomer
  }
}
