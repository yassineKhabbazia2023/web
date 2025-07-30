import { describe, it, vi, expect } from 'vitest'
import { refreshPageWhenCurrentUserPermissionChange } from './permission.composable'

vi.mock('@pulse/common/stores', () => ({
  useUserStore: () => ({
    getUserId: () => 42,
  }),
}))

describe('refreshPageWhenPermissionChange', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      value: {
        ...window.location,
        reload: vi.fn(),
      },
      writable: true,
    })
  })

  it('should reload the page if it\'s the current user', () => {
    const reloadSpy = vi.spyOn(window.location, 'reload').mockImplementation(() => {})

    refreshPageWhenCurrentUserPermissionChange(42)

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        expect(reloadSpy).toHaveBeenCalled()
        resolve()
      }, 50)
    })
  })

  it('should not reload the page if isn\'t the current user', () => {
    const reloadSpy = vi.spyOn(window.location, 'reload').mockImplementation(() => {})

    refreshPageWhenCurrentUserPermissionChange(999)

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        expect(reloadSpy).not.toHaveBeenCalled()
        resolve()
      }, 50)
    })
  })
})
