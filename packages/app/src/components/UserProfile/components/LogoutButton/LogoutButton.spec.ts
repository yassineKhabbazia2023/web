import { shallowMount } from '@vue/test-utils'
import {
  amplitudeServiceMock,
  amplitudeServiceTrackMock,
  getStoreMock,
} from '@pulse/common/mocks'
import { LoginRouteName } from '@pulse/common/constants'
import { CurrentUserManager } from '@pulse/common/managers'
import { useUserStore } from '@pulse/common/stores'

import LogoutButton from './'

const userStoreMock = getStoreMock(useUserStore)

const mockRouterPush = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
}))

const createWrapper = () => shallowMount(LogoutButton)

vi.mock('@pulse/common', () => ({
  amplitudeService: amplitudeServiceMock,
}))

vi.mock('@pulse/common/managers')
const CurrentUserManagerLogoutMock = vi.mocked(CurrentUserManager.logout)

describe('logoutButton', () => {
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
      userStoreMock.isCollab = isCollab
      const wrapper = createWrapper()

      expect(mockRouterPush).not.toHaveBeenCalled()

      await wrapper.findComponent({ name: 'PButton' }).trigger('click')

      expect(mockRouterPush).toHaveBeenCalledOnce()
      expect(mockRouterPush).toHaveBeenCalledWith({ name: routeNameToRedirect })

      expect(CurrentUserManagerLogoutMock).toHaveBeenCalledOnce()
    },
  )
  it('should throw error and amplitude', async () => {
    const wrapper = createWrapper()
    CurrentUserManagerLogoutMock.mockRejectedValue('ERROR Logout')

    await wrapper.findComponent({ name: 'PButton' }).trigger('click')

    expect(amplitudeServiceTrackMock).toHaveBeenCalledOnce()
    expect(amplitudeServiceTrackMock).toHaveBeenCalledWith('Sign Out Completed', {
      sign_out_result: 'failed',
    })
  })
})
