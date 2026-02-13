import { useLogout } from './use-logout.composable'
import { RouteName } from '@pulse/common/enums'
import { getStoreMock } from '@pulse/common/mocks/vitest'
import { useUserStore } from '@pulse/common/stores'
import { AmplitudeService } from '@pulse/common/services/amplitude'
import { CurrentUserManager } from '@pulse/common/managers'

const mockPush = vi.hoisted(() => vi.fn())

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

vi.mock('@pulse/common/services/amplitude')
vi.mock('@pulse/common/managers', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@pulse/common/managers')>()
  return {
    ...actual,
    CurrentUserManager: {
      logout: vi.fn(),
    },
  }
})

describe('useLogout', () => {
  it('should call CurrentUserManager.logout on handleLogout', async () => {
    const { handleLogout } = useLogout()

    await handleLogout()

    expect(CurrentUserManager.logout).toHaveBeenCalled()
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
})
