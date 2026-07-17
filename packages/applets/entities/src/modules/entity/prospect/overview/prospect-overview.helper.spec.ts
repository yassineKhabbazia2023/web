import type { MockInstance } from 'vitest'
import { RouteName } from '@pulse/common/enums'
import { armCurrentUserPermissions } from '@pulse/common/mocks/vitest/current-user.permissions.helper'
import type { ProspectTabName, ProspectTab } from './prospect-overview.type'

import { getProspectTabAuthorizations, getProspectTabs } from './prospect-overview.helper'

let hasPermissionMock: MockInstance

beforeEach(() => {
  hasPermissionMock = armCurrentUserPermissions(false)
})

describe('prospect-overview-helper', () => {
  describe('getProspectTabAuthorizations', () => {
    it.each([
      {
        isCollab: true,
        hasPermission: true,
        expectedAuthorizations: {
          [RouteName.PROSPECT_USERS]: true,
          [RouteName.PROSPECT_COLLAB]: true,
          [RouteName.PROSPECT_INFO]: true,
        },
      },
      {
        isCollab: false,
        hasPermission: true,
        expectedAuthorizations: {
          [RouteName.PROSPECT_USERS]: true,
          [RouteName.PROSPECT_COLLAB]: false,
          [RouteName.PROSPECT_INFO]: true,
        },
      },
      {
        isCollab: true,
        hasPermission: false,
        expectedAuthorizations: {
          [RouteName.PROSPECT_USERS]: false,
          [RouteName.PROSPECT_COLLAB]: false,
          [RouteName.PROSPECT_INFO]: false,
        },
      },
      {
        isCollab: false,
        hasPermission: false,
        expectedAuthorizations: {
          [RouteName.PROSPECT_USERS]: false,
          [RouteName.PROSPECT_COLLAB]: false,
          [RouteName.PROSPECT_INFO]: false,
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
        [RouteName.PROSPECT_INFO]: true,
      }
      const titles: Record<ProspectTabName, string> = {
        [RouteName.PROSPECT_USERS]: 'Utilisateurs',
        [RouteName.PROSPECT_COLLAB]: 'Collaborateurs',
        [RouteName.PROSPECT_INFO]: 'Informations',
      }
      const tabs = getProspectTabs(tabAuthorizations, titles)
      const expectedTabs: ProspectTab[] = [
        { name: RouteName.PROSPECT_USERS, title: 'Utilisateurs' },
        { name: RouteName.PROSPECT_COLLAB, title: 'Collaborateurs' },
        { name: RouteName.PROSPECT_INFO, title: 'Informations' },
      ]

      expect(tabs).toStrictEqual(expectedTabs)
    })

    it('should filter out unauthorized tabs', () => {
      const tabAuthorizations: Record<ProspectTabName, boolean> = {
        [RouteName.PROSPECT_USERS]: true,
        [RouteName.PROSPECT_COLLAB]: false,
        [RouteName.PROSPECT_INFO]: false,
      }
      const titles: Record<ProspectTabName, string> = {
        [RouteName.PROSPECT_USERS]: 'Utilisateurs',
        [RouteName.PROSPECT_COLLAB]: 'Collaborateurs',
        [RouteName.PROSPECT_INFO]: 'Informations',
      }
      const tabs = getProspectTabs(tabAuthorizations, titles)

      expect(tabs).toStrictEqual([
        { name: RouteName.PROSPECT_USERS, title: 'Utilisateurs' },
      ])
    })
  })
})
