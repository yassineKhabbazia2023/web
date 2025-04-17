import { describe, it, expect, vi, type MockInstance, beforeEach } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import * as ReportService from '@app/services/reporting'
import { getMockedFavoriteEntities } from '@app/__mocks__/entities.mocks'
import { getMockedBIReports } from '@app/__mocks__/bi-reports.mocks'
import { CurrentUserManagerMock, hasPermissionMock, getHasPermissionMocked } from '@pulse/common/mocks'
import { amplitudeService } from '@pulse/common'
import { PERMISSION_CODES } from '@app/constants'

import SidebarEntityMenu from '.'

const mockedBIReports = getMockedBIReports()
const favoriteEntityId: number = getMockedFavoriteEntities()[0].accountId

const defaultProps = {
  selectedEntityId: favoriteEntityId,
  isCollab: false,
}

vi.mock('@app/services/reporting', () => ({
  fetchBIReports: vi.fn(() => Promise.resolve({ totalItems: 0 })),
}))

vi.mock('vue-router', () => ({
  useRoute: () => ({
    fullPath: '/launcher',
  }),
}))

vi.mock('@pulse/common', () => ({
  amplitudeService: {
    track: vi.fn(),
  },
}))

vi.mock('@pulse/common/managers', () => ({
  CurrentUserManager: CurrentUserManagerMock,
}))

const createWrapper = (props = defaultProps) => {
  const wrapper = mount(SidebarEntityMenu, {
    props,
  })

  return wrapper
}

describe('sidebarEntityMenu', () => {
  let wrapper: VueWrapper<any>
  let spyTrackAmplitude: MockInstance
  beforeEach(() => {
    spyTrackAmplitude = vi.spyOn(amplitudeService, 'track')
  })
  describe('display', () => {
    it('should display the sidebar entity menu correctly', () => {
      wrapper = createWrapper()
      const sidebarEntityMenu = wrapper.find('[data-testid=sidenav-menu]')

      expect(sidebarEntityMenu.exists()).toBeTruthy()
    })
    it('should display only the menu items that the user has access to', () => {
      hasPermissionMock.mockImplementation(getHasPermissionMocked([PERMISSION_CODES.ACCOUNT_INFORMATION[0]]))
      wrapper = createWrapper()
      const sidebarEntityMenuItems = wrapper
        .findAll('.p-menu-item__title')
        .map((item) => item.text())
      const menuItemsWithAccess = ['Home', 'Entity']
      const menuItemsWithoutAccess = 'Users'

      expect(sidebarEntityMenuItems).toStrictEqual(menuItemsWithAccess)
      expect(sidebarEntityMenuItems).not.toContain(menuItemsWithoutAccess)
    })
    it('should not display the Delegations history for clients', async () => {
      hasPermissionMock.mockImplementation(getHasPermissionMocked([PERMISSION_CODES.HISTORY]))
      wrapper = createWrapper()
      await flushPromises()
      const sidebarEntityMenuItems = wrapper
        .findAll('.p-menu-item__title')
        .map((item) => item.text())
      const menuItemsWithAccess = 'Home'
      const menuItemsWithoutAccess = 'Entity'

      expect(sidebarEntityMenuItems).toContain(menuItemsWithAccess)
      expect(sidebarEntityMenuItems).not.toContain(menuItemsWithoutAccess)
    })

    it('should display the Power BI menu if the user has BI reports', async () => {
      vi.spyOn(ReportService, 'fetchBIReports').mockResolvedValue({
        items: mockedBIReports,
        totalItems: mockedBIReports.length,
        currentPage: 1,
        totalPage: 1,
      })
      wrapper = createWrapper()
      await flushPromises()
      const sidebarEntityMenuItems = wrapper
        .findAll('.p-menu-item__title')
        .map((item) => item.text())

      expect(sidebarEntityMenuItems).toContain('BI reports')
    })
  })
  describe('events', () => {
    it("should expand the sidebar entity menu on 'mouseover' and collapse it on 'mouseleave'", async () => {
      wrapper = createWrapper()
      expect(wrapper.classes()).toContain('sidenav-entity-menu--collapsed')

      await wrapper.trigger('mouseover')

      expect(wrapper.classes()).not.toContain('sidenav-entity-menu--collapsed')

      await wrapper.trigger('mouseleave')

      expect(wrapper.classes()).toContain('sidenav-entity-menu--collapsed')
    })
    it('should track amplitude event when a menu item is clicked', async () => {
      wrapper = createWrapper()
      const sidebarEntityMenuItem = wrapper.findAll('[data-testid=menu-item]')[2]
      await sidebarEntityMenuItem.trigger('click')

      expect(spyTrackAmplitude).toHaveBeenCalledOnce()
      expect(spyTrackAmplitude).toHaveBeenCalledWith('Feature Consulted', {
        feature_name: 'documents',
      })
    })
  })
})
