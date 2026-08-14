import type { MockInstance } from 'vitest'
import { RouteName } from '@pulse/common/enums'
import { CurrentUserManager, FeatureFlagManager } from '@pulse/common/managers'
import type { TabName, Tab } from '../types'

import { getTabAuthorizations, getTabs } from './entity-overview.helper'

let hasCurrentEntityPermissionMock: MockInstance
const isFeatureActivatedGlobalMock = vi.fn()

beforeEach(() => {
  hasCurrentEntityPermissionMock = vi.spyOn(CurrentUserManager, 'hasCurrentEntityPermission').mockReturnValue(false)
  vi.spyOn(FeatureFlagManager, 'isFeatureActivated').mockImplementation(isFeatureActivatedGlobalMock)
})

describe('test entity-helper', () => {
  describe('getTabAuthorizations', () => {
    const isFeatureActivatedMock = isFeatureActivatedGlobalMock
    const tests = [{
      isCollab: true,
      hasCurrentEntityPermission: true,
      featureFlagEnabled: true,
      isInvoicesTabVisible: true,
      expectedAuthorizations: {
        [RouteName.COLLAB]: true,
        [RouteName.FOLDER_HISTORY]: true,
        [RouteName.INFO]: true,
        [RouteName.OFFERS]: true,
        [RouteName.RYDGE_INVOICES]: true,
        [RouteName.USERS]: true,
      },
    }, {
      isCollab: false,
      hasCurrentEntityPermission: true,
      featureFlagEnabled: true,
      isInvoicesTabVisible: true,
      expectedAuthorizations: {
        [RouteName.COLLAB]: false,
        [RouteName.FOLDER_HISTORY]: false,
        [RouteName.INFO]: true,
        [RouteName.OFFERS]: true,
        [RouteName.RYDGE_INVOICES]: true,
        [RouteName.USERS]: true,
      },
    }, {
      isCollab: true,
      hasCurrentEntityPermission: false,
      featureFlagEnabled: true,
      isInvoicesTabVisible: true,
      expectedAuthorizations: {
        [RouteName.COLLAB]: false,
        [RouteName.FOLDER_HISTORY]: true,
        [RouteName.INFO]: false,
        [RouteName.OFFERS]: false,
        [RouteName.RYDGE_INVOICES]: true,
        [RouteName.USERS]: false,
      },
    }, {
      isCollab: false,
      hasCurrentEntityPermission: false,
      featureFlagEnabled: true,
      isInvoicesTabVisible: false,
      expectedAuthorizations: {
        [RouteName.COLLAB]: false,
        [RouteName.FOLDER_HISTORY]: false,
        [RouteName.INFO]: false,
        [RouteName.OFFERS]: false,
        [RouteName.RYDGE_INVOICES]: false,
        [RouteName.USERS]: false,
      },
    }]
    it.each(tests)(
      'should return proper authorizations when isCollab is $isCollab and hasCurrentEntityPermission returns $hasCurrentEntityPermission',
      ({
        isCollab,
        hasCurrentEntityPermission,
        featureFlagEnabled,
        isInvoicesTabVisible,
        expectedAuthorizations,
      }) => {
        hasCurrentEntityPermissionMock.mockReturnValue(hasCurrentEntityPermission)
        isFeatureActivatedMock.mockReturnValue(featureFlagEnabled)
        const tabAuthorizations = getTabAuthorizations(isCollab, isInvoicesTabVisible)

        expect(tabAuthorizations).toStrictEqual(expectedAuthorizations)
      })

    it('should not authorize information tab from global permissions only', () => {
      vi.spyOn(CurrentUserManager, 'hasPermission').mockReturnValue(true)
      hasCurrentEntityPermissionMock.mockReturnValue(false)
      isFeatureActivatedMock.mockReturnValue(false)

      const tabAuthorizations = getTabAuthorizations(false, false)

      expect(tabAuthorizations[RouteName.INFO]).toBe(false)
    })
  })

  describe('getTabAuthorizations - invoices access', () => {
    const isFeatureActivatedMock = isFeatureActivatedGlobalMock

    beforeEach(() => {
      hasCurrentEntityPermissionMock.mockClear()
    })

    it.each([
      {
        description: 'returns true when tab is visible and feature flag is enabled',
        isCollab: true,
        hasCurrentEntityPermission: true,
        featureFlagEnabled: true,
        isInvoicesTabVisible: true,
        expected: true,
      },
      {
        description: 'returns false when tab is not visible even with feature flag enabled',
        isCollab: true,
        hasCurrentEntityPermission: true,
        featureFlagEnabled: true,
        isInvoicesTabVisible: false,
        expected: false,
      },
      {
        description: 'returns false when feature flag is disabled even with tab visible',
        isCollab: true,
        hasCurrentEntityPermission: true,
        featureFlagEnabled: false,
        isInvoicesTabVisible: true,
        expected: false,
      },
      {
        description: 'returns false when both feature flag disabled and tab not visible',
        isCollab: false,
        hasCurrentEntityPermission: true,
        featureFlagEnabled: false,
        isInvoicesTabVisible: false,
        expected: false,
      },
    ])('$description', ({
      isCollab,
      hasCurrentEntityPermission,
      featureFlagEnabled,
      isInvoicesTabVisible,
      expected,
    }) => {
      hasCurrentEntityPermissionMock.mockReturnValue(hasCurrentEntityPermission)
      isFeatureActivatedMock.mockReturnValue(featureFlagEnabled)

      const result = getTabAuthorizations(isCollab, isInvoicesTabVisible)[RouteName.RYDGE_INVOICES]

      expect(result).toBe(expected)
    })
  })

  describe('getTabs', () => {
    it('should return proper tabs', () => {
      const tabAuthorisations: Record<TabName, boolean> = {
        [RouteName.COLLAB]: true,
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
