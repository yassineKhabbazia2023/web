import type { RouteLocationNormalized } from 'vue-router'
import type { MockInstance } from 'vitest'
import { SessionStorageService } from '@pulse/common/services/storage'
import { deepLinkGuard } from './deep-link.guard'

let consumeRedirectContextMock: MockInstance

describe('deepLinkGuard', () => {
  beforeEach(() => {
    // doctrine: static-classes — SessionStorageService is a static class, stubbed per test
    consumeRedirectContextMock = vi.spyOn(SessionStorageService, 'consumeRedirectContext').mockReturnValue(undefined)
  })

  it('should redirect to saved path when redirect context exists and differs from current path', () => {
    const savedPath = '/dossier/123?mode=notification'
    const toRoute = { fullPath: '/landing' } as RouteLocationNormalized
    consumeRedirectContextMock.mockReturnValue(savedPath)

    const result = deepLinkGuard(toRoute)

    expect(consumeRedirectContextMock).toHaveBeenCalled()
    expect(result).toBe(savedPath)
  })

  it('should not redirect when no redirect context exists', () => {
    const toRoute = { fullPath: '/landing' } as RouteLocationNormalized
    consumeRedirectContextMock.mockReturnValue(undefined)

    const result = deepLinkGuard(toRoute)

    expect(consumeRedirectContextMock).toHaveBeenCalled()
    expect(result).toBeUndefined()
  })

  it('should not redirect when saved path equals current path to avoid unnecessary navigation', () => {
    const currentPath = '/dossier/123'
    const toRoute = { fullPath: currentPath } as RouteLocationNormalized
    consumeRedirectContextMock.mockReturnValue(currentPath)

    const result = deepLinkGuard(toRoute)

    expect(consumeRedirectContextMock).toHaveBeenCalled()
    expect(result).toBeUndefined()
  })
})
