import { describe, it, expect, vi } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { getMockedFavoriteEntities } from '../../MockedFavoriteEntities'
import { createTestingPinia } from '@pinia/testing'
import { createPinia, defineStore, setActivePinia } from 'pinia'
import { commonPinia as pinia } from '@kpmg/common'
import { PERMISSION_CODES } from '@/constants'
import SidebarEntityMenu from '.'

const favoriteEntityId: number = getMockedFavoriteEntities()[0].accountId
const mockHasPermission = vi.fn((_code: string[]) => true)

const defaultProps = {
  selectedEntityId: favoriteEntityId,
}

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
    },
  }),
  userPermissions: () => ({
    hasPermission: mockHasPermission,
  }),
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
  setActivePinia(pinia)
  describe('display', () => {
    it('should display the sidebar entity menu correctly', () => {
      wrapper = createWrapper()
      const sidebarEntityMenu = wrapper.find(
        '[data-testid=sidenav-menu]',
      )

      expect(sidebarEntityMenu.exists()).toBeTruthy()
    })
    it('should display only the menu items that the user has access to', () => {
      mockHasPermission.mockImplementation((permissions: string[]) =>
        permissions.includes(PERMISSION_CODES.ACCOUNT_INFORMATION[0]),
      )
      wrapper = createWrapper()
      const sidebarEntityMenuItems = wrapper.findAll('.p-menu-item__title').map((item) => item.text())
      const menuItemsWithAccess = ['Home', 'Information']
      const menuItemsWithoutAccess = 'Users'

      expect(sidebarEntityMenuItems).toStrictEqual(menuItemsWithAccess)
      expect(sidebarEntityMenuItems).not.toContain(menuItemsWithoutAccess)
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
  })
})
