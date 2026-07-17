import { nextTick, ref } from 'vue'
import type { Ref } from 'vue'
import { useElementSize } from '@vueuse/core'
import { withSetup } from '@pulse/toolbox/utils/test'
import { useProspectConformity } from './prospect-conformity.composable'
import { OnboardingStep } from './prospect-conformity.enums'
import { PROSPECT_CONFORMITY_STEP_SLUGS, PROSPECT_CONFORMITY_STEPS } from './prospect-conformity.consts'
import type { ProspectConformityStep } from './prospect-conformity.types'

// Most tests exercise a page whose steps are already loaded: a getter over the
// full static list mirrors an API returning every step.
const getAllSteps = () => PROSPECT_CONFORMITY_STEPS

// useElementSize is spy-wrapped project-wide (vitest.setup.ts): the rest of
// VueUse stays real (useScroll drives the bottom-detection tests).
// The composable calls useElementSize first for the container, then for the
// last card. Drive both heights through refs the test controls.
function mockElementSizes(containerHeight: Ref<number>, lastCardHeight: Ref<number>): void {
  vi.mocked(useElementSize)
    .mockReturnValueOnce({ width: ref(0), height: containerHeight } as unknown as ReturnType<typeof useElementSize>)
    .mockReturnValueOnce({ width: ref(0), height: lastCardHeight } as unknown as ReturnType<typeof useElementSize>)
}

// The composable navigates by URL/DOM slug, not by the backend enum value.
const KNOWN_STEP_ID = PROSPECT_CONFORMITY_STEP_SLUGS[OnboardingStep.CommercialProposal]
const OTHER_STEP_ID = PROSPECT_CONFORMITY_STEP_SLUGS[OnboardingStep.SupportingDocuments]
const FIRST_STEP_ID = PROSPECT_CONFORMITY_STEP_SLUGS[OnboardingStep.Beneficiary]
const LAST_STEP_ID = PROSPECT_CONFORMITY_STEP_SLUGS[OnboardingStep.EngagementLetter]

let observerInstances: MockIntersectionObserver[]

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

// Elements are tracked and removed per test instead of wiping the shared
// jsdom body (which would break other specs of the worker under no-isolate).
const createdElements: HTMLElement[] = []

function createScrollContainer(metrics?: { scrollTop?: number, clientHeight?: number, scrollHeight?: number }) {
  const element = document.createElement('div')
  document.body.appendChild(element)
  createdElements.push(element)
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
  createdElements.push(element)
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
    observerInstances = []
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver as unknown as typeof IntersectionObserver)
    vi.mocked(useElementSize).mockReturnValue({ width: ref(0), height: ref(0) } as unknown as ReturnType<typeof useElementSize>)
    vi.useFakeTimers()
  })

  afterEach(() => {
    for (const element of createdElements) {
      element.remove()
    }
    createdElements.length = 0
    // Restore the worker-shared location hash the tests polluted; the stubbed
    // globals and fake timers are restored automatically (unstubGlobals config
    // and the isolate-safe guards).
    setHash('')
    vi.useRealTimers()
  })

  it('initializes selectedId with the first step when location hash is empty', () => {
    const [{ selectedId }] = withSetup(() => useProspectConformity(createScrollContainer(), getAllSteps))

    expect(selectedId.value).toBe(FIRST_STEP_ID)
  })

  it('initializes selectedId from the URL hash when it matches a known step', () => {
    setHash(`#${KNOWN_STEP_ID}`)

    const [{ selectedId }] = withSetup(() => useProspectConformity(createScrollContainer(), getAllSteps))

    expect(selectedId.value).toBe(KNOWN_STEP_ID)
  })

  it('falls back to the first step when the URL hash is unknown', () => {
    setHash('#non-existing-step')

    const [{ selectedId }] = withSetup(() => useProspectConformity(createScrollContainer(), getAllSteps))

    expect(selectedId.value).toBe(FIRST_STEP_ID)
  })

  it('updates selectedId, location hash and scrolls when onStepClick is called', () => {
    const target = createStepElement(KNOWN_STEP_ID, 0)

    const [{ selectedId, onStepClick }] = withSetup(() => useProspectConformity(createScrollContainer(), getAllSteps))
    onStepClick(KNOWN_STEP_ID)

    expect(selectedId.value).toBe(KNOWN_STEP_ID)
    expect(window.location.hash).toBe(`#${KNOWN_STEP_ID}`)
    expect(target.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' })
  })

  it('does not throw when onStepClick targets a step without a matching DOM element', () => {
    const [{ selectedId, onStepClick }] = withSetup(() => useProspectConformity(createScrollContainer(), getAllSteps))

    expect(() => onStepClick(KNOWN_STEP_ID)).not.toThrow()
    expect(selectedId.value).toBe(KNOWN_STEP_ID)
  })

  it('scrolls to the step matching the initial hash once the content has settled', async () => {
    setHash(`#${KNOWN_STEP_ID}`)
    const target = createStepElement(KNOWN_STEP_ID, 0)

    withSetup(() => useProspectConformity(createScrollContainer(), getAllSteps))
    await vi.runAllTimersAsync()

    expect(target.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' })
  })

  it('scrolls to the first incomplete step once the statuses resolve', async () => {
    const target = createStepElement(OTHER_STEP_ID, 0)
    const firstIncompleteStepId = ref<string | null>(null)

    const [{ selectedId }] = withSetup(() =>
      useProspectConformity(createScrollContainer(), getAllSteps, () => firstIncompleteStepId.value),
    )
    await vi.runAllTimersAsync()

    // Nothing is focused while the statuses are still loading.
    expect(target.scrollIntoView).not.toHaveBeenCalled()
    expect(selectedId.value).toBe(FIRST_STEP_ID)

    firstIncompleteStepId.value = OTHER_STEP_ID
    await vi.runAllTimersAsync()

    expect(selectedId.value).toBe(OTHER_STEP_ID)
    expect(window.location.hash).toBe(`#${OTHER_STEP_ID}`)
    expect(target.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' })
  })

  it('defers the auto-focus scroll until the loading content has had time to settle', async () => {
    const target = createStepElement(OTHER_STEP_ID, 0)
    const firstIncompleteStepId = ref<string | null>(OTHER_STEP_ID)

    const [{ selectedId }] = withSetup(() =>
      useProspectConformity(createScrollContainer(), getAllSteps, () => firstIncompleteStepId.value),
    )

    // The step is selected as soon as onMounted runs, but without advancing
    // timers the delayed scroll has not fired yet.
    await nextTick()
    expect(selectedId.value).toBe(OTHER_STEP_ID)
    expect(target.scrollIntoView).not.toHaveBeenCalled()

    // Only once the delay timer elapses does the scroll happen.
    await vi.runAllTimersAsync()
    expect(target.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' })
  })

  it('does not auto-focus the first incomplete step when a known hash is restored', async () => {
    setHash(`#${KNOWN_STEP_ID}`)
    const restoredElement = createStepElement(KNOWN_STEP_ID, 0)
    const incompleteElement = createStepElement(OTHER_STEP_ID, 100)
    const firstIncompleteStepId = ref<string | null>(OTHER_STEP_ID)

    const [{ selectedId }] = withSetup(() =>
      useProspectConformity(createScrollContainer(), getAllSteps, () => firstIncompleteStepId.value),
    )
    await vi.runAllTimersAsync()

    expect(selectedId.value).toBe(KNOWN_STEP_ID)
    expect(restoredElement.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' })
    expect(incompleteElement.scrollIntoView).not.toHaveBeenCalled()
  })

  it('auto-focuses the first incomplete step only once', async () => {
    createStepElement(OTHER_STEP_ID, 0)
    const laterElement = createStepElement(KNOWN_STEP_ID, 100)
    const firstIncompleteStepId = ref<string | null>(null)

    const [{ selectedId }] = withSetup(() =>
      useProspectConformity(createScrollContainer(), getAllSteps, () => firstIncompleteStepId.value),
    )
    await vi.runAllTimersAsync()

    firstIncompleteStepId.value = OTHER_STEP_ID
    await vi.runAllTimersAsync()
    expect(selectedId.value).toBe(OTHER_STEP_ID)

    // A later status change must not hijack the scroll position again.
    firstIncompleteStepId.value = KNOWN_STEP_ID
    await vi.runAllTimersAsync()

    expect(selectedId.value).toBe(OTHER_STEP_ID)
    expect(laterElement.scrollIntoView).not.toHaveBeenCalled()
  })

  it('does not let late-loading statuses hijack a step the user clicked during loading', async () => {
    createStepElement(KNOWN_STEP_ID, 0)
    const incompleteElement = createStepElement(OTHER_STEP_ID, 100)
    const firstIncompleteStepId = ref<string | null>(null)

    const [{ selectedId, onStepClick }] = withSetup(() =>
      useProspectConformity(createScrollContainer(), getAllSteps, () => firstIncompleteStepId.value),
    )
    // The watcher is armed but idle while the statuses are still loading (null).
    await vi.runAllTimersAsync()

    // The user navigates manually, which locks the scrollspy.
    onStepClick(KNOWN_STEP_ID)
    expect(selectedId.value).toBe(KNOWN_STEP_ID)

    // The statuses resolve while the click's scroll lock is still held. Flush
    // the watcher through microtasks only, without advancing the lock timer.
    firstIncompleteStepId.value = OTHER_STEP_ID
    await nextTick()

    expect(selectedId.value).toBe(KNOWN_STEP_ID)
    expect(incompleteElement.scrollIntoView).not.toHaveBeenCalled()

    // The one-shot is consumed, so a later status change can't re-focus either.
    firstIncompleteStepId.value = FIRST_STEP_ID
    await vi.runAllTimersAsync()

    expect(selectedId.value).toBe(KNOWN_STEP_ID)
  })

  it('does not let late-loading statuses hijack a clicked step after the scroll lock expires', async () => {
    createStepElement(KNOWN_STEP_ID, 0)
    const incompleteElement = createStepElement(OTHER_STEP_ID, 100)
    const firstIncompleteStepId = ref<string | null>(null)

    const [{ selectedId, onStepClick }] = withSetup(() =>
      useProspectConformity(createScrollContainer(), getAllSteps, () => firstIncompleteStepId.value),
    )
    await vi.runAllTimersAsync()

    // The user picks a step while the statuses are still loading.
    onStepClick(KNOWN_STEP_ID)
    expect(selectedId.value).toBe(KNOWN_STEP_ID)

    // The 800 ms scroll lock expires before the statuses arrive.
    await vi.advanceTimersByTimeAsync(1000)

    // The statuses arrive after the lock is gone, but the user's choice must hold.
    firstIncompleteStepId.value = OTHER_STEP_ID
    await vi.runAllTimersAsync()

    expect(selectedId.value).toBe(KNOWN_STEP_ID)
    expect(incompleteElement.scrollIntoView).not.toHaveBeenCalled()
  })

  it('does not let late-loading statuses hijack a step reached via back/forward after the scroll lock expires', async () => {
    createStepElement(KNOWN_STEP_ID, 0)
    const incompleteElement = createStepElement(OTHER_STEP_ID, 100)
    const firstIncompleteStepId = ref<string | null>(null)

    const [{ selectedId }] = withSetup(() =>
      useProspectConformity(createScrollContainer(), getAllSteps, () => firstIncompleteStepId.value),
    )
    await vi.runAllTimersAsync()

    // The user goes back/forward in the browser while the statuses are loading.
    setHash(`#${KNOWN_STEP_ID}`)
    window.dispatchEvent(new HashChangeEvent('hashchange'))
    expect(selectedId.value).toBe(KNOWN_STEP_ID)

    // The 800 ms scroll lock expires before the statuses arrive.
    await vi.advanceTimersByTimeAsync(1000)

    firstIncompleteStepId.value = OTHER_STEP_ID
    await vi.runAllTimersAsync()

    expect(selectedId.value).toBe(KNOWN_STEP_ID)
    expect(incompleteElement.scrollIntoView).not.toHaveBeenCalled()
  })

  it('does not let late-loading statuses hijack the position after the user scrolls manually', async () => {
    const incompleteElement = createStepElement(OTHER_STEP_ID, 100)
    const firstIncompleteStepId = ref<string | null>(null)
    const container = createScrollContainer()

    const [{ selectedId }] = withSetup(() =>
      useProspectConformity(container, getAllSteps, () => firstIncompleteStepId.value),
    )
    // The watcher is armed but idle while the statuses are still loading (null).
    await vi.runAllTimersAsync()

    // The user takes control by scrolling manually (a real wheel gesture).
    container.value!.dispatchEvent(new Event('wheel'))

    // The statuses resolve after the manual scroll.
    firstIncompleteStepId.value = OTHER_STEP_ID
    await vi.runAllTimersAsync()

    expect(selectedId.value).toBe(FIRST_STEP_ID)
    expect(incompleteElement.scrollIntoView).not.toHaveBeenCalled()
  })

  it('recognizes a touch drag as manual navigation too', async () => {
    const incompleteElement = createStepElement(OTHER_STEP_ID, 100)
    const firstIncompleteStepId = ref<string | null>(null)
    const container = createScrollContainer()

    const [{ selectedId }] = withSetup(() =>
      useProspectConformity(container, getAllSteps, () => firstIncompleteStepId.value),
    )
    await vi.runAllTimersAsync()

    container.value!.dispatchEvent(new Event('touchmove'))

    firstIncompleteStepId.value = OTHER_STEP_ID
    await vi.runAllTimersAsync()

    expect(selectedId.value).toBe(FIRST_STEP_ID)
    expect(incompleteElement.scrollIntoView).not.toHaveBeenCalled()
  })

  it('cancels the pending initial scroll when the user scrolls before it fires', async () => {
    const target = createStepElement(OTHER_STEP_ID, 0)
    const firstIncompleteStepId = ref<string | null>(OTHER_STEP_ID)
    const container = createScrollContainer()

    const [{ selectedId }] = withSetup(() =>
      useProspectConformity(container, getAllSteps, () => firstIncompleteStepId.value),
    )

    // Auto-focus selects the step and arms the deferred scroll, but it has not fired yet.
    await nextTick()
    expect(selectedId.value).toBe(OTHER_STEP_ID)
    expect(target.scrollIntoView).not.toHaveBeenCalled()

    // The user grabs control during the delay window.
    container.value!.dispatchEvent(new Event('wheel'))

    // The deferred scroll must not run anymore.
    await vi.runAllTimersAsync()
    expect(target.scrollIntoView).not.toHaveBeenCalled()
  })

  it('cancels a pending initial scroll when the user clicks a step during the delay window', async () => {
    const autoFocusTarget = createStepElement(OTHER_STEP_ID, 0)
    const clickedTarget = createStepElement(KNOWN_STEP_ID, 100)
    const firstIncompleteStepId = ref<string | null>(OTHER_STEP_ID)
    const container = createScrollContainer()

    const [{ selectedId, onStepClick }] = withSetup(() =>
      useProspectConformity(container, getAllSteps, () => firstIncompleteStepId.value),
    )

    // Auto-focus arms the deferred scroll to the incomplete step.
    await nextTick()
    expect(selectedId.value).toBe(OTHER_STEP_ID)

    // The user clicks another step within the delay window.
    onStepClick(KNOWN_STEP_ID)
    expect(selectedId.value).toBe(KNOWN_STEP_ID)

    // The pending auto-focus scroll must not override the clicked step.
    await vi.runAllTimersAsync()
    expect(autoFocusTarget.scrollIntoView).not.toHaveBeenCalled()
    expect(clickedTarget.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' })
  })

  it('selects the topmost intersecting step when the user scrolls', async () => {
    const firstElement = createStepElement(FIRST_STEP_ID, 0)
    const secondElement = createStepElement(KNOWN_STEP_ID, 100)
    const thirdElement = createStepElement(OTHER_STEP_ID, 500)
    const container = createScrollContainer()

    const [{ selectedId }] = withSetup(() => useProspectConformity(container, getAllSteps))
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

    const [{ selectedId, onStepClick }] = withSetup(() => useProspectConformity(container, getAllSteps))
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

    const [{ onStepClick }] = withSetup(() => useProspectConformity(container, getAllSteps))
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

    const [{ selectedId }] = withSetup(() => useProspectConformity(container, getAllSteps))
    await vi.runAllTimersAsync()

    setHash(`#${KNOWN_STEP_ID}`)
    window.dispatchEvent(new HashChangeEvent('hashchange'))

    expect(selectedId.value).toBe(KNOWN_STEP_ID)
    expect(targetElement.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' })
  })

  it('ignores hashchange events when the hash does not match a known step', async () => {
    const container = createScrollContainer()

    const [{ selectedId }] = withSetup(() => useProspectConformity(container, getAllSteps))
    await vi.runAllTimersAsync()
    const initialSelected = selectedId.value

    setHash('#non-existing-step')
    window.dispatchEvent(new HashChangeEvent('hashchange'))

    expect(selectedId.value).toBe(initialSelected)
  })

  it('selects the last step when the scroll container reaches the bottom', async () => {
    const container = createScrollContainer({ scrollTop: 0, clientHeight: 100, scrollHeight: 1000 })

    const [{ selectedId }] = withSetup(() => useProspectConformity(container, getAllSteps))
    await vi.runAllTimersAsync()

    container.value!.scrollTop = 900
    container.value!.dispatchEvent(new Event('scroll'))

    expect(selectedId.value).toBe(LAST_STEP_ID)
    expect(window.location.hash).toBe(`#${LAST_STEP_ID}`)
  })

  it('does not select the last step on scroll when not at the bottom', async () => {
    const container = createScrollContainer({ scrollTop: 200, clientHeight: 100, scrollHeight: 1000 })

    const [{ selectedId }] = withSetup(() => useProspectConformity(container, getAllSteps))
    await vi.runAllTimersAsync()
    const initialSelected = selectedId.value

    container.value!.dispatchEvent(new Event('scroll'))

    expect(selectedId.value).toBe(initialSelected)
  })

  it('exposes a trailing spacer sized to fill the container below the last card', async () => {
    const containerHeight = ref(0)
    const lastCardHeight = ref(0)
    mockElementSizes(containerHeight, lastCardHeight)

    const [{ spacerHeight }] = withSetup(() => useProspectConformity(createScrollContainer(), getAllSteps))
    await vi.runAllTimersAsync()

    expect(spacerHeight.value).toBe(0)

    containerHeight.value = 800
    lastCardHeight.value = 200

    expect(spacerHeight.value).toBe(600)
  })

  it('subtracts the container bottom padding and row gap already providing scrollable room', async () => {
    const containerHeight = ref(800)
    const lastCardHeight = ref(200)
    mockElementSizes(containerHeight, lastCardHeight)

    const container = createScrollContainer()
    container.value!.style.paddingBottom = '20px'
    container.value!.style.rowGap = '30px'

    const [{ spacerHeight }] = withSetup(() => useProspectConformity(container, getAllSteps))
    await vi.runAllTimersAsync()

    expect(spacerHeight.value).toBe(550)
  })

  it('clamps the spacer height to zero when the last card is taller than the container', async () => {
    mockElementSizes(ref(100), ref(500))

    const [{ spacerHeight }] = withSetup(() => useProspectConformity(createScrollContainer(), getAllSteps))
    await vi.runAllTimersAsync()

    expect(spacerHeight.value).toBe(0)
  })

  it('disconnects the observer when the component unmounts', async () => {
    const [, app] = withSetup(() => useProspectConformity(createScrollContainer(), getAllSteps))
    await vi.runAllTimersAsync()
    const observer = observerInstances[0]

    app.unmount()

    expect(observer.disconnect).toHaveBeenCalled()
  })

  describe('dynamic steps list', () => {
    it('keeps no selection and creates no observer while the steps list is still empty', async () => {
      const steps = ref<readonly ProspectConformityStep[]>([])

      const [{ selectedId }] = withSetup(() => useProspectConformity(createScrollContainer(), () => steps.value))
      await vi.runAllTimersAsync()

      expect(selectedId.value).toBe('')
      expect(observerInstances).toHaveLength(0)
    })

    it('selects the first available step once the steps load, without scrolling', async () => {
      const firstElement = createStepElement(FIRST_STEP_ID, 0)
      const steps = ref<readonly ProspectConformityStep[]>([])

      const [{ selectedId }] = withSetup(() => useProspectConformity(createScrollContainer(), () => steps.value))
      await vi.runAllTimersAsync()

      steps.value = PROSPECT_CONFORMITY_STEPS
      await vi.runAllTimersAsync()

      expect(selectedId.value).toBe(FIRST_STEP_ID)
      expect(firstElement.scrollIntoView).not.toHaveBeenCalled()
    })

    it('restores the hash selection once the loaded steps contain it', async () => {
      setHash(`#${KNOWN_STEP_ID}`)
      const target = createStepElement(KNOWN_STEP_ID, 0)
      const steps = ref<readonly ProspectConformityStep[]>([])

      const [{ selectedId }] = withSetup(() => useProspectConformity(createScrollContainer(), () => steps.value))
      await vi.runAllTimersAsync()
      expect(selectedId.value).toBe('')

      steps.value = PROSPECT_CONFORMITY_STEPS
      await vi.runAllTimersAsync()

      expect(selectedId.value).toBe(KNOWN_STEP_ID)
      expect(target.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' })
    })

    it('falls back to the first available step without scrolling when the hash targets a step absent from the API', async () => {
      setHash(`#${LAST_STEP_ID}`)
      const stepsWithoutLast = PROSPECT_CONFORMITY_STEPS.filter((step) => step.slug !== LAST_STEP_ID)
      const firstElement = createStepElement(FIRST_STEP_ID, 0)
      const steps = ref<readonly ProspectConformityStep[]>([])

      const [{ selectedId }] = withSetup(() => useProspectConformity(createScrollContainer(), () => steps.value))
      steps.value = stepsWithoutLast
      await vi.runAllTimersAsync()

      expect(selectedId.value).toBe(FIRST_STEP_ID)
      expect(firstElement.scrollIntoView).not.toHaveBeenCalled()
    })

    it('observes the step elements rendered after the steps load', async () => {
      const firstElement = createStepElement(FIRST_STEP_ID, 0)
      const steps = ref<readonly ProspectConformityStep[]>([])

      withSetup(() => useProspectConformity(createScrollContainer(), () => steps.value))
      await vi.runAllTimersAsync()
      expect(observerInstances).toHaveLength(0)

      steps.value = PROSPECT_CONFORMITY_STEPS
      await vi.runAllTimersAsync()

      expect(observerInstances).toHaveLength(1)
      expect(observerInstances[0].observe).toHaveBeenCalledWith(firstElement)
    })

    it('disconnects the previous observer and re-attaches when the step list changes', async () => {
      const steps = ref<readonly ProspectConformityStep[]>(PROSPECT_CONFORMITY_STEPS)

      withSetup(() => useProspectConformity(createScrollContainer(), () => steps.value))
      await vi.runAllTimersAsync()
      expect(observerInstances).toHaveLength(1)

      steps.value = PROSPECT_CONFORMITY_STEPS.slice(0, 2)
      await vi.runAllTimersAsync()

      expect(observerInstances[0].disconnect).toHaveBeenCalled()
      expect(observerInstances).toHaveLength(2)
    })

    it('does not re-attach the observer when a reload yields the same step list', async () => {
      const steps = ref<readonly ProspectConformityStep[]>(PROSPECT_CONFORMITY_STEPS)

      withSetup(() => useProspectConformity(createScrollContainer(), () => steps.value))
      await vi.runAllTimersAsync()
      expect(observerInstances).toHaveLength(1)

      // A reload typically returns a new array with the same content.
      steps.value = [...PROSPECT_CONFORMITY_STEPS]
      await vi.runAllTimersAsync()

      expect(observerInstances).toHaveLength(1)
    })

    it('selects the last available step when reaching the bottom', async () => {
      const stepsWithoutLast = PROSPECT_CONFORMITY_STEPS.filter((step) => step.slug !== LAST_STEP_ID)
      const lastAvailableStepId = stepsWithoutLast.at(-1)?.slug ?? ''
      const container = createScrollContainer({ scrollTop: 0, clientHeight: 100, scrollHeight: 1000 })

      const [{ selectedId }] = withSetup(() => useProspectConformity(container, () => stepsWithoutLast))
      await vi.runAllTimersAsync()

      container.value!.scrollTop = 900
      container.value!.dispatchEvent(new Event('scroll'))

      expect(selectedId.value).toBe(lastAvailableStepId)
      expect(window.location.hash).toBe(`#${lastAvailableStepId}`)
    })

    it('arms the auto-focus only once the steps have loaded', async () => {
      const target = createStepElement(OTHER_STEP_ID, 0)
      const firstIncompleteStepId = ref<string | null>(null)
      const steps = ref<readonly ProspectConformityStep[]>([])

      const [{ selectedId }] = withSetup(() =>
        useProspectConformity(createScrollContainer(), () => steps.value, () => firstIncompleteStepId.value),
      )

      // The statuses resolve before the steps list: nothing must move yet.
      firstIncompleteStepId.value = OTHER_STEP_ID
      await vi.runAllTimersAsync()
      expect(selectedId.value).toBe('')
      expect(target.scrollIntoView).not.toHaveBeenCalled()

      steps.value = PROSPECT_CONFORMITY_STEPS
      await vi.runAllTimersAsync()

      expect(selectedId.value).toBe(OTHER_STEP_ID)
      expect(target.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' })
    })

    it('returns a zero spacer while no step is rendered', async () => {
      mockElementSizes(ref(800), ref(0))

      const [{ spacerHeight }] = withSetup(() => useProspectConformity(createScrollContainer(), () => []))
      await vi.runAllTimersAsync()

      expect(spacerHeight.value).toBe(0)
    })
  })
})
