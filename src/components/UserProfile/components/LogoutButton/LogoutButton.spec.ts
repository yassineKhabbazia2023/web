import { defineStore, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { commonStore as useStore } from '@kpmg/common'
import { createTestingPinia } from '@pinia/testing'
import LogoutButton from './'

const pinia = createTestingPinia()
const store = useStore()
const mockRouterPush = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
}))

vi.mock('@kpmg/common', () => ({
  commonStore: defineStore('common', {
    actions: {
      logout: vi.fn(),
    },
  }),
}))

const createWrapper = (): VueWrapper<any> =>
  mount(LogoutButton, {
    global: {
      plugins: [pinia],
    },
  })

let wrapper: VueWrapper<any>

describe('logoutButton', () => {
  beforeEach(() => {
    setActivePinia(pinia)
    wrapper = createWrapper()
  })

  it('should disconnect user when clicking on the logout button', async () => {
    expect(mockRouterPush).not.toHaveBeenCalled()

    await wrapper.find('button').trigger('click')

    expect(mockRouterPush).toHaveBeenCalledOnce()
    expect(mockRouterPush).toHaveBeenCalledWith({ name: 'login' })
    expect(store.logout).toHaveBeenCalledOnce()
  })
})
