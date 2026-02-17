import { ref } from 'vue'
import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import { getMockedFavoriteEntities, getHasPermissionMocked } from '@pulse/common/mocks'
import { CurrentUserManagerMock, hasPermissionMock } from '@pulse/common/mocks/vitest'
import { GLOBAL_PERMISSIONS } from '@pulse/common/constants'
import { CustomerPermission } from '@pulse/common/enums'

import SidebarEntity from '.'

const favoriteEntityId: number = getMockedFavoriteEntities()[0].accountId

const isCollabMock = vi.hoisted(() => ({ value: false }))

vi.mock('@pulse/common/stores', () => ({
  useUserStore: () => ({
    get isCollab() {
      return isCollabMock.value
    },
  }),
}))

const isEntityViewRef = ref(true)
const currentEntityIdRef = ref<number>(0)

vi.mock('@pulse/shared/composables', async (importOriginal) => {
  const original = await importOriginal<Record<string, unknown>>()
  return {
    ...original,
    useCurrentEntity: () => ({
      isEntityView: isEntityViewRef,
      currentEntityId: currentEntityIdRef,
    }),
  }
})

const resolveSpy = vi.hoisted(() => vi.fn())
vi.mock('vue-router', () => ({
  useRoute: () => ({
    fullPath: '/launcher',
    name: 'homepage',
    params: { entityId: String(favoriteEntityId) },
  }),
  useRouter: () => ({
    resolve: resolveSpy,
  }),
}))

const canShowBIReportsSpy = vi.hoisted(() => vi.fn())
const hasPennylaneAccountingPermissionSpy = vi.hoisted(() => vi.fn())
const hasPennylaneAccountingGedV2PermissionSpy = vi.hoisted(() => vi.fn())
const hasPennylaneAccountingGedLegacyPermissionSpy = vi.hoisted(() => vi.fn())
const hasSocialManagementV2Spy = vi.hoisted(() => vi.fn())

vi.mock('@pulse/common/managers', () => ({
  CurrentUserManager: CurrentUserManagerMock,
  ReportingManager: {
    canShowBIReports: canShowBIReportsSpy,
  },
  PennylanePermissionsManager: {
    hasPennylaneAccountingPermission: hasPennylaneAccountingPermissionSpy,
    hasPennylaneAccountingGedV2Permission: hasPennylaneAccountingGedV2PermissionSpy,
    hasPennylaneAccountingGedLegacyPermission: hasPennylaneAccountingGedLegacyPermissionSpy,
    hasSocialManagementV2: hasSocialManagementV2Spy,
  },
}))

const getMenuItemsMock = vi.hoisted(() => vi.fn())
const getEntityOverviewMenuItemMock = vi.hoisted(() => vi.fn())
vi.mock('@pulse/shared/managers', () => ({
  NavigationManager: {
    getMenuItems: getMenuItemsMock,
    getEntityOverviewMenuItem: getEntityOverviewMenuItemMock,
  },
}))

const createWrapper = () => {
  return mount(SidebarEntity)
}

describe('sidebarEntity', () => {
  let wrapper: VueWrapper<any>
  beforeEach(() => {
    isCollabMock.value = false
    isEntityViewRef.value = true
    currentEntityIdRef.value = favoriteEntityId
    resolveSpy.mockResolvedValue({
      path: '',
    })

    // Default mock values for NavigationManager
    getMenuItemsMock.mockReturnValue([])
    getEntityOverviewMenuItemMock.mockReturnValue({
      routePath: `/dossier/${favoriteEntityId}/informations`,
      title: 'shared.sidebar.entity',
      iconLeftName: 'building',
      display: true,
    })
  })

  describe('visibility', () => {
    it('should not render when isEntityView is false', () => {
      isEntityViewRef.value = false
      wrapper = createWrapper()
      expect(wrapper.find('[data-testid="sidenav-entity-menu"]').exists()).toBe(false)
    })

    it('should render when isEntityView is true', () => {
      wrapper = createWrapper()
      expect(wrapper.find('[data-testid="sidenav-entity-menu"]').exists()).toBe(true)
    })
  })

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
      getEntityOverviewMenuItemMock.mockReturnValue(null)
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
      getMenuItemsMock.mockReturnValue([
        {
          routePath: `/dossier/${favoriteEntityId}/rapports-bi`,
          title: 'shared.sidebar.biReports',
          iconLeftName: 'clipboardData',
          display: true,
        },
      ])
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
        isCollabMock.value = true
        wrapper = createWrapper()
        const menu = wrapper.find('[data-testid="sidenav-entity-menu"]')
        expect(menu.classes()).toContain('sidebar-entity--is-collab')
      })
    })
    describe('user is NOT a collab', () => {
      it('should NOT display the collab classes for customer', () => {
        isCollabMock.value = false
        wrapper = createWrapper()
        const menu = wrapper.find('[data-testid="sidenav-entity-menu"]')
        expect(menu.classes()).not.toContain('sidebar-entity--is-collab')
      })
    })
  })
})
