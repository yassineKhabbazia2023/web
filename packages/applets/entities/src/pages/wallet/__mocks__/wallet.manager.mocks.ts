import type { WalletContext, WalletTabConfig } from '../manager/wallet.types'
import { WalletTab } from '../Wallet.enums'
import { RouteName } from '@pulse/common/enums'

/**
 * Factory to create a mock WalletContext with customizable overrides
 */
export function createMockWalletContext(overrides?: Partial<WalletContext>): WalletContext {
  const defaultContext: WalletContext = {
    isCollab: false,
    hasPermission: () => false,
    hasFeatureFlag: () => false,
  }

  return {
    ...defaultContext,
    ...overrides,
  }
}

/**
 * Factory to create a mock WalletTabConfig with customizable overrides
 */
export function createMockWalletTabConfig(overrides?: Partial<WalletTabConfig>): WalletTabConfig {
  const defaultConfig: WalletTabConfig = {
    id: WalletTab.FOLDERS,
    title: 'entities.wallet.folders',
    route: RouteName.FOLDERS,
    isDisplayed: () => true,
    order: 1,
  }

  return {
    ...defaultConfig,
    ...overrides,
  }
}

/**
 * Default mock WalletContext instance
 */
export const mockWalletContext = createMockWalletContext()

/**
 * Default mock WalletTabConfig instance
 */
export const mockWalletTabConfig = createMockWalletTabConfig()
