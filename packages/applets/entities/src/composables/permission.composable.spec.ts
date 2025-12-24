import { type MockInstance } from 'vitest'
import { refreshPageWhenCurrentUserPermissionChange } from './permission.composable'
import { useUserStore } from '@pulse/common/stores'
import { getStoreMock } from '@pulse/common/mocks/vitest'

const userIdMock = 42
const otherUserIdMock = 999
const userStoreMock = getStoreMock(useUserStore)
Object.defineProperty(window, 'location', {
  value: {
    ...window.location,
    reload: vi.fn(),
  },
  writable: true,
})

describe('refreshPageWhenPermissionChange', () => {
  let reloadSpy: MockInstance
  beforeEach(() => {
    vi.useFakeTimers()
    userStoreMock.getUserId.mockReturnValue(userIdMock)
    reloadSpy = vi.spyOn(window.location, 'reload')
  })
  afterEach(() => {
    vi.useRealTimers()
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
