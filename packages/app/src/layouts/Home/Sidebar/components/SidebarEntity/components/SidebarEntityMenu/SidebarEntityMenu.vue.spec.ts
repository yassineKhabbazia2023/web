import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import { getMockedFavoriteEntities } from '@app/__mocks__/entities.mocks'
import { CurrentUserManagerMock, hasPermissionMock, getHasPermissionMocked } from '@pulse/common/mocks'
import { GLOBAL_PERMISSIONS } from '@pulse/common/constants'
import { CustomerPermission } from '@pulse/common/enums'

import type { SidebarEntityMenuProps } from './SidebarEntityMenuTypes'
import SidebarEntityMenu from '.'

const favoriteEntityId: number = getMockedFavoriteEntities()[0].accountId

const defaultProps: SidebarEntityMenuProps = {
  selectedEntityId: favoriteEntityId,
  isCollab: false,
  isSingleEntity: false,
}

vi.mock('vue-router', () => ({
  useRoute: () => ({
    fullPath: '/launcher',
  }),
}))

const canShowBIReportsSpy = vi.hoisted(() => vi.fn())
const hasPennylaneAccountingPermissionSpy = vi.hoisted(() => vi.fn())

vi.mock('@pulse/common/managers', () => ({
  CurrentUserManager: CurrentUserManagerMock,
  ReportingManager: {
    canShowBIReports: canShowBIReportsSpy,
  },
  PennylanePermissionsManager: {
    hasPennylaneAccountingPermission: hasPennylaneAccountingPermissionSpy,
  },
}))

const createWrapper = (props = defaultProps) => {
  const wrapper = mount(SidebarEntityMenu, {
    props,
  })

  return wrapper
}

describe('sidebarEntityMenu', () => {
  let wrapper: VueWrapper<any>

  describe('display', () => {
    it('should display only the menu items that the user has access to', () => {
      hasPermissionMock.mockImplementation(getHasPermissionMocked([CustomerPermission.ACCEDER_INFORMATIONS_ENTREPRISE]))
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
      hasPermissionMock.mockImplementation(getHasPermissionMocked(GLOBAL_PERMISSIONS.HISTORY))
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

    it('should display the Power BI menu if the user has access to BI reports', async () => {
      canShowBIReportsSpy.mockResolvedValue(true)
      wrapper = createWrapper()
      await flushPromises()
      const sidebarEntityMenuItems = wrapper
        .findAll('.p-menu-item__title')
        .map((item) => item.text())

      expect(sidebarEntityMenuItems).toContain('BI reports')
    })

    it('should NOT display the Power BI menu if the user has no access', async () => {
      canShowBIReportsSpy.mockResolvedValue(false)
      wrapper = createWrapper()
      await flushPromises()
      const sidebarEntityMenuItems = wrapper
        .findAll('.p-menu-item__title')
        .map((item) => item.text())

      expect(sidebarEntityMenuItems).not.toContain('BI reports')
    })
  })
  describe('classes behavior', () => {
    describe('user is a collab', () => {
      it('should display the collab classes for collab user', () => {
        const props = {
          ...defaultProps,
          isCollab: true,
        }
        wrapper = createWrapper(props)
        expect(wrapper.classes()).toContain('sidenav-entity-menu--is-collab')
      })
      it('should NOT display as a single-entity navbar when the collab user is single entity', () => {
        const props = {
          ...defaultProps,
          isCollab: true,
          isSingleEntity: true,
        }
        wrapper = createWrapper(props)
        expect(wrapper.classes()).not.toContain('sidenav-entity-menu--is-single-entity')
      })
    })
    describe('user is NOT a collab', () => {
      it('should NOT display the collab classes for customer', () => {
        const props = {
          ...defaultProps,
          isCollab: false,
        }
        wrapper = createWrapper(props)
        expect(wrapper.classes()).not.toContain('sidenav-entity-menu--is-collab')
      })
      it('should display as a single-entity navbar when the customer user is single entity', () => {
        const props = {
          ...defaultProps,
          isCollab: false,
          isSingleEntity: true,
        }
        wrapper = createWrapper(props)
        expect(wrapper.classes()).toContain('sidenav-entity-menu--is-single-entity')
      })
    })
  })
})
