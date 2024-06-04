import { defineStore } from 'pinia'
import { beforeEach, describe, it, expect, vi } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { commonStore } from '@kpmg/common'
import { mockedEntity } from '../wallet/components/TableData/mockData'
import type { Tab } from './FolderTypes'
import * as FolderHelper from './FolderHelper'
import Folder from './'

const pinia = createTestingPinia()

const mockedTabs: Tab[] = [{
  name: 'collab',
  title: 'Collaborateurs',
}, {
  name: 'usersCollab',
  title: 'Utilisateurs',
}, {
  name: 'offers',
  title: 'Offres',
}, {
  name: 'info',
  title: 'Informations',
}]

vi.mock('@kpmg/common', () => ({
  commonStore: defineStore('common', {
    state: () => ({
      user: {
        entities: {
          default: mockedEntity,
        },
      },
    }),
    getters: {
      isCollab: () => true,
      defaultEntity: () => mockedEntity,
    },
    actions: {
      fetchUserAccountPermissions: () => vi.fn(),
    },
  }),
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
let useRouteResponse = {}

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
  useRoute: () => (useRouteResponse),
}))

const createWrapper = (): VueWrapper<any> =>
  mount(Folder, {
    attachTo: document.body,
    global: {
      plugins: [pinia],
    },
  })

describe('dossier', () => {
  let wrapper: VueWrapper<any>

  beforeEach(async () => {
    vi.useFakeTimers()
    useRouteResponse = {}
    wrapper = createWrapper()

    await flushPromises()
  })

  it('displays correctly the table', () => {
    expect(wrapper.find('.folder-wrapper__default-entity').text()).toBe(
      mockedEntity.legalName,
    )
  })
  const PARAMS = [
    ['collab', 'tab-collab'],
    ['usersCollab', 'tab-usersCollab'],
    ['offers', 'tab-offers'],
    ['info', 'tab-info'],
  ]
  it.each(PARAMS)('should redirect when click on %s', (tabs, tabsName) => {
    document.getElementById(tabsName)?.click()
    expect(mockRouterPush).toHaveBeenCalledTimes(1)
    expect(mockRouterPush).toHaveBeenCalledWith({
      name: tabs,
    })
  })

  it('should redirect to userClient if user is a client', async () => {
    const mockedTabs: Tab[] = [{
      name: 'usersCollab',
      title: 'Utilisateurs',
    }, {
      name: 'usersClient',
      title: 'Utilisateurs',
    }]
    vi
      .spyOn(FolderHelper, 'getTabs')
      .mockReturnValue(mockedTabs)

    useRouteResponse = { name: 'usersCollab' }
    const store = commonStore()
    // @ts-expect-error: Getter is read only
    store.isCollab = false
    await flushPromises()

    wrapper = createWrapper()

    await document.getElementById('tab-usersCollab')?.click()

    expect(mockRouterPush).toHaveBeenCalledTimes(2)
    expect(mockRouterPush).toHaveBeenNthCalledWith(1, {
      name: 'usersCollab',
    })
    expect(mockRouterPush).toHaveBeenNthCalledWith(2, {
      name: 'usersClient',
      params: {
        id: mockedEntity.accountId,
      },
    })
  })
  it('should only display tabs to which the user has permission to access', async () => {
    const title = 'Information'
    const mockedTabs: Tab[] = [{
      name: 'info',
      title,
    }]
    vi
      .spyOn(FolderHelper, 'getTabs')
      .mockReturnValue(mockedTabs)
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
    vi
      .spyOn(FolderHelper, 'getTabs')
      .mockReturnValue([])

    await flushPromises()
    wrapper = createWrapper()
    const folderActionButton = wrapper.findComponent({ name: 'PButton' })

    expect(folderActionButton.exists()).toBeFalsy()
  })
})
