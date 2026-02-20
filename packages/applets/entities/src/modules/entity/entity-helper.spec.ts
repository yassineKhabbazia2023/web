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
        collab: true,
        delegationsHistory: true,
        history: true,
        info: true,
        offers: true,
        invoices: true,
        users: true,
      },
    }, {
      isCollab: false,
      hasPermission: true,
      featureFlagEnabled: true,
      isInvoicesTabVisible: true,
      expectedAuthorizations: {
        collab: false,
        delegationsHistory: false,
        history: false,
        info: true,
        offers: true,
        invoices: true,
        users: true,
      },
    }, {
      isCollab: true,
      hasPermission: false,
      featureFlagEnabled: true,
      isInvoicesTabVisible: true,
      expectedAuthorizations: {
        collab: false,
        delegationsHistory: false,
        history: true,
        info: false,
        offers: false,
        invoices: true,
        users: false,
      },
    }, {
      isCollab: false,
      hasPermission: false,
      featureFlagEnabled: true,
      isInvoicesTabVisible: false,
      expectedAuthorizations: {
        collab: false,
        delegationsHistory: false,
        history: false,
        info: false,
        offers: false,
        invoices: false,
        users: false,
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

      const result = getTabAuthorizations(isCollab, isInvoicesTabVisible).invoices

      expect(result).toBe(expected)
    })
  })

  describe('getTabs', () => {
    it('should return proper tabs', () => {
      const tabAuthorizations: Record<TabName, boolean> = {
        collab: true,
        delegationsHistory: false,
        history: true,
        info: true,
        offers: true,
        invoices: true,
        users: true,
      }
      const titles: Record<TabName, string> = {
        users: 'Utilisateurs',
        collab: 'Collaborateurs',
        offers: 'Offres',
        invoices: 'Factures RYDGE Conseil',
        info: 'Informations',
        history: 'Historique du dossier',
        delegationsHistory: 'Historique des délégations',
      }
      const tabs = getTabs(tabAuthorizations, titles)
      const expectedTabs: Tab[] = [{
        name: 'users',
        title: 'Utilisateurs',
      }, {
        name: 'collab',
        title: 'Collaborateurs',
      }, {
        name: 'offers',
        title: 'Offres',
      }, {
        name: 'invoices',
        title: 'Factures RYDGE Conseil',
      }, {
        name: 'info',
        title: 'Informations',
      }, {
        name: 'history',
        title: 'Historique du dossier',
      }]

      expect(tabs).toStrictEqual(expectedTabs)
    })
  })
})
