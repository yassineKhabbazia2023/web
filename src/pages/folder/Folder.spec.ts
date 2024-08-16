import { defineStore } from 'pinia'
import { beforeEach, describe, it, expect, vi, type SpyInstance } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { mockedEntity } from '../wallet/components/TableData/mockData'
import type { Tab } from './FolderTypes'
import * as FolderHelper from './FolderHelper'
import { amplitudeService } from '@kpmg/common'
import type { ComponentWrapper } from '@/common/types'
import Folder from '.'

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

const createWrapper = () =>
  mount(Folder, {
    attachTo: document.body,
    global: {
      plugins: [pinia],
      stubs: {
        RouterView: true,
      },
    },
  })

describe('folder', () => {
  let spyTrackAmplitude: SpyInstance
  let wrapper: ComponentWrapper<InstanceType<typeof Folder>>

  beforeEach(async () => {
    vi.useFakeTimers()
    useRouteResponse = {}
    spyTrackAmplitude = vi.spyOn(amplitudeService, 'track')

    wrapper = createWrapper()
    await flushPromises()
  })

  describe('display', () => {
    it('displays the home page if route equal to folder', async () => {
      useRouteResponse = { name: 'folder' }
      wrapper = createWrapper()

      await flushPromises()
      const homeComponent = wrapper.findComponent({ name: 'Home' })
      const folderTabsWrapper = wrapper.find(
        '[data-testid=folder-tabs-wrapper]',
      )

      expect(homeComponent.exists()).toBeTruthy()
      expect(folderTabsWrapper.exists()).toBeFalsy()
    })

    it('displays correctly the table', () => {
      expect(wrapper.find('.folder-wrapper__default-entity').text()).toBe(
        mockedEntity.legalName,
      )
    })
    it.each([
      ['collaborateurs', 'tab-collab'],
      ['utilisateurs', 'tab-users'],
      ['offres', 'tab-offers'],
      ['informations', 'tab-info'],
    ])('should track amplitude event when %s is clicked', (tabName, tabId) => {
      document.getElementById(tabId)?.click()

      expect(spyTrackAmplitude).toHaveBeenCalledOnce()
      expect(spyTrackAmplitude).toHaveBeenCalledWith('Feature Consulted', {
        feature_name: tabName,
      })
    })
    it.each([
      ['collab', 'tab-collab'],
      ['users', 'tab-users'],
      ['offers', 'tab-offers'],
      ['info', 'tab-info'],
    ])('should redirect when click on %s', (tabs, tabsName) => {
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
})
