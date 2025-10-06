import type { Feature } from '@pulse/common/enums'
import type { Permission } from '@pulse/common/types'
import { WalletTab } from './Wallet.enums'

export type WalletTabConfiguration = {
  name: WalletTab,
  permissionCodes?: Permission[],
  featureFlag?: Feature,
}

export type WalletAvailableTab = {
  name: WalletTab,
  title: string,
}
