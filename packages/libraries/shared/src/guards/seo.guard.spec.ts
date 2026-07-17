import { HTMLService } from '@pulse/common/services/html'
import { HTML_TITLE_META } from '@pulse/common/constants'
import { seoGuard } from './seo.guard'
import type { RouteLocationNormalized } from 'vue-router'
import type { MockInstance } from 'vitest'

const createMockRoute = (meta: Record<string, any> = {}): RouteLocationNormalized => {
  return {
    name: 'test-route',
    path: '/test',
    fullPath: '/test',
    hash: '',
    query: {},
    params: {},
    matched: [],
    meta,
    redirectedFrom: undefined,
  }
}

let setDocumentTitleMock: MockInstance
let resetDocumentTitleMock: MockInstance

describe('seoGuard', () => {
  beforeEach(() => {
    // doctrine: static-classes — HTMLService is a static class, stubbed per test
    setDocumentTitleMock = vi.spyOn(HTMLService, 'setDocumentTitle').mockReturnValue()
    resetDocumentTitleMock = vi.spyOn(HTMLService, 'resetDocumentTitle').mockReturnValue()
  })

  it('should set document title when route has HTML_TITLE_META', () => {
    const title = 'Test Page Title'
    const toRoute = createMockRoute({
      [HTML_TITLE_META]: title,
    })
    const fromRoute = createMockRoute()

    seoGuard(toRoute, fromRoute)

    expect(setDocumentTitleMock).toHaveBeenCalledWith(title)
    expect(resetDocumentTitleMock).not.toHaveBeenCalled()
  })

  it('should reset document title when route has no HTML_TITLE_META', () => {
    const toRoute = createMockRoute({})
    const fromRoute = createMockRoute()

    seoGuard(toRoute, fromRoute)

    expect(resetDocumentTitleMock).toHaveBeenCalledOnce()
    expect(setDocumentTitleMock).not.toHaveBeenCalled()
  })

  it('should reset document title when route meta is undefined', () => {
    const toRoute = createMockRoute()
    toRoute.meta = undefined as any
    const fromRoute = createMockRoute()

    seoGuard(toRoute, fromRoute)

    expect(resetDocumentTitleMock).toHaveBeenCalledOnce()
    expect(setDocumentTitleMock).not.toHaveBeenCalled()
  })

  it('should reset document title when HTML_TITLE_META is empty string', () => {
    const toRoute = createMockRoute({
      [HTML_TITLE_META]: '',
    })
    const fromRoute = createMockRoute()

    seoGuard(toRoute, fromRoute)

    expect(resetDocumentTitleMock).toHaveBeenCalledOnce()
    expect(setDocumentTitleMock).not.toHaveBeenCalled()
  })

  it('should reset document title when HTML_TITLE_META is undefined', () => {
    const toRoute = createMockRoute({
      [HTML_TITLE_META]: undefined,
    })
    const fromRoute = createMockRoute()

    seoGuard(toRoute, fromRoute)

    expect(resetDocumentTitleMock).toHaveBeenCalledOnce()
    expect(setDocumentTitleMock).not.toHaveBeenCalled()
  })
})
