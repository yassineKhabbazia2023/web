import type { RouteLocationNormalized } from 'vue-router'
import { SessionStorageService } from '@pulse/common/services/storage'
import { deepLinkGuard } from './deep-link.guard'

vi.mock('@pulse/common/services/storage', () => ({
  SessionStorageService: {
    consumeRedirectContext: vi.fn(),
  },
}))

describe('deepLinkGuard', () => {
  const nextMock = vi.fn()
  const fromRoute = {} as RouteLocationNormalized

  it('should redirect to saved path when redirect context exists and differs from current path', () => {
    const savedPath = '/dossier/123?mode=notification'
    const toRoute = { fullPath: '/landing' } as RouteLocationNormalized
    vi.mocked(SessionStorageService.consumeRedirectContext).mockReturnValue(savedPath)

    deepLinkGuard(toRoute, fromRoute, nextMock)

    expect(SessionStorageService.consumeRedirectContext).toHaveBeenCalled()
    expect(nextMock).toHaveBeenCalledWith(savedPath)
  })

  it('should not redirect when no redirect context exists', () => {
    const toRoute = { fullPath: '/landing' } as RouteLocationNormalized
    vi.mocked(SessionStorageService.consumeRedirectContext).mockReturnValue(undefined)

    deepLinkGuard(toRoute, fromRoute, nextMock)

    expect(SessionStorageService.consumeRedirectContext).toHaveBeenCalled()
    expect(nextMock).toHaveBeenCalledWith()
  })

  it('should not redirect when saved path equals current path to avoid unnecessary navigation', () => {
    const currentPath = '/dossier/123'
    const toRoute = { fullPath: currentPath } as RouteLocationNormalized
    vi.mocked(SessionStorageService.consumeRedirectContext).mockReturnValue(currentPath)

    deepLinkGuard(toRoute, fromRoute, nextMock)

    expect(SessionStorageService.consumeRedirectContext).toHaveBeenCalled()
    expect(nextMock).toHaveBeenCalledWith()
  })
})
