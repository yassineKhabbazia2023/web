import { describe, it, expect } from 'vitest'
import { getTabAuthorisations, getTabs } from './FolderHelper'
import { mockHasPermission } from '@/../vitest.setup'
import type { TabName, Tab } from './FolderTypes'

describe('test FolderHelper', () => {
  describe('getTabAuthorisations', () => {
    const tests = [{
      isCollab: true,
      hasPermissionReturnValue: true,
      expectedAuthorisations: {
        collab: true,
        delegationsHistory: true,
        info: true,
        offers: true,
        usersClient: false,
        usersCollab: true,
      },
    }, {
      isCollab: false,
      hasPermissionReturnValue: true,
      expectedAuthorisations: {
        collab: true,
        delegationsHistory: false,
        info: true,
        offers: true,
        usersClient: true,
        usersCollab: false,
      },
    }, {
      isCollab: true,
      hasPermissionReturnValue: false,
      expectedAuthorisations: {
        collab: false,
        delegationsHistory: false,
        info: false,
        offers: false,
        usersClient: false,
        usersCollab: false,
      },
    }, {
      isCollab: false,
      hasPermissionReturnValue: false,
      expectedAuthorisations: {
        collab: false,
        delegationsHistory: false,
        info: false,
        offers: false,
        usersClient: false,
        usersCollab: false,
      },
    }]
    it.each(tests)(
      'should return proper authorisations when isCollab is $isCollab and hasPermission returns $hasPermission',
      ({
        isCollab,
        hasPermissionReturnValue,
        expectedAuthorisations,
      }) => {
        mockHasPermission.mockReturnValue(hasPermissionReturnValue)
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
        usersClient: true,
        usersCollab: false,
      }
      const titles: Record<TabName, string> = {
        usersClient: 'Utilisateurs',
        usersCollab: 'Utilisateurs',
        collab: 'Collaborateurs',
        offers: 'Offres',
        info: 'Informations',
        delegationsHistory: 'Historique des délégations',
      }
      const tabs = getTabs(tabAuthorisations, titles)
      const expectedTabs: Tab[] = [{
        name: 'usersClient',
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
