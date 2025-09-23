import { beforeEach, describe, it, expect, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import type { Tab } from './FolderTypes'
import * as FolderHelper from './FolderHelper'
import {
  AmplitudeServiceMock,
  getStoreMock,
  getMockedEntitySummary,
} from '@pulse/common/mocks'
import type { ComponentWrapper } from '@entities/common/types'
import { mockedEntity } from '@entities/__mocks__/entities.mocks'
import { useUserStore, useSelectedEntityStore } from '@pulse/common/stores'

import Folder from '.'

const userStoreMock = getStoreMock(useUserStore)
const selectedEntityStoreMock = getStoreMock(useSelectedEntityStore)

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

vi.mock('@pulse/common/services/amplitude', () => ({
  AmplitudeService: AmplitudeServiceMock,
}))

vi.mock('@pulse/common', () => ({
  sanitizeUrl: vi.fn(),
}))

const fetchUserAccountPermissionsMock = vi.hoisted(() => vi.fn())
vi.mock('@pulse/common/services/permissions', () => ({
  fetchUserAccountPermissions: fetchUserAccountPermissionsMock,
}))

vi.mock('./FolderHelper', () => {
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
  mount(Folder, {
    attachTo: document.body,
    global: {
      stubs: {
        RouterView: true,
        PEntityHeader: true,
        Home: true,
      },
    },
  })

describe('folder', () => {
  let wrapper: ComponentWrapper<InstanceType<typeof Folder>>

  beforeEach(async () => {
    vi.useFakeTimers()
    userStoreMock.isCollab = true
    selectedEntityStoreMock.selectedEntity = entitySummaryMock

    wrapper = createWrapper()
    await flushPromises()
  })

  describe('display', () => {
    it('displays the home page if route equal to folder', async () => {
      useRouteSpy.mockReturnValueOnce({ name: 'folder' })
      wrapper = createWrapper()

      await flushPromises()
      const homeComponent = wrapper.findComponent({ name: 'WalletLandingPage' })
      const folderTabsWrapper = wrapper.find(
        '[data-testid=folder-tabs-wrapper]',
      )

      expect(homeComponent.exists()).toBeTruthy()
      expect(folderTabsWrapper.exists()).toBeFalsy()
    })

    it('should only display tabs to which the user has permission to access', async () => {
      const title = 'Information'
      const mockedTabs: Tab[] = [
        {
          name: 'info',
          title,
        },
      ]
      vi.spyOn(FolderHelper, 'getTabs').mockReturnValue(mockedTabs)
      wrapper = createWrapper()
      await flushPromises()

      const folderTabsAccess = [title]
      const tabsPane = wrapper.findAllComponents({ name: 'PTabPane' })
      folderTabsAccess.forEach((tabPane, index) => {
        const label = tabsPane.at(index)?.props('pLabel')
        expect(label).toBe(tabPane)
      })
    })

    it("should not display the 'Add User' button if the client does not have the necessary permissions", async () => {
      vi.spyOn(FolderHelper, 'getTabs').mockReturnValue([])

      await flushPromises()
      wrapper = createWrapper()
      const folderActionButton = wrapper.findComponent({ name: 'PButton' })

      expect(folderActionButton.exists()).toBeFalsy()
    })
  })
})
