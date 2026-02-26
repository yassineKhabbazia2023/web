import { WalletManager } from '@pulse/entities/wallet-managers'
import { WalletTab } from '@pulse/entities/enums'
import { RouteName } from '@pulse/common/enums'

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
    showInMobile: false,
    order: 10,
  })
}
