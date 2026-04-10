import { RouteName } from '@pulse/common/enums'
import { CurrentUserManagerMock, hasPermissionMock } from '@pulse/common/mocks/vitest'
import type { ProspectTabName, ProspectTab } from './prospect-overview.type'

import { getProspectTabAuthorizations, getProspectTabs } from './prospect-overview.helper'

vi.mock('@pulse/common/managers', () => ({
  CurrentUserManager: CurrentUserManagerMock,
}))

describe('prospect-overview-helper', () => {
  describe('getProspectTabAuthorizations', () => {
    it.each([
      {
        isCollab: true,
        hasPermission: true,
        expectedAuthorizations: {
          [RouteName.PROSPECT_USERS]: true,
          [RouteName.PROSPECT_COLLAB]: true,
        },
      },
      {
        isCollab: false,
        hasPermission: true,
        expectedAuthorizations: {
          [RouteName.PROSPECT_USERS]: true,
          [RouteName.PROSPECT_COLLAB]: false,
        },
      },
      {
        isCollab: true,
        hasPermission: false,
        expectedAuthorizations: {
          [RouteName.PROSPECT_USERS]: false,
          [RouteName.PROSPECT_COLLAB]: false,
        },
      },
      {
        isCollab: false,
        hasPermission: false,
        expectedAuthorizations: {
          [RouteName.PROSPECT_USERS]: false,
          [RouteName.PROSPECT_COLLAB]: false,
        },
      },
    ])(
      'should return proper authorizations when isCollab is $isCollab and hasPermission returns $hasPermission',
      ({ isCollab, hasPermission, expectedAuthorizations }) => {
        hasPermissionMock.mockReturnValue(hasPermission)
        const tabAuthorizations = getProspectTabAuthorizations(isCollab)

        expect(tabAuthorizations).toStrictEqual(expectedAuthorizations)
      },
    )
  })

  describe('getProspectTabs', () => {
    it('should return only authorized tabs in correct order', () => {
      const tabAuthorizations: Record<ProspectTabName, boolean> = {
        [RouteName.PROSPECT_USERS]: true,
        [RouteName.PROSPECT_COLLAB]: true,
      }
      const titles: Record<ProspectTabName, string> = {
        [RouteName.PROSPECT_USERS]: 'Utilisateurs',
        [RouteName.PROSPECT_COLLAB]: 'Collaborateurs',
      }
      const tabs = getProspectTabs(tabAuthorizations, titles)
      const expectedTabs: ProspectTab[] = [
        { name: RouteName.PROSPECT_USERS, title: 'Utilisateurs' },
        { name: RouteName.PROSPECT_COLLAB, title: 'Collaborateurs' },
      ]

      expect(tabs).toStrictEqual(expectedTabs)
    })

    it('should filter out unauthorized tabs', () => {
      const tabAuthorizations: Record<ProspectTabName, boolean> = {
        [RouteName.PROSPECT_USERS]: true,
        [RouteName.PROSPECT_COLLAB]: false,
      }
      const titles: Record<ProspectTabName, string> = {
        [RouteName.PROSPECT_USERS]: 'Utilisateurs',
        [RouteName.PROSPECT_COLLAB]: 'Collaborateurs',
      }
      const tabs = getProspectTabs(tabAuthorizations, titles)

      expect(tabs).toStrictEqual([
        { name: RouteName.PROSPECT_USERS, title: 'Utilisateurs' },
      ])
    })
  })
})
