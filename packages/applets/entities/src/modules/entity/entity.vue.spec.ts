import { beforeEach, describe, it, expect, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import type { Tab } from './types'
import * as EntityHelper from './entity-helper'
import {
  getStoreMock,
  getMockedEntitySummary,
} from '@pulse/common/mocks'
import type { ComponentWrapper } from '@entities/types'
import { mockedEntity } from '@entities/__mocks__/entities.mocks'
import { useUserStore, useCurrentEntityStore } from '@pulse/common/stores'

import Entity from '.'

const userStoreMock = getStoreMock(useUserStore)
const currentEntityStoreMock = getStoreMock(useCurrentEntityStore)

const mockedTabs: Tab[] = [
  {
    name: 'collab',
    title: 'Collaborateurs',
  },
  {
    name: 'users',
    title: 'Utilisateurs',
  },
  {
    name: 'offers',
    title: 'Offres',
  },
  {
    name: 'info',
    title: 'Informations',
  },
]
const entitySummaryMock = getMockedEntitySummary(mockedEntity)

vi.mock('@pulse/common', () => ({
  sanitizeUrl: vi.fn(),
}))

const fetchUserAccountPermissionsMock = vi.hoisted(() => vi.fn())
vi.mock('@pulse/common/services/permissions', () => ({
  fetchUserAccountPermissions: fetchUserAccountPermissionsMock,
}))

vi.mock('./entity-helper', () => {
  return {
    getTabAuthorisations: vi.fn(),
    getTabs: vi.fn(() => {
      return mockedTabs
    }),
  }
})

const mockRouterPush = vi.fn()
const useRouteSpy = vi.hoisted(() => vi.fn(() => ({
  name: 'wallet',
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
          name: 'info',
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
