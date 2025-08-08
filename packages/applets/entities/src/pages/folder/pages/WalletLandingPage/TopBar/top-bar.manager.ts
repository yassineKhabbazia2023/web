import { CurrentUserManager } from '@pulse/common/managers'
import { useUserStore } from '@pulse/common/stores'

export class TopBarManager {
  static isPennylaneSSODisplayed() {
    const hasPennylanePermission = CurrentUserManager.getHasPennylanePermission()

    return hasPennylanePermission
  }

  static shouldDisplayCustomerSSO() {
    const userStore = useUserStore()
    return userStore.isCustomer
  }
}
