import { useRouter } from 'vue-router'
import { useLogout } from './use-logout.composable'
import { RouteName } from '@pulse/common/enums'
import { getStoreMock } from '@pulse/common/mocks/vitest'
import { useLoadingStore, useUserStore } from '@pulse/common/stores'
import { AmplitudeService } from '@pulse/common/services/amplitude'
import { CurrentUserManager } from '@pulse/common/managers'

const mockPush = vi.hoisted(() => vi.fn())

describe('useLogout', () => {
  beforeEach(() => {
    // vue-router is spy-wrapped project-wide (doctrine: shared-hubs): arm the
    // shared spy per test instead of registering a local factory.
    vi.mocked(useRouter).mockReturnValue({ push: mockPush } as unknown as ReturnType<typeof useRouter>)
    vi.spyOn(CurrentUserManager, 'logout').mockResolvedValue(undefined)
    vi.spyOn(AmplitudeService, 'track').mockImplementation(() => undefined)
  })

  it('should call CurrentUserManager.logout on handleLogout', async () => {
    const { handleLogout } = useLogout()

    await handleLogout()

    expect(CurrentUserManager.logout).toHaveBeenCalled()
  })

  it('should start global loading on handleLogout', async () => {
    const loadingStoreMock = getStoreMock(useLoadingStore)
    const { handleLogout } = useLogout()

    await handleLogout()

    expect(loadingStoreMock.startGlobalLoading).toHaveBeenCalledWith({ immediate: true })
  })

  it('should track successful logout event', async () => {
    const { handleLogout } = useLogout()

    await handleLogout()

    expect(AmplitudeService.track).toHaveBeenCalledWith('Sign Out Completed', {
      sign_out_result: 'succeeded',
    })
  })

  it('should track failed logout event when logout throws', async () => {
    vi.mocked(CurrentUserManager.logout).mockRejectedValueOnce(new Error('Logout failed'))

    const { handleLogout } = useLogout()

    await handleLogout()

    expect(AmplitudeService.track).toHaveBeenCalledWith('Sign Out Completed', {
      sign_out_result: 'failed',
    })
  })

  it('should redirect to client login after logout for non-collab users', async () => {
    vi.useFakeTimers()
    const userStoreMock = getStoreMock(useUserStore)
    userStoreMock.user = { isCollab: false } as any

    const { handleLogout } = useLogout()

    await handleLogout()
    vi.advanceTimersByTime(250)

    expect(mockPush).toHaveBeenCalledWith({ name: RouteName.LOGIN_CLIENT })
    vi.useRealTimers()
  })

  it('should redirect to collab login after logout for collab users', async () => {
    vi.useFakeTimers()
    const userStoreMock = getStoreMock(useUserStore)
    userStoreMock.user = { isCollab: true } as any

    const { handleLogout } = useLogout()

    await handleLogout()
    vi.advanceTimersByTime(250)

    expect(mockPush).toHaveBeenCalledWith({ name: RouteName.LOGIN_COLLAB })
    vi.useRealTimers()
  })

  it('should stop global loading when router navigation fails', async () => {
    vi.useFakeTimers()
    mockPush.mockRejectedValueOnce(new Error('Navigation failed'))
    const loadingStoreMock = getStoreMock(useLoadingStore)

    const { handleLogout } = useLogout()

    await handleLogout()
    vi.advanceTimersByTime(250)
    await Promise.resolve()

    expect(loadingStoreMock.stopGlobalLoading).toHaveBeenCalled()
    vi.useRealTimers()
  })
})
