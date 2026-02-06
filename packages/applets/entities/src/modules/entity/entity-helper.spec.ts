import { CurrentUserManagerMock, featureFlagManagerMock, hasPermissionMock } from '@pulse/common/mocks/vitest'
import type { TabName, Tab } from './types'

import { getTabAuthorisations, getTabs } from './entity-helper'

vi.mock('@pulse/common/managers', () => ({
  CurrentUserManager: CurrentUserManagerMock,
  FeatureFlagManager: featureFlagManagerMock,
}))

describe('test entity-helper', () => {
  describe('getTabAuthorisations', () => {
    const isFeatureActivatedMock = vi.mocked(featureFlagManagerMock.isFeatureActivated)
    const tests = [{
      isCollab: true,
      hasPermission: true,
      featureFlagEnabled: true,
      isSignatory: false,
      expectedAuthorisations: {
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
      isSignatory: true,
      expectedAuthorisations: {
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
      isSignatory: false,
      expectedAuthorisations: {
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
      isSignatory: true,
      expectedAuthorisations: {
        collab: false,
        delegationsHistory: false,
        history: false,
        info: false,
        offers: false,
        invoices: true,
        users: false,
      },
    }]
    it.each(tests)(
      'should return proper authorisations when isCollab is $isCollab and hasPermission returns $hasPermission',
      ({
        isCollab,
        hasPermission,
        featureFlagEnabled,
        isSignatory,
        expectedAuthorisations,
      }) => {
        hasPermissionMock.mockReturnValue(hasPermission)
        isFeatureActivatedMock.mockReturnValue(featureFlagEnabled)
        const tabAuthorisations = getTabAuthorisations(isCollab, isSignatory)

        expect(tabAuthorisations).toStrictEqual(expectedAuthorisations)
      })
  })

  describe('getTabAuthorisations - invoices access', () => {
    const isFeatureActivatedMock = vi.mocked(featureFlagManagerMock.isFeatureActivated)

    beforeEach(() => {
      hasPermissionMock.mockClear()
    })

    it.each([
      {
        description: 'returns true for collab when feature flag is enabled',
        isCollab: true,
        hasPermission: true,
        featureFlagEnabled: true,
        isSignatory: false,
        expected: true,
      },
      {
        description: 'returns true for customer signatory when feature flag is enabled',
        isCollab: false,
        hasPermission: true,
        featureFlagEnabled: true,
        isSignatory: true,
        expected: true,
      },
      {
        description: 'returns false for customer without signatory status',
        isCollab: false,
        hasPermission: true,
        featureFlagEnabled: true,
        isSignatory: false,
        expected: false,
      },
      {
        description: 'returns false when feature flag is disabled',
        isCollab: true,
        hasPermission: true,
        featureFlagEnabled: false,
        isSignatory: false,
        expected: false,
      },
    ])('$description', ({
      isCollab,
      hasPermission,
      featureFlagEnabled,
      isSignatory,
      expected,
    }) => {
      hasPermissionMock.mockReturnValue(hasPermission)
      isFeatureActivatedMock.mockReturnValue(featureFlagEnabled)

      const result = getTabAuthorisations(isCollab, isSignatory).invoices

      expect(result).toBe(expected)
    })
  })

  describe('getTabs', () => {
    it('should return proper tabs', () => {
      const tabAuthorisations: Record<TabName, boolean> = {
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
      const tabs = getTabs(tabAuthorisations, titles)
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
