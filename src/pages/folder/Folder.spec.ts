import { defineStore } from 'pinia'
import { beforeEach, describe, it, expect, vi } from 'vitest'
import { VueWrapper, flushPromises, mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import Folder from './'

vi.mock('@kpmg/common', () => ({
  commonStore: defineStore('common', {
    state: () => ({
      user: {
        entities: {
          default: {
            name: 'nameEntity'
          }
        }
      }
    })
  })
}))
const pinia = createTestingPinia()

const mockRouterPush = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockRouterPush
  }),
  useRoute: () => ({
    name: 'users'
  })
}))

const createWrapper = (): VueWrapper<any> =>
  mount(Folder, {
    attachTo: document.body,
    global: {
      plugins: [pinia]
    }
  })

describe('dossier', () => {
  let wrapper: VueWrapper<any>

  beforeEach(async () => {
    vi.useFakeTimers()
    wrapper = createWrapper()

    await flushPromises()
  })

  it('displays correctly the table', () => {
    expect(wrapper.find('.title').text()).toBe('nameEntity')
  })
  const PARAMS = [
    ['collab', 'tab-collab'],
    ['users', 'tab-users'],
    ['offers', 'tab-offers'],
    ['info', 'tab-info'],
    ['history', 'tab-history']
  ]
  it.each(PARAMS)(
    'should redirect when click on %s',
    (tabs, tabsName) => {
      document.getElementById(tabsName)?.click()
      expect(mockRouterPush).toHaveBeenCalledTimes(1)
      expect(mockRouterPush).toHaveBeenCalledWith({
        name: tabs,
        params: {
          name: 'nameEntity'
        }
      })
    }
  )
})
