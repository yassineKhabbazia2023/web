import { describe, it, expect } from 'vitest'
import '@entities/__mocks__/common.import.mocks'
import { CurrentUserManagerMock, hasPermissionMock } from '@pulse/common/mocks'
import type { TabName, Tab } from './FolderTypes'

import { getTabAuthorisations, getTabs } from './FolderHelper'

vi.mock('@pulse/common/managers', () => ({
  CurrentUserManager: CurrentUserManagerMock,
}))

describe('test FolderHelper', () => {
  describe('getTabAuthorisations', () => {
    const tests = [{
      isCollab: true,
      hasPermission: true,
      expectedAuthorisations: {
        collab: true,
        delegationsHistory: true,
        info: true,
        offers: true,
        users: true,
      },
    }, {
      isCollab: false,
      hasPermission: true,
      expectedAuthorisations: {
        collab: false,
        delegationsHistory: false,
        info: true,
        offers: true,
        users: true,
      },
    }, {
      isCollab: true,
      hasPermission: false,
      expectedAuthorisations: {
        collab: false,
        delegationsHistory: false,
        info: false,
        offers: false,
        users: false,
      },
    }, {
      isCollab: false,
      hasPermission: false,
      expectedAuthorisations: {
        collab: false,
        delegationsHistory: false,
        info: false,
        offers: false,
        users: false,
      },
    }]
    it.each(tests)(
      'should return proper authorisations when isCollab is $isCollab and hasPermission returns $hasPermission',
      ({
        isCollab,
        hasPermission,
        expectedAuthorisations,
      }) => {
        hasPermissionMock.mockReturnValue(hasPermission)
        const tabAuthorisations = getTabAuthorisations(isCollab)

        expect(tabAuthorisations).toStrictEqual(expectedAuthorisations)
      })
  })

  describe('getTabs', () => {
    it('should return proper tabs', () => {
      const tabAuthorisations: Record<TabName, boolean> = {
        collab: true,
        delegationsHistory: false,
        info: true,
        offers: true,
        users: true,
      }
      const titles: Record<TabName, string> = {
        users: 'Utilisateurs',
        collab: 'Collaborateurs',
        offers: 'Offres',
        info: 'Informations',
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
        name: 'info',
        title: 'Informations',
      }]

      expect(tabs).toStrictEqual(expectedTabs)
    })
  })
})
