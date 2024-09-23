import { beforeEach, describe, it, expect, vi, type MockInstance } from 'vitest'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { defineStore } from 'pinia'
import { amplitudeService, commonStore } from '@pulse/Common'
import { PERMISSION_CODES } from '@entities/constants'
import Wallet from './'

const pinia = createTestingPinia()

const mockRouterPush = vi.fn()
const mockHasPermission = vi.fn((_code: string) => true)

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
  useRoute: () => ({}),
}))

vi.mock('@pulse/Common', () => ({
  commonStore: defineStore('common', {
    state: () => ({
      user: {
        firstName: 'Jack',
      },
    }),
    getters: {
      isCollab: () => true,
    },
  }),
  userPermissions: () => ({
    hasPermission: mockHasPermission,
  }),
  amplitudeService: {
    track: vi.fn(),
  },
}))

const createWrapper = (): VueWrapper<any> =>
  mount(Wallet, {
    attachTo: document.body,
    global: {
      plugins: [pinia],
    },
  })
const collaboratorsTabs = ['Wallet', 'Mandate', 'Upload a BI report', 'MOD requests', 'Collaborators']
const clientTabs = ['All entities', 'All users']

describe('dossier', () => {
  let wrapper: VueWrapper<any>
  let spyTrackAmplitude: MockInstance

  beforeEach(async () => {
    spyTrackAmplitude = vi.spyOn(amplitudeService, 'track')
    wrapper = createWrapper()
    vi.useFakeTimers()

    await flushPromises()
  })

  it('displays correctly the table', () => {
    expect(wrapper.find('.wallet__title').text()).toBe('Hello Jack')
  })
  const Tabs = [
    ['wallet', 'tab-folders'],
    ['mod requests', 'tab-subscriptions'],
    ['collaborators', 'tab-collaborators'],
    ['mandate', 'tab-folderMandats'],
    ['applications', 'tab-folderLauncher'],
  ]
  it.each(Tabs)('should track amplitude event when %s is clicked', (tabName, tabId) => {
    document.getElementById(tabId)?.click()

    expect(spyTrackAmplitude).toHaveBeenCalledOnce()
    expect(spyTrackAmplitude).toHaveBeenCalledWith('Feature Consulted', {
      feature_name: tabName,
    })
  })
  const PARAMS = [
    ['folders', 'tab-folders'],
    ['subscriptions', 'tab-subscriptions'],
    ['collaborators', 'tab-collaborators'],
    ['folderMandats', 'tab-folderMandats'],
    ['folderLauncher', 'tab-folderLauncher'],
  ]
  it.each(PARAMS)('should redirect when click on %s', (tabs, tabsName) => {
    document.getElementById(tabsName)?.click()
    expect(mockRouterPush).toHaveBeenCalledTimes(1)
    expect(mockRouterPush).toHaveBeenCalledWith({
      name: tabs,
    })
  })

  it('should not display Launcher when user does not have authorization', async () => {
    mockHasPermission.mockImplementation((code: string) =>
      ![PERMISSION_CODES.LAUNCHER].includes(code),
    )
    wrapper = createWrapper()

    await flushPromises()

    const element = wrapper.find('#tab-folderLauncher')
    expect(element.exists()).toBeFalsy()
  })

  it('should only display tabs to which the user has permission to access', () => {
    mockHasPermission.mockImplementation((code: string) =>
      [PERMISSION_CODES.COLLABORATORS].includes(code),
    )
    wrapper = createWrapper()
    const collaboratorsTabsAccess = ['Wallet', 'Collaborators']
    const tabsPane = wrapper.findAllComponents({ name: 'PTabPane' })

    collaboratorsTabsAccess.forEach((tabPane, index) => {
      const label = tabsPane.at(index)?.props('pLabel')
      expect(label).toBe(tabPane)
    })
  })

  it('should display the correct tab when user is collab', () => {
    const tabsPane = wrapper.findAllComponents({ name: 'ElTabPane' })
    collaboratorsTabs.forEach((tabPane, index) => {
      const label = tabsPane.at(index)?.props('label')
      expect(label).toBe(tabPane)
    })
  })

  it('should display the correct tab when user is client', () => {
    const store = commonStore()
    // @ts-expect-error: Getter is read only
    store.isCollab = false
    wrapper = createWrapper()
    const tabsPane = wrapper.findAllComponents({ name: 'ElTabPane' })
    clientTabs.forEach((tabPane, index) => {
      const label = tabsPane.at(index)?.props('label')
      expect(label).toBe(tabPane)
    })
  })
})
