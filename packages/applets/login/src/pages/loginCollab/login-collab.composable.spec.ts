import { flushPromises } from '@vue/test-utils'
import { withSetup } from '@pulse/toolbox/utils/test'
import { RouteName } from '@pulse/common/enums'
import { getMockedUser } from '@pulse/common/mocks'
import { AmplitudeServiceMock } from '@pulse/common/mocks/vitest'
import { loggerMock } from '@pulse/toolbox/mocks'
import { MsalService } from '@pulse/common/services/msal'
import { CurrentUserManager } from '@pulse/common/managers'
import { CurrentUserService } from '@pulse/common/services/current-user'

import { useLoginCollab } from './login-collab.composable'

const mockRouterPush = vi.hoisted(() => vi.fn())
const userStoreMock = vi.hoisted(() => ({
  setUser: vi.fn(),
  getUserId: vi.fn(),
  getUserEmail: vi.fn(),
}))

vi.mock('@pulse/toolbox', () => ({ logger: loggerMock }))
vi.mock('@pulse/common/services/amplitude', () => ({
  AmplitudeService: AmplitudeServiceMock,
}))
vi.mock('@pulse/common/services/msal')
vi.mock('@pulse/common/services/current-user')
vi.mock('@pulse/common/managers')
vi.mock('@pulse/common/stores', () => ({
  useUserStore: () => userStoreMock,
}))
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mockRouterPush }),
}))

const userMock = getMockedUser()

describe('useLoginCollab', () => {
  it('should fetch MSAL token, persist it, fetch user, track amplitude and redirect to landing when auth succeeds', async () => {
    vi.mocked(MsalService.getMSALToken).mockResolvedValue('msal-token')
    vi.mocked(CurrentUserService.getCurrentUser).mockResolvedValue(userMock)
    userStoreMock.getUserId.mockReturnValue(userMock.id)
    userStoreMock.getUserEmail.mockReturnValue(userMock.email)

    withSetup(() => useLoginCollab())
    await flushPromises()

    expect(MsalService.getMSALToken).toHaveBeenCalledOnce()
    expect(CurrentUserManager.persistToken).toHaveBeenCalledExactlyOnceWith('msal-token')
    expect(CurrentUserService.getCurrentUser).toHaveBeenCalledOnce()
    expect(userStoreMock.setUser).toHaveBeenCalledExactlyOnceWith(userMock)
    expect(AmplitudeServiceMock.identifyCollaborator).toHaveBeenCalledOnce()
    expect(AmplitudeServiceMock.setUserId).toHaveBeenCalledExactlyOnceWith(userMock.id.toString())
    expect(AmplitudeServiceMock.setUserEmail).toHaveBeenCalledExactlyOnceWith(userMock.email)
    expect(AmplitudeServiceMock.track).toHaveBeenCalledExactlyOnceWith('Sign In Completed', {
      sign_in_method: 'SSO',
      sign_in_result: 'succeeded',
    })
    expect(mockRouterPush).toHaveBeenCalledWith({ name: RouteName.LANDING })
  })

  it('should persist empty token and not fetch user when MSAL returns undefined', async () => {
    vi.mocked(MsalService.getMSALToken).mockResolvedValue(undefined)

    withSetup(() => useLoginCollab())
    await flushPromises()

    expect(CurrentUserManager.persistToken).toHaveBeenCalledExactlyOnceWith('')
    expect(CurrentUserService.getCurrentUser).not.toHaveBeenCalled()
    expect(AmplitudeServiceMock.track).not.toHaveBeenCalled()
    expect(mockRouterPush).not.toHaveBeenCalled()
  })

  it('should roll back the persisted token and user store and skip amplitude/redirect when userId is invalid', async () => {
    vi.mocked(MsalService.getMSALToken).mockResolvedValue('msal-token')
    vi.mocked(CurrentUserService.getCurrentUser).mockResolvedValue(userMock)
    userStoreMock.getUserId.mockReturnValue(0)

    withSetup(() => useLoginCollab())
    await flushPromises()

    expect(userStoreMock.setUser).toHaveBeenCalledOnce()
    expect(AmplitudeServiceMock.identifyCollaborator).not.toHaveBeenCalled()
    expect(AmplitudeServiceMock.track).not.toHaveBeenCalled()
    expect(mockRouterPush).not.toHaveBeenCalled()
    expect(CurrentUserManager.persistToken).toHaveBeenCalledExactlyOnceWith('msal-token')
    expect(CurrentUserManager.clearUser).toHaveBeenCalledOnce()
    expect(loggerMock.error).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'useLoginCollab: invalid user id from getCurrentUser' }),
    )
  })

  it('should wipe any persisted token and log when MSAL throws', async () => {
    const errorMock = new Error('Auth error')
    vi.mocked(MsalService.getMSALToken).mockRejectedValue(errorMock)

    withSetup(() => useLoginCollab())
    await flushPromises()

    expect(mockRouterPush).not.toHaveBeenCalled()
    expect(loggerMock.error).toHaveBeenCalledWith(errorMock)
    expect(CurrentUserManager.clearUser).toHaveBeenCalledOnce()
  })

  it('should roll back the persisted token and user store when getCurrentUser throws after MSAL succeeds', async () => {
    vi.mocked(MsalService.getMSALToken).mockResolvedValue('msal-token')
    const fetchError = new Error('Network down')
    vi.mocked(CurrentUserService.getCurrentUser).mockRejectedValue(fetchError)

    withSetup(() => useLoginCollab())
    await flushPromises()

    expect(CurrentUserManager.persistToken).toHaveBeenCalledExactlyOnceWith('msal-token')
    expect(CurrentUserManager.clearUser).toHaveBeenCalledOnce()
    expect(mockRouterPush).not.toHaveBeenCalled()
    expect(loggerMock.error).toHaveBeenCalledWith(fetchError)
  })

  it('should trigger MSAL login redirect when handleLoginCollab is called', () => {
    const [result] = withSetup(() => useLoginCollab())

    result.handleLoginCollab()

    expect(MsalService.loginRedirect).toHaveBeenCalledOnce()
  })
})
