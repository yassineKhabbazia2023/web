import { defineStore } from 'pinia'
import { beforeEach, describe, it, expect, vi } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { commonStore } from '@kpmg/common'
import { mockedEntity } from '../wallet/components/TableData/mockData'
import Folder from './'

const pinia = createTestingPinia()
vi.mock('@kpmg/common', () => ({
  commonStore: defineStore('common', {
    state: () => ({
      user: {
        entities: {
          default: mockedEntity
        }
      }
    }),
    getters: {
      isCollab: () => true,
      defaultEntity: () => mockedEntity
    }
  })
}))

const mockRouterPush = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockRouterPush
  }),
  useRoute: () => ({})
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
    expect(wrapper.find('.title').text()).toBe(mockedEntity.name)
  })
  const PARAMS = [
    ['collab', 'tab-collab'],
    ['usersCollab', 'tab-usersCollab'],
    ['offers', 'tab-offers'],
    ['info', 'tab-info']
  ]
  it.each(PARAMS)(
    'should redirect when click on %s',
    (tabs, tabsName) => {
      document.getElementById(tabsName)?.click()
      expect(mockRouterPush).toHaveBeenCalledTimes(1)
      expect(mockRouterPush).toHaveBeenCalledWith({
        name: tabs,
        params: {
          name: mockedEntity.name
        }
      })
    }
  )
  it('should display the button label when the user is a client', () => {
    const store = commonStore()
    // @ts-expect-error: Getter is read only
    store.isCollab = false
    const btnAction = wrapper.findComponent('[data-testid=btn-action]') as VueWrapper
    expect(btnAction.text()).toBe('Delegate this case')
  })
})
