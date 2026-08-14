import { flushPromises, mount } from '@vue/test-utils'
import type { MockInstance } from 'vitest'
import { RouteName } from '@pulse/common/enums'
import { ACCOUNT_PERMISSIONS } from '@pulse/common/constants'
import { CurrentUserManager, FeatureFlagManager } from '@pulse/common/managers'
import { getMockedEntitySummary, getMockedEntity } from '@pulse/common/mocks'
import { getStoreMock } from '@pulse/common/mocks/vitest'
import type { ComponentWrapper } from '@pulse/toolbox/utils/test'
import { useUserStore, useCurrentEntityStore } from '@pulse/common/stores'
import { useRoute, useRouter } from 'vue-router'
import type { RouteLocationNormalizedLoaded, Router } from 'vue-router'
import type { Permission } from '@pulse/common/types'

import EntityOverview from './entity-overview.page.vue'

const userStoreMock = getStoreMock(useUserStore)
const currentEntityStoreMock = getStoreMock(useCurrentEntityStore)

const entitySummaryMock = getMockedEntitySummary(getMockedEntity())

const mockRouterPush = vi.fn()
const mockRouterReplace = vi.fn()

let hasCurrentEntityPermissionMock: MockInstance

beforeEach(() => {
  hasCurrentEntityPermissionMock = vi.spyOn(CurrentUserManager, 'hasCurrentEntityPermission').mockReturnValue(false)
  // Keeps the invoices tab out of the authorized tabs whatever the store state.
  vi.spyOn(FeatureFlagManager, 'isFeatureActivated').mockReturnValue(false)
  userStoreMock.isCollab = true
  currentEntityStoreMock.currentEntity = entitySummaryMock
  vi.mocked(useRouter).mockReturnValue({
    push: mockRouterPush,
    replace: mockRouterReplace,
  } as unknown as Router)
  vi.mocked(useRoute).mockReturnValue({
    name: RouteName.WALLET,
  } as unknown as RouteLocationNormalizedLoaded)
})

const createWrapper = (): ComponentWrapper<InstanceType<typeof EntityOverview>> =>
  mount(EntityOverview, {
    attachTo: document.body,
    global: {
      stubs: {
        RouterView: true,
        PEntityHeader: true,
      },
    },
  })

describe('entity', () => {
  describe('display', () => {
    it('should only display tabs to which the user has permission to access', async () => {
      // Client user granted only the information permission: the collaborator-only
      // tabs and the permission-gated tabs must all be filtered out.
      userStoreMock.isCollab = false
      hasCurrentEntityPermissionMock.mockImplementation(
        (permissions: Permission[]) => permissions === ACCOUNT_PERMISSIONS.INFORMATION,
      )

      const wrapper = createWrapper()
      await flushPromises()

      const tabPanes = wrapper.findAllComponents({ name: 'PTabPane' })
      // The identity i18n stub returns the raw key: the tab labels are the keys.
      expect(tabPanes.map((tabPane) => tabPane.props('pLabel'))).toStrictEqual(['info'])
    })

    it('should display every authorized tab for a fully-permitted collaborator', async () => {
      hasCurrentEntityPermissionMock.mockReturnValue(true)

      const wrapper = createWrapper()
      await flushPromises()

      const tabPanes = wrapper.findAllComponents({ name: 'PTabPane' })
      expect(tabPanes.map((tabPane) => tabPane.props('pLabel'))).toStrictEqual([
        'users',
        'collab',
        'offers',
        'info',
        'history',
      ])
    })

    it('should redirect to the entity redirect page when the user has no authorized tab', async () => {
      userStoreMock.isCollab = false
      vi.mocked(useRoute).mockReturnValue({
        name: RouteName.ENTITY_OVERVIEW,
      } as unknown as RouteLocationNormalizedLoaded)

      const wrapper = createWrapper()
      await flushPromises()

      expect(wrapper.findAllComponents({ name: 'PTabPane' })).toHaveLength(0)
      expect(mockRouterReplace).toHaveBeenCalledExactlyOnceWith({ name: RouteName.ENTITY_REDIRECT })
    })
  })
})
