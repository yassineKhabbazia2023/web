import { defineStore, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { amplitudeService, commonStore, commonStore as useStore } from '@pulse/common'
import { createTestingPinia } from '@pinia/testing'
import { LoginRouteName } from '@pulse/common/constants'
import LogoutButton from './'

const pinia = createTestingPinia()
const store = useStore()
const mockRouterPush = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
}))

vi.mock('@pulse/common', () => ({
  commonStore: defineStore('common', {
    actions: {
      logout: vi.fn(),
    },
    getters: {
      isCollab: () => true,
    },
  }),
  amplitudeService: {
    track: vi.fn(),
  },
  dataProvider: () => {
    return {
      fetchUserData: vi.fn(),
    }
  },
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
      routeNameToRedirect: LoginRouteName.LOGIN_COLLAB,
    },
    {
      isCollab: false,
      routeNameToRedirect: LoginRouteName.LOGIN_CLIENT,
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
  it('should throw eror and amplitude', async () => {
    const store = commonStore()
    const spyStoreLogoutAction = vi.spyOn(store, 'logout')
    const spyTrackAmplitude = vi.spyOn(amplitudeService, 'track')
    spyStoreLogoutAction.mockRejectedValue('ERROR Logout')

    await wrapper.find('button').trigger('click')

    expect(spyTrackAmplitude).toHaveBeenCalledOnce()
    expect(spyTrackAmplitude).toHaveBeenCalledWith('Sign Out Completed', {
      sign_out_result: 'failed',
    })
  })
})
