import { useUserStore } from '@pulse/common/stores'
import { WalletTab } from '../enums'

export class WalletCountManager {
  private static readonly countProviders: Partial<Record<WalletTab, () => number | undefined>> = {
    [WalletTab.FOLDERS]: () => useUserStore().getRegularEntitiesCount(),
    [WalletTab.CUSTOMER_ENTITIES]: () => useUserStore().getRegularEntitiesCount(),
    [WalletTab.PROSPECTS]: () => useUserStore().getProspectEntitiesCount(),
  }

  static getCount(tab: WalletTab): number | undefined {
    return this.countProviders[tab]?.()
  }
}
