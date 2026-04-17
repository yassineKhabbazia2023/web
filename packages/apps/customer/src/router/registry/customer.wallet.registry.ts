import { WalletManager, WalletCountManager } from '@pulse/entities/wallet-managers'
import { WalletTab } from '@pulse/entities/enums'
import { RouteName, Feature } from '@pulse/common/enums'
import { useUserStore } from '@pulse/common/stores'
/**
 * Register all wallet tabs for this app
 */
export function registerCustomerWalletTabs() {

  const userStore = useUserStore()

  // Register wallet tabs - CUSTOMER tabs
  WalletManager.register({
    id: WalletTab.CUSTOMER_ENTITIES,
    title: 'entities.wallet.allEntities',
    route: RouteName.CUSTOMER_ENTITIES,
    isDisplayed: () => userStore.getRegularEntitiesCount() > 0,
    getCount: () => WalletCountManager.getCount(WalletTab.CUSTOMER_ENTITIES),
    showInMobile: false,
    order: 10,
  })

  WalletManager.register({
    id: WalletTab.PROSPECTS,
    title: 'entities.wallet.pending-folders',
    route: RouteName.CUSTOMER_PROSPECTS,
    isDisplayed: (context) =>
      context.hasFeatureFlag(Feature.PROSPECT_EXPERIENCE) &&
      userStore.getProspectEntitiesCount() > 0,
    getCount: () => WalletCountManager.getCount(WalletTab.PROSPECTS),
    showInMobile: false,
    order: 20,
  })
}
