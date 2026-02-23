import { beforeEach, describe, it, expect, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { RouteName } from '@pulse/common/enums'
import type { Tab } from './types'
import * as EntityHelper from './entity-helper'
import { getMockedEntitySummary, getMockedEntity } from '@pulse/common/mocks'
import { getStoreMock } from '@pulse/common/mocks/vitest'
import type { ComponentWrapper } from '@entities/types'
import { useUserStore, useCurrentEntityStore } from '@pulse/common/stores'

import Entity from './Entity.page.vue'

const userStoreMock = getStoreMock(useUserStore)
const currentEntityStoreMock = getStoreMock(useCurrentEntityStore)

const mockedTabs: Tab[] = [
  {
    name: RouteName.COLLAB,
    title: 'Collaborateurs',
  },
  {
    name: RouteName.USERS,
    title: 'Utilisateurs',
  },
  {
    name: RouteName.OFFERS,
    title: 'Offres',
  },
  {
    name: RouteName.INFO,
    title: 'Informations',
  },
]
const entitySummaryMock = getMockedEntitySummary(getMockedEntity())

vi.mock('@pulse/common', () => ({
  sanitizeUrl: vi.fn(),
}))

const fetchUserAccountPermissionsMock = vi.hoisted(() => vi.fn())
vi.mock('@pulse/common/services/permissions', () => ({
  fetchUserAccountPermissions: fetchUserAccountPermissionsMock,
}))

vi.mock('./entity-helper', () => {
  return {
    getTabAuthorizations: vi.fn(),
    getTabs: vi.fn(() => {
      return mockedTabs
    }),
  }
})

const mockRouterPush = vi.fn()
const useRouteSpy = vi.hoisted(() => vi.fn(() => ({
  name: RouteName.WALLET,
})))

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
  useRoute: useRouteSpy,
}))

const createWrapper = () =>
  mount(Entity, {
    attachTo: document.body,
    global: {
      stubs: {
        RouterView: true,
        PEntityHeader: true,
        Home: true,
      },
    },
  })

describe('entity', () => {
  let wrapper: ComponentWrapper<InstanceType<typeof Entity>>

  beforeEach(async () => {
    vi.useFakeTimers()
    userStoreMock.isCollab = true
    currentEntityStoreMock.currentEntity = entitySummaryMock

    wrapper = createWrapper()
    await flushPromises()
  })

  describe('display', () => {
    it('should only display tabs to which the user has permission to access', async () => {
      const title = 'Information'
      const mockedTabs: Tab[] = [
        {
          name: RouteName.INFO,
          title,
        },
      ]
      vi.spyOn(EntityHelper, 'getTabs').mockReturnValue(mockedTabs)
      wrapper = createWrapper()
      await flushPromises()

      const entityTabsAccess = [title]
      const tabsPane = wrapper.findAllComponents({ name: 'PTabPane' })
      entityTabsAccess.forEach((tabPane, index) => {
        const label = tabsPane.at(index)?.props('pLabel')
        expect(label).toBe(tabPane)
      })
    })

    it("should not display the 'Add User' button if the client does not have the necessary permissions", async () => {
      vi.spyOn(EntityHelper, 'getTabs').mockReturnValue([])

      await flushPromises()
      wrapper = createWrapper()
      const entityActionButton = wrapper.findComponent({ name: 'PButton' })

      expect(entityActionButton.exists()).toBeFalsy()
    })
  })
})
