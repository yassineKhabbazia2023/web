import { featureFlagManagerMock } from '@pulse/core/mocks'
import { WalletTab } from './Wallet.enums'
import type { WalletTabConfiguration, WalletAvailableTab } from './Wallet.types'
import { GLOBAL_PERMISSIONS } from '@pulse/common/constants'
import { CurrentUserManagerMock, hasPermissionMock, getHasPermissionMocked } from '@pulse/common/mocks'
import { COLLAB_TABS_CONFIGURATION, CUSTOMER_TABS_CONFIGURATION } from './Wallet.const'
import { Feature } from '@pulse/core/enums'

import { getAvailableTabs, getTabs } from './Wallet.utils'

vi.mock('@pulse/common/managers', () => ({
  CurrentUserManager: CurrentUserManagerMock,
}))

vi.mock('@pulse/core', () => ({
  FeatureFlagManager: featureFlagManagerMock,
}))

const tabLabels: Record<WalletTab, string> = {
  [WalletTab.ACCOUNT_MANAGEMENT]: 'Administration dossiers',
  [WalletTab.ALL_USERS]: 'Tous les utilisateurs',
  [WalletTab.BI_REPORTS_LIST]: 'Rapports BI',
  [WalletTab.COLLABORATORS]: 'Collaborateurs',
  [WalletTab.ENTITY_CLIENT]: 'Mes entités',
  [WalletTab.FOLDER_LAUNCHER]: 'Applications',
  [WalletTab.FOLDER_MANDATES]: 'Mandat',
  [WalletTab.FOLDERS]: 'Portefeuille',
  [WalletTab.OFFERS_CATALOG]: 'Catalogue des offres',
  [WalletTab.POWER_BI]: 'Déposer un rapport BI',
  [WalletTab.SUBSCRIPTIONS]: 'Demandes MOD',
}

describe('Wallet.utils', () => {
  describe('getAvailableTabs', () => {
    it('should return availables tabs', () => {
      const tabs: WalletTabConfiguration[] = [{
        name: WalletTab.FOLDER_MANDATES,
        permissionCodes: GLOBAL_PERMISSIONS.MANDATE, // true
      }, {
        name: WalletTab.POWER_BI,
        permissionCodes: GLOBAL_PERMISSIONS.POWERBI_REPORT, // false
      }, {
        name: WalletTab.ENTITY_CLIENT,
        featureFlag: Feature.ACCESS_MANAGEMENT_GLOBAL, // true
      }, {
        name: WalletTab.SUBSCRIPTIONS,
        featureFlag: Feature.FEED_CENTER, // false
      }, {
        name: WalletTab.FOLDERS,
      }]
      const expectedAvailablesTabs: WalletAvailableTab[] = [{
        name: WalletTab.FOLDER_MANDATES,
        title: tabLabels[WalletTab.FOLDER_MANDATES],
      }, {
        name: WalletTab.ENTITY_CLIENT,
        title: tabLabels[WalletTab.ENTITY_CLIENT],
      }, {
        name: WalletTab.FOLDERS,
        title: tabLabels[WalletTab.FOLDERS],
      }]
      hasPermissionMock.mockImplementation(getHasPermissionMocked(GLOBAL_PERMISSIONS.MANDATE))
      featureFlagManagerMock.isFeatureActivated
        .mockImplementation((featureFlag: Feature) => featureFlag === Feature.ACCESS_MANAGEMENT_GLOBAL)

      const availablesTabs = getAvailableTabs(tabs, tabLabels)

      expect(availablesTabs).toStrictEqual(expectedAvailablesTabs)
    })
  })

  describe('getTabs', () => {
    const tests = [{
      isCollab: false,
      hasCollabOffersCagalogFeatureFlag: true,
      expectedLength: CUSTOMER_TABS_CONFIGURATION.length,
    }, {
      isCollab: true,
      hasCollabOffersCagalogFeatureFlag: true,
      expectedLength: COLLAB_TABS_CONFIGURATION.length,
    }, {
      isCollab: true,
      hasCollabOffersCagalogFeatureFlag: false,
      expectedLength: COLLAB_TABS_CONFIGURATION.length - 1,
    }]

    it.each(tests)('should return $expectedLength when isCollab equals $isCollab and hasCollabOffersCagalogFeatureFlag equals $hasCollabOffersCagalogFeatureFlag', ({
      isCollab,
      hasCollabOffersCagalogFeatureFlag,
      expectedLength,
    }) => {
      featureFlagManagerMock.isFeatureActivated
        .mockImplementation((featureFlag: Feature) => (
          hasCollabOffersCagalogFeatureFlag &&
          featureFlag === Feature.COLLAB_OFFERS_CATALOG
        ))
      const availablesTabs = getTabs(tabLabels, isCollab)

      expect(availablesTabs).toHaveLength(expectedLength)
    })
  })
})
