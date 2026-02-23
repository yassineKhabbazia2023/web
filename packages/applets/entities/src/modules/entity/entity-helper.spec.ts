import { RouteName } from '@pulse/common/enums'
import { CurrentUserManagerMock, featureFlagManagerMock, hasPermissionMock } from '@pulse/common/mocks/vitest'
import type { TabName, Tab } from './types'

import { getTabAuthorizations, getTabs } from './entity-helper'

vi.mock('@pulse/common/managers', () => ({
  CurrentUserManager: CurrentUserManagerMock,
  FeatureFlagManager: featureFlagManagerMock,
}))

describe('test entity-helper', () => {
  describe('getTabAuthorizations', () => {
    const isFeatureActivatedMock = vi.mocked(featureFlagManagerMock.isFeatureActivated)
    const tests = [{
      isCollab: true,
      hasPermission: true,
      featureFlagEnabled: true,
      isInvoicesTabVisible: true,
      expectedAuthorizations: {
        [RouteName.COLLAB]: true,
        [RouteName.DELEGATIONS_HISTORY]: true,
        [RouteName.FOLDER_HISTORY]: true,
        [RouteName.INFO]: true,
        [RouteName.OFFERS]: true,
        [RouteName.RYDGE_INVOICES]: true,
        [RouteName.USERS]: true,
      },
    }, {
      isCollab: false,
      hasPermission: true,
      featureFlagEnabled: true,
      isInvoicesTabVisible: true,
      expectedAuthorizations: {
        [RouteName.COLLAB]: false,
        [RouteName.DELEGATIONS_HISTORY]: false,
        [RouteName.FOLDER_HISTORY]: false,
        [RouteName.INFO]: true,
        [RouteName.OFFERS]: true,
        [RouteName.RYDGE_INVOICES]: true,
        [RouteName.USERS]: true,
      },
    }, {
      isCollab: true,
      hasPermission: false,
      featureFlagEnabled: true,
      isInvoicesTabVisible: true,
      expectedAuthorizations: {
        [RouteName.COLLAB]: false,
        [RouteName.DELEGATIONS_HISTORY]: false,
        [RouteName.FOLDER_HISTORY]: true,
        [RouteName.INFO]: false,
        [RouteName.OFFERS]: false,
        [RouteName.RYDGE_INVOICES]: true,
        [RouteName.USERS]: false,
      },
    }, {
      isCollab: false,
      hasPermission: false,
      featureFlagEnabled: true,
      isInvoicesTabVisible: false,
      expectedAuthorizations: {
        [RouteName.COLLAB]: false,
        [RouteName.DELEGATIONS_HISTORY]: false,
        [RouteName.FOLDER_HISTORY]: false,
        [RouteName.INFO]: false,
        [RouteName.OFFERS]: false,
        [RouteName.RYDGE_INVOICES]: false,
        [RouteName.USERS]: false,
      },
    }]
    it.each(tests)(
      'should return proper authorizations when isCollab is $isCollab and hasPermission returns $hasPermission',
      ({
        isCollab,
        hasPermission,
        featureFlagEnabled,
        isInvoicesTabVisible,
        expectedAuthorizations,
      }) => {
        hasPermissionMock.mockReturnValue(hasPermission)
        isFeatureActivatedMock.mockReturnValue(featureFlagEnabled)
        const tabAuthorizations = getTabAuthorizations(isCollab, isInvoicesTabVisible)

        expect(tabAuthorizations).toStrictEqual(expectedAuthorizations)
      })
  })

  describe('getTabAuthorizations - invoices access', () => {
    const isFeatureActivatedMock = vi.mocked(featureFlagManagerMock.isFeatureActivated)

    beforeEach(() => {
      hasPermissionMock.mockClear()
    })

    it.each([
      {
        description: 'returns true when tab is visible and feature flag is enabled',
        isCollab: true,
        hasPermission: true,
        featureFlagEnabled: true,
        isInvoicesTabVisible: true,
        expected: true,
      },
      {
        description: 'returns false when tab is not visible even with feature flag enabled',
        isCollab: true,
        hasPermission: true,
        featureFlagEnabled: true,
        isInvoicesTabVisible: false,
        expected: false,
      },
      {
        description: 'returns false when feature flag is disabled even with tab visible',
        isCollab: true,
        hasPermission: true,
        featureFlagEnabled: false,
        isInvoicesTabVisible: true,
        expected: false,
      },
      {
        description: 'returns false when both feature flag disabled and tab not visible',
        isCollab: false,
        hasPermission: true,
        featureFlagEnabled: false,
        isInvoicesTabVisible: false,
        expected: false,
      },
    ])('$description', ({
      isCollab,
      hasPermission,
      featureFlagEnabled,
      isInvoicesTabVisible,
      expected,
    }) => {
      hasPermissionMock.mockReturnValue(hasPermission)
      isFeatureActivatedMock.mockReturnValue(featureFlagEnabled)

      const result = getTabAuthorizations(isCollab, isInvoicesTabVisible)[RouteName.RYDGE_INVOICES]

      expect(result).toBe(expected)
    })
  })

  describe('getTabs', () => {
    it('should return proper tabs', () => {
      const tabAuthorisations: Record<TabName, boolean> = {
        [RouteName.COLLAB]: true,
        [RouteName.DELEGATIONS_HISTORY]: false,
        [RouteName.FOLDER_HISTORY]: true,
        [RouteName.INFO]: true,
        [RouteName.OFFERS]: true,
        [RouteName.RYDGE_INVOICES]: true,
        [RouteName.USERS]: true,
      }
      const titles: Record<TabName, string> = {
        [RouteName.USERS]: 'Utilisateurs',
        [RouteName.COLLAB]: 'Collaborateurs',
        [RouteName.OFFERS]: 'Offres',
        [RouteName.RYDGE_INVOICES]: 'Factures RYDGE Conseil',
        [RouteName.INFO]: 'Informations',
        [RouteName.FOLDER_HISTORY]: 'Historique du dossier',
        [RouteName.DELEGATIONS_HISTORY]: 'Historique des délégations',
      }
      const tabs = getTabs(tabAuthorisations, titles)
      const expectedTabs: Tab[] = [{
        name: RouteName.USERS,
        title: 'Utilisateurs',
      }, {
        name: RouteName.COLLAB,
        title: 'Collaborateurs',
      }, {
        name: RouteName.OFFERS,
        title: 'Offres',
      }, {
        name: RouteName.RYDGE_INVOICES,
        title: 'Factures RYDGE Conseil',
      }, {
        name: RouteName.INFO,
        title: 'Informations',
      }, {
        name: RouteName.FOLDER_HISTORY,
        title: 'Historique du dossier',
      }]

      expect(tabs).toStrictEqual(expectedTabs)
    })
  })
})
