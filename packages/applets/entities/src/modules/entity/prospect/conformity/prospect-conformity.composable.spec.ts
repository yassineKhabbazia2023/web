import { ref } from 'vue'
import { withSetup } from '@pulse/toolbox/utils/test'
import { useProspectConformity } from './prospect-conformity.composable'

const KNOWN_STEP_ID = 'commercial-proposal'
const OTHER_STEP_ID = 'supporting-docs'
const FIRST_STEP_ID = 'beneficiaries'
const LAST_STEP_ID = 'mission-letter'

let observerInstances: MockIntersectionObserver[] = []

class MockIntersectionObserver {
  callback: IntersectionObserverCallback
  options?: IntersectionObserverInit
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
  takeRecords = vi.fn().mockReturnValue([])

  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    this.callback = callback
    this.options = options
    observerInstances.push(this)
  }

  trigger(entries: Array<Partial<IntersectionObserverEntry> & { target: Element }>): void {
    this.callback(entries as IntersectionObserverEntry[], this as unknown as IntersectionObserver)
  }
}

function setHash(hash: string): void {
  window.location.hash = hash
}

function createScrollContainer(metrics?: { scrollTop?: number, clientHeight?: number, scrollHeight?: number }) {
  const element = document.createElement('div')
  document.body.appendChild(element)
  if (metrics !== undefined) {
    Object.defineProperty(element, 'scrollTop', { configurable: true, value: metrics.scrollTop ?? 0, writable: true })
    Object.defineProperty(element, 'clientHeight', { configurable: true, value: metrics.clientHeight ?? 0 })
    Object.defineProperty(element, 'scrollHeight', { configurable: true, value: metrics.scrollHeight ?? 0 })
  }
  return ref<HTMLElement | null>(element)
}

function createStepElement(stepId: string, top: number): HTMLElement {
  const element = document.createElement('div')
  element.id = `step-${stepId}`
  vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
    top,
    bottom: top + 200,
    left: 0,
    right: 100,
    width: 100,
    height: 200,
    x: 0,
    y: top,
    toJSON: () => ({}),
  })
  element.scrollIntoView = vi.fn()
  document.body.appendChild(element)
  return element
}

function buildEntry(target: Element, isIntersecting: boolean, top: number): Partial<IntersectionObserverEntry> & { target: Element } {
  return {
    target,
    isIntersecting,
    boundingClientRect: { top, bottom: top + 200, left: 0, right: 100, width: 100, height: 200, x: 0, y: top, toJSON: () => ({}) } as DOMRectReadOnly,
    intersectionRatio: isIntersecting ? 1 : 0,
    intersectionRect: {} as DOMRectReadOnly,
    rootBounds: null,
    time: 0,
  }
}

describe('useProspectConformity', () => {
  beforeEach(() => {
    setHash('')
    document.body.innerHTML = ''
    observerInstances = []
    globalThis.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('initializes selectedId with the first step when location hash is empty', () => {
    const [{ selectedId }] = withSetup(() => useProspectConformity(createScrollContainer()))

    expect(selectedId.value).toBe(FIRST_STEP_ID)
  })

  it('initializes selectedId from the URL hash when it matches a known step', () => {
    setHash(`#${KNOWN_STEP_ID}`)

    const [{ selectedId }] = withSetup(() => useProspectConformity(createScrollContainer()))

    expect(selectedId.value).toBe(KNOWN_STEP_ID)
  })

  it('falls back to the first step when the URL hash is unknown', () => {
    setHash('#non-existing-step')

    const [{ selectedId }] = withSetup(() => useProspectConformity(createScrollContainer()))

    expect(selectedId.value).toBe(FIRST_STEP_ID)
  })

  it('updates selectedId, location hash and scrolls when onStepClick is called', () => {
    const target = createStepElement(KNOWN_STEP_ID, 0)

    const [{ selectedId, onStepClick }] = withSetup(() => useProspectConformity(createScrollContainer()))
    onStepClick(KNOWN_STEP_ID)

    expect(selectedId.value).toBe(KNOWN_STEP_ID)
    expect(window.location.hash).toBe(`#${KNOWN_STEP_ID}`)
    expect(target.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' })
  })

  it('does not throw when onStepClick targets a step without a matching DOM element', () => {
    const [{ selectedId, onStepClick }] = withSetup(() => useProspectConformity(createScrollContainer()))

    expect(() => onStepClick(KNOWN_STEP_ID)).not.toThrow()
    expect(selectedId.value).toBe(KNOWN_STEP_ID)
  })

  it('scrolls to the step matching the initial hash once the DOM is ready', async () => {
    setHash(`#${KNOWN_STEP_ID}`)
    const target = createStepElement(KNOWN_STEP_ID, 0)
    const rafSpy = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(0)
      return 0
    })

    withSetup(() => useProspectConformity(createScrollContainer()))
    await vi.runAllTimersAsync()

    expect(target.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' })
    rafSpy.mockRestore()
  })

  it('selects the topmost intersecting step when the user scrolls', async () => {
    const firstElement = createStepElement(FIRST_STEP_ID, 0)
    const secondElement = createStepElement(KNOWN_STEP_ID, 100)
    const thirdElement = createStepElement(OTHER_STEP_ID, 500)
    const container = createScrollContainer()

    const [{ selectedId }] = withSetup(() => useProspectConformity(container))
    await vi.runAllTimersAsync()
    const observer = observerInstances[0]

    observer.trigger([
      buildEntry(firstElement, false, -300),
      buildEntry(secondElement, true, 100),
      buildEntry(thirdElement, true, 320),
    ])

    expect(selectedId.value).toBe(KNOWN_STEP_ID)
    expect(window.location.hash).toBe(`#${KNOWN_STEP_ID}`)
  })

  it('ignores intersection updates during the scroll lock that follows a click', async () => {
    const targetElement = createStepElement(KNOWN_STEP_ID, 0)
    const otherElement = createStepElement(OTHER_STEP_ID, 200)
    const container = createScrollContainer()

    const [{ selectedId, onStepClick }] = withSetup(() => useProspectConformity(container))
    await vi.runAllTimersAsync()
    const observer = observerInstances[0]

    onStepClick(KNOWN_STEP_ID)
    observer.trigger([buildEntry(otherElement, true, 0)])

    expect(selectedId.value).toBe(KNOWN_STEP_ID)

    await vi.advanceTimersByTimeAsync(1000)
    observer.trigger([buildEntry(otherElement, true, 0)])

    expect(selectedId.value).toBe(OTHER_STEP_ID)
    expect(targetElement.scrollIntoView).toHaveBeenCalled()
  })

  it('preserves history.state when updating the URL on click or on scroll', async () => {
    const routerState = { key: 'router-key', position: 0 }
    window.history.replaceState(routerState, '', window.location.pathname)
    const targetElement = createStepElement(KNOWN_STEP_ID, 0)
    const otherElement = createStepElement(OTHER_STEP_ID, 100)
    const container = createScrollContainer()

    const [{ onStepClick }] = withSetup(() => useProspectConformity(container))
    await vi.runAllTimersAsync()
    const observer = observerInstances[0]

    onStepClick(KNOWN_STEP_ID)
    expect(window.history.state).toEqual(routerState)
    expect(window.location.hash).toBe(`#${KNOWN_STEP_ID}`)

    await vi.advanceTimersByTimeAsync(1000)
    observer.trigger([buildEntry(otherElement, true, 0)])
    expect(window.history.state).toEqual(routerState)
    expect(window.location.hash).toBe(`#${OTHER_STEP_ID}`)
    expect(targetElement.scrollIntoView).toHaveBeenCalled()
  })

  it('reacts to browser back/forward by scrolling to the new hash step', async () => {
    const targetElement = createStepElement(KNOWN_STEP_ID, 0)
    const container = createScrollContainer()

    const [{ selectedId }] = withSetup(() => useProspectConformity(container))
    await vi.runAllTimersAsync()

    setHash(`#${KNOWN_STEP_ID}`)
    window.dispatchEvent(new HashChangeEvent('hashchange'))

    expect(selectedId.value).toBe(KNOWN_STEP_ID)
    expect(targetElement.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' })
  })

  it('ignores hashchange events when the hash does not match a known step', async () => {
    const container = createScrollContainer()

    const [{ selectedId }] = withSetup(() => useProspectConformity(container))
    await vi.runAllTimersAsync()
    const initialSelected = selectedId.value

    setHash('#non-existing-step')
    window.dispatchEvent(new HashChangeEvent('hashchange'))

    expect(selectedId.value).toBe(initialSelected)
  })

  it('selects the last step when the scroll container reaches the bottom', async () => {
    const container = createScrollContainer({ scrollTop: 900, clientHeight: 100, scrollHeight: 1000 })

    const [{ selectedId }] = withSetup(() => useProspectConformity(container))
    await vi.runAllTimersAsync()

    container.value!.dispatchEvent(new Event('scroll'))

    expect(selectedId.value).toBe(LAST_STEP_ID)
    expect(window.location.hash).toBe(`#${LAST_STEP_ID}`)
  })

  it('does not select the last step on scroll when not at the bottom', async () => {
    const container = createScrollContainer({ scrollTop: 200, clientHeight: 100, scrollHeight: 1000 })

    const [{ selectedId }] = withSetup(() => useProspectConformity(container))
    await vi.runAllTimersAsync()
    const initialSelected = selectedId.value

    container.value!.dispatchEvent(new Event('scroll'))

    expect(selectedId.value).toBe(initialSelected)
  })

  it('disconnects the observer when the component unmounts', async () => {
    const [, app] = withSetup(() => useProspectConformity(createScrollContainer()))
    await vi.runAllTimersAsync()
    const observer = observerInstances[0]

    app.unmount()

    expect(observer.disconnect).toHaveBeenCalled()
  })
})
