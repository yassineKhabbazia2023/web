import { describe, it, expect, vi, type SpyInstance, beforeEach } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import * as ReportService from '@/services/reporting'
import { getMockedFavoriteEntities } from '../../MockedFavoriteEntities'
import { createTestingPinia } from '@pinia/testing'
import { createPinia, defineStore, setActivePinia } from 'pinia'
import { commonPinia as pinia, amplitudeService } from '@kpmg/common'
import { PERMISSION_CODES } from '@/constants'
import SidebarEntityMenu from '.'
import { getMockedBIReports } from './SidebarEntityMenuMocks'

const mockedBIReports = getMockedBIReports()
const favoriteEntityId: number = getMockedFavoriteEntities()[0].accountId
const mockHasPermission = vi.fn((_code: string[]) => true)

const defaultProps = {
  selectedEntityId: favoriteEntityId,
}

vi.mock('@/services/reporting', () => ({
  fetchBIReports: vi.fn(() => Promise.resolve({ totalItems: 0 })),
}))

vi.mock('vue-router', () => ({
  useRoute: () => ({
    fullPath: '/launcher',
  }),
}))

vi.mock('@kpmg/common', () => ({
  commonPinia: () => createPinia(),
  commonStore: defineStore('common', {
    getters: {
      isAuthenticated: () => true,
      isCollab: () => false,
    },
  }),
  userPermissions: () => ({
    hasPermission: mockHasPermission,
  }),
  amplitudeService: {
    track: vi.fn(),
  },
}))

const createWrapper = (props = defaultProps) => {
  const wrapper = mount(SidebarEntityMenu, {
    props,
    plugins: [createTestingPinia()],
  })

  return wrapper
}

describe('sidebarEntityMenu', () => {
  let wrapper: VueWrapper<any>
  let spyTrackAmplitude: SpyInstance
  beforeEach(() => {
    spyTrackAmplitude = vi.spyOn(amplitudeService, 'track')
  })
  setActivePinia(pinia)
  describe('display', () => {
    it('should display the sidebar entity menu correctly', () => {
      wrapper = createWrapper()
      const sidebarEntityMenu = wrapper.find('[data-testid=sidenav-menu]')

      expect(sidebarEntityMenu.exists()).toBeTruthy()
    })
    it('should display only the menu items that the user has access to', () => {
      mockHasPermission.mockImplementation((permissions: string[]) =>
        permissions.includes(PERMISSION_CODES.ACCOUNT_INFORMATION[0]),
      )
      wrapper = createWrapper()
      const sidebarEntityMenuItems = wrapper
        .findAll('.p-menu-item__title')
        .map((item) => item.text())
      const menuItemsWithAccess = ['Home', 'Information']
      const menuItemsWithoutAccess = 'Users'

      expect(sidebarEntityMenuItems).toStrictEqual(menuItemsWithAccess)
      expect(sidebarEntityMenuItems).not.toContain(menuItemsWithoutAccess)
    })
    it('should not display the Delegations history for clients', async () => {
      mockHasPermission.mockImplementation((permissions: string[]) =>
        permissions.includes(PERMISSION_CODES.HISTORY),
      )
      wrapper = createWrapper()
      await flushPromises()
      const sidebarEntityMenuItems = wrapper
        .findAll('.p-menu-item__title')
        .map((item) => item.text())
      const menuItemsWithAccess = 'Home'
      const menuItemsWithoutAccess = 'Delegations history'

      expect(sidebarEntityMenuItems).toContain(menuItemsWithAccess)
      expect(sidebarEntityMenuItems).not.toContain(menuItemsWithoutAccess)
    })
    it('should not display the Power BI menu if the user does not have BI reports', () => {
      wrapper = createWrapper()
      const sidebarEntityMenuItems = wrapper
        .findAll('.p-menu-item__title')
        .map((item) => item.text())

      expect(sidebarEntityMenuItems).not.toContain('BI reports')
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
    it('should track amplitude event when a nested menu item is clicked', async () => {
      wrapper = createWrapper()
      const sidebarEntityMenu = wrapper.find('[data-testid=nested-menu-item]')
      await sidebarEntityMenu.trigger('click')

      expect(spyTrackAmplitude).toHaveBeenCalledOnce()
      expect(spyTrackAmplitude).toHaveBeenCalledWith('Feature Consulted', {
        feature_name: 'users',
      })
    })
    it('should track amplitude event when a menu item is clicked', async () => {
      wrapper = createWrapper()
      const sidebarEntityMenuItem = wrapper.find('[data-testid=menu-item]')
      await sidebarEntityMenuItem.trigger('click')

      expect(spyTrackAmplitude).toHaveBeenCalledOnce()
      expect(spyTrackAmplitude).toHaveBeenCalledWith('Feature Consulted', {
        feature_name: 'documents',
      })
    })
  })
})
