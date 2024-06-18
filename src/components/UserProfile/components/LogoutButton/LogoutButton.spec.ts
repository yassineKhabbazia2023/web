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
    getters: {
      isCollab: () => true,
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

  const isCollabToRouteNameToRedirect = [
    {
      isCollab: true,
      routeNameToRedirect: 'login',
    },
    {
      isCollab: false,
      routeNameToRedirect: 'loginClient',
    },
  ]

  it.each(isCollabToRouteNameToRedirect)(
    'can disconnect user when clicking on the logout button and redirect to $routeNameToRedirect',
    async ({ isCollab, routeNameToRedirect }) => {
      // @ts-expect-error: Getter is read only
      store.isCollab = isCollab

      expect(mockRouterPush).not.toHaveBeenCalled()

      await wrapper.find('button').trigger('click')

      expect(mockRouterPush).toHaveBeenCalledOnce()
      expect(mockRouterPush).toHaveBeenCalledWith({ name: routeNameToRedirect })

      expect(store.logout).toHaveBeenCalledOnce()
    },
  )
})
