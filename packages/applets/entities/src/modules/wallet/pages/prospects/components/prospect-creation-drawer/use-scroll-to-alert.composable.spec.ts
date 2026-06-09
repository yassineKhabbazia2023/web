import { ref } from 'vue'
import { withSetup } from '@pulse/toolbox/utils/test'
import { useScrollToAlert } from './use-scroll-to-alert.composable'

const CONTAINER_TOP = 100
const CONTAINER_HEIGHT = 400
const ALERT_HEIGHT = 60
const SCROLL_BOTTOM_PADDING_PX = 16

function setScrollTop(element: HTMLElement, value: number): void {
  Object.defineProperty(element, 'scrollTop', {
    configurable: true,
    writable: true,
    value,
  })
}

function stubBoundingRect(element: HTMLElement, rect: Partial<DOMRect>): void {
  vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    toJSON: () => ({}),
    ...rect,
  } as DOMRect)
}

function createScrollableContainer(): HTMLElement {
  const container = document.createElement('div')
  container.setAttribute('style', 'overflow-y: auto')
  Object.defineProperty(container, 'clientHeight', {
    configurable: true,
    value: CONTAINER_HEIGHT,
  })
  setScrollTop(container, 0)
  // JSDOM does not implement scrollTo. useScroll calls it under the hood, so
  // we route it back to scrollTop so assertions reflect the requested position.
  container.scrollTo = ((options: ScrollToOptions | number, y?: number) => {
    const top = typeof options === 'number' ? y ?? 0 : (options.top ?? 0)
    setScrollTop(container, top)
  }) as HTMLElement['scrollTo']
  stubBoundingRect(container, {
    top: CONTAINER_TOP,
    bottom: CONTAINER_TOP + CONTAINER_HEIGHT,
    height: CONTAINER_HEIGHT,
  })
  document.body.appendChild(container)
  return container
}

function createAlertElement(viewportTop: number): HTMLElement {
  const alert = document.createElement('div')
  stubBoundingRect(alert, {
    top: viewportTop,
    bottom: viewportTop + ALERT_HEIGHT,
    height: ALERT_HEIGHT,
  })
  return alert
}

describe('useScrollToAlert', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    vi.spyOn(globalThis, 'getComputedStyle').mockImplementation((element) => {
      const overflowY = (element as HTMLElement).getAttribute('style')?.includes('overflow-y: auto') === true
        ? 'auto'
        : 'visible'
      return { overflowY } as CSSStyleDeclaration
    })
  })

  it('scrolls down when the alert is below the visible viewport', async () => {
    const container = createScrollableContainer()
    const overflowDistance = 100
    const alertViewportTop = CONTAINER_TOP + CONTAINER_HEIGHT + overflowDistance - ALERT_HEIGHT
    const alert = createAlertElement(alertViewportTop)
    container.appendChild(alert)
    const alertRef = ref<HTMLElement | null>(alert)

    const [{ scrollToAlert }, app] = withSetup(() => useScrollToAlert(alertRef))
    await scrollToAlert()

    expect(container.scrollTop).toBe(overflowDistance + SCROLL_BOTTOM_PADDING_PX)

    app.unmount()
  })

  it('scrolls up when the alert is above the visible viewport', async () => {
    const container = createScrollableContainer()
    const aboveDistance = 50
    const alertViewportTop = CONTAINER_TOP - aboveDistance
    const alert = createAlertElement(alertViewportTop)
    container.appendChild(alert)
    setScrollTop(container, 200)
    const alertRef = ref<HTMLElement | null>(alert)

    const [{ scrollToAlert }, app] = withSetup(() => useScrollToAlert(alertRef))
    await scrollToAlert()

    expect(container.scrollTop).toBe(200 - aboveDistance - SCROLL_BOTTOM_PADDING_PX)

    app.unmount()
  })

  it('leaves scroll untouched when the alert is already visible', async () => {
    const container = createScrollableContainer()
    const alert = createAlertElement(CONTAINER_TOP + 100)
    container.appendChild(alert)
    setScrollTop(container, 0)
    const alertRef = ref<HTMLElement | null>(alert)

    const [{ scrollToAlert }, app] = withSetup(() => useScrollToAlert(alertRef))
    await scrollToAlert()

    expect(container.scrollTop).toBe(0)

    app.unmount()
  })

  it('rescrolls on every invocation even when the alert position is unchanged', async () => {
    const container = createScrollableContainer()
    const overflowDistance = 100
    const alertViewportTop = CONTAINER_TOP + CONTAINER_HEIGHT + overflowDistance - ALERT_HEIGHT
    const alert = createAlertElement(alertViewportTop)
    container.appendChild(alert)
    const alertRef = ref<HTMLElement | null>(alert)

    const [{ scrollToAlert }, app] = withSetup(() => useScrollToAlert(alertRef))

    await scrollToAlert()
    expect(container.scrollTop).toBe(overflowDistance + SCROLL_BOTTOM_PADDING_PX)

    // Simulate the user manually scrolling back up after the first scroll.
    setScrollTop(container, 0)

    await scrollToAlert()
    expect(container.scrollTop).toBe(overflowDistance + SCROLL_BOTTOM_PADDING_PX)

    app.unmount()
  })

  it('is a no-op when no scrollable ancestor is found', async () => {
    const orphanAlert = createAlertElement(50)
    document.body.appendChild(orphanAlert)
    const alertRef = ref<HTMLElement | null>(orphanAlert)

    const [{ scrollToAlert }, app] = withSetup(() => useScrollToAlert(alertRef))

    await expect(scrollToAlert()).resolves.toBeUndefined()

    app.unmount()
  })

  it('is a no-op when the alert ref is null', async () => {
    const alertRef = ref<HTMLElement | null>(null)

    const [{ scrollToAlert }, app] = withSetup(() => useScrollToAlert(alertRef))

    await expect(scrollToAlert()).resolves.toBeUndefined()

    app.unmount()
  })
})
