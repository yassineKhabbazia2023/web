import { WalletManager } from '@pulse/entities/wallet-managers'
import { WalletTab } from '@pulse/entities/enums'
import { RouteName } from '@pulse/common/enums'
import { GLOBAL_PERMISSIONS } from '@pulse/common/constants'

/**
 * Register all wallet tabs for this app
 */
export function registerCustomerWalletTabs() {
  // Register wallet tabs - CUSTOMER tabs
  WalletManager.register({
    id: WalletTab.CUSTOMER_ENTITIES,
    title: 'entities.wallet.allEntities',
    route: RouteName.CUSTOMER_ENTITIES,
    isDisplayed: () => true,
    order: 10,
  })

  WalletManager.register({
    id: WalletTab.ALL_USERS,
    title: 'entities.wallet.allUsers',
    route: RouteName.ALL_USERS,
    isDisplayed: (context) => context.hasPermission(GLOBAL_PERMISSIONS.USERS),
    order: 11,
  })
}
