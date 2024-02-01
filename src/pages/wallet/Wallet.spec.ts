import { beforeEach, describe, it, expect, vi } from 'vitest'
import { VueWrapper, flushPromises, mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { defineStore } from 'pinia'
import { commonStore } from '@kpmg/common'
import Wallet from './'

const pinia = createTestingPinia()

const mockRouterPush = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockRouterPush
  }),
  useRoute: () => ({})
}))

vi.mock('@kpmg/common', () => ({
  commonStore: defineStore('common', {
    getters: {
      isCollab: () => true
    }
  })
}))

const createWrapper = (): VueWrapper<any> =>
  mount(Wallet, {
    attachTo: document.body,
    global: {
      plugins: [pinia]
    }
  })
const collaboratorsTabs = [
  'Folders',
  'Mandate',
  'Validate demand',
  'Collaborators'
]
const clientTabs = [
  'All entities',
  'All users'
]

describe('dossier', () => {
  let wrapper: VueWrapper<any>

  beforeEach(async () => {
    wrapper = createWrapper()
    vi.useFakeTimers()

    await flushPromises()
  })

  it('displays correctly the table', () => {
    expect(wrapper.find('.wallet__title').text()).toBe('Wallet')
  })
  const PARAMS = [
    ['folders', 'tab-folders'],
    ['subscriptions', 'tab-subscriptions'],
    ['collaborators', 'tab-collaborators'],
    ['history', 'tab-history']
  ]
  it.each(PARAMS)(
    'should redirect when click on %s',
    (tabs, tabsName) => {
      document.getElementById(tabsName)?.click()
      expect(mockRouterPush).toHaveBeenCalledTimes(1)
      expect(mockRouterPush).toHaveBeenCalledWith({
        name: tabs
      })
    }
  )

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
