import { type MockInstance } from 'vitest'
import { refreshPageWhenCurrentUserPermissionChange } from './permission.composable'
import { useUserStore } from '@pulse/common/stores'
import { getStoreMock } from '@pulse/common/mocks/vitest'

const userIdMock = 42
const otherUserIdMock = 999
const userStoreMock = getStoreMock(useUserStore)

describe('refreshPageWhenPermissionChange', () => {
  let reloadSpy: MockInstance
  beforeEach(() => {
    vi.useFakeTimers()
    // Never overwrite the shared window.location directly (doctrine: shared-dom):
    // stub it per test, restored by unstubAllGlobals in the afterEach below.
    vi.stubGlobal('location', {
      ...window.location,
      reload: vi.fn(),
    })
    userStoreMock.getUserId.mockReturnValue(userIdMock)
    reloadSpy = vi.spyOn(window.location, 'reload')
  })
  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('should reload the page if it\'s the current user', () => {
    refreshPageWhenCurrentUserPermissionChange(userIdMock)

    vi.advanceTimersByTime(500)
    expect(reloadSpy).toHaveBeenCalled()
  })

  it('should not reload the page if isn\'t the current user', () => {
    refreshPageWhenCurrentUserPermissionChange(otherUserIdMock)

    vi.advanceTimersByTime(500)
    expect(reloadSpy).not.toHaveBeenCalled()
  })
})
