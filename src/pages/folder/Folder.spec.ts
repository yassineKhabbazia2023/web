import { defineStore } from 'pinia'
import { beforeEach, describe, it, expect, vi, type SpyInstance } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { mockedEntity } from '../wallet/components/TableData/mockData'
import type { Tab } from './FolderTypes'
import * as FolderHelper from './FolderHelper'
import Folder from './'
import { amplitudeService } from '@kpmg/common'

const pinia = createTestingPinia()

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
  amplitudeService: {
    track: vi.fn(),
  },
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
  useRoute: () => useRouteResponse,
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
  let spyTrackAmplitude: SpyInstance

  beforeEach(async () => {
    vi.useFakeTimers()
    useRouteResponse = {}
    spyTrackAmplitude = vi.spyOn(amplitudeService, 'track')
    wrapper = createWrapper()

    await flushPromises()
  })

  it('displays correctly the table', () => {
    expect(wrapper.find('.folder-wrapper__default-entity').text()).toBe(
      mockedEntity.legalName,
    )
  })
  const Tabs = [
    ['collaborateurs', 'tab-collab'],
    ['utilisateurs', 'tab-users'],
    ['offres', 'tab-offers'],
    ['informations', 'tab-info'],
  ]
  it.each(Tabs)('should track amplitude event when %s is clicked', (tabName, tabId) => {
    document.getElementById(tabId)?.click()

    expect(spyTrackAmplitude).toHaveBeenCalledOnce()
    expect(spyTrackAmplitude).toHaveBeenCalledWith('Feature Consulted', {
      feature_name: tabName,
    })
  })
  const PARAMS = [
    ['collab', 'tab-collab'],
    ['users', 'tab-users'],
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
