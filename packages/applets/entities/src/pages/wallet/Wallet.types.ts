import type { Feature } from '@pulse/core/enums'
import { WalletTab } from './Wallet.enums'

export type WalletTabConfiguration = {
  name: WalletTab,
  permissionCode?: string | string[],
  featureFlag?: Feature,
}

export type WalletAvailableTab = {
  name: WalletTab,
  title: string,
}
