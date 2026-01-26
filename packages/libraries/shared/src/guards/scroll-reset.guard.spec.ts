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
  beforeEach(() => {
    vi.useFakeTimers()
    document.body.innerHTML = ''
  })

  afterEach(() => {
    vi.useRealTimers()
    document.body.innerHTML = ''
  })

  it('should reset scroll with desktop container', () => {
    const container = document.createElement('div')
    container.className = 'main-container'
    Object.defineProperty(container, 'scrollTop', { value: 100, writable: true, configurable: true })
    document.body.appendChild(container)

    scrollResetGuard(createMockRoute(), createMockRoute())
    vi.runAllTimers()

    expect(container.scrollTop).toBe(0)
  })

  it('should reset scroll with mobile container', () => {
    const container = document.createElement('div')
    container.className = 'mobile-home-layout__main'
    Object.defineProperty(container, 'scrollTop', { value: 100, writable: true, configurable: true })
    document.body.appendChild(container)

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
