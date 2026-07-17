import { resetScrollPosition, scrollResetGuard } from './scroll-reset.guard'
import type { RouteLocationNormalized } from 'vue-router'

const createMockRoute = (): RouteLocationNormalized => ({
  name: 'test-route',
  path: '/test',
  fullPath: '/test',
  hash: '',
  query: {},
  params: {},
  matched: [],
  meta: {},
  redirectedFrom: undefined,
})

describe('resetScrollPosition', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should set scrollTop to 0 after timeout', () => {
    const container = document.createElement('div')
    Object.defineProperty(container, 'scrollTop', { value: 100, writable: true, configurable: true })

    resetScrollPosition(container)
    vi.runAllTimers()

    expect(container.scrollTop).toBe(0)
  })
})

describe('scrollResetGuard', () => {
  // doctrine shared-dom: the body is worker-shared — track the nodes this spec
  // adds and remove only those, never wipe document.body
  const appendedContainers: HTMLElement[] = []

  const appendScrollContainer = (className: string): HTMLDivElement => {
    const container = document.createElement('div')
    container.className = className
    Object.defineProperty(container, 'scrollTop', { value: 100, writable: true, configurable: true })
    document.body.appendChild(container)
    appendedContainers.push(container)
    return container
  }

  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    for (const container of appendedContainers) {
      container.remove()
    }
    appendedContainers.length = 0
  })

  it('should reset scroll with desktop container', () => {
    const container = appendScrollContainer('main-container')

    scrollResetGuard(createMockRoute(), createMockRoute())
    vi.runAllTimers()

    expect(container.scrollTop).toBe(0)
  })

  it('should reset scroll with mobile container', () => {
    const container = appendScrollContainer('mobile-home-layout__main')

    scrollResetGuard(createMockRoute(), createMockRoute())
    vi.runAllTimers()

    expect(container.scrollTop).toBe(0)
  })

  it('should not throw when no container is found', () => {
    expect(() => {
      scrollResetGuard(createMockRoute(), createMockRoute())
      vi.runAllTimers()
    }).not.toThrow()
  })
})
