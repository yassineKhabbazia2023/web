import { beforeEach, describe, it, expect, vi } from 'vitest'
import { VueWrapper, flushPromises, mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import Wallet from './'

const pinia = createTestingPinia()

const mockRouterPush = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockRouterPush
  })
}))

const createWrapper = (): VueWrapper<any> =>
  mount(Wallet, {
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
    expect(wrapper.find('h3').text()).toBe('Wallet')
  })
  const PARAMS = [
    ['deploiment', 'tab-deploiment'],
    ['bank', 'tab-bank'],
    ['admin', 'tab-admin']
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
})
