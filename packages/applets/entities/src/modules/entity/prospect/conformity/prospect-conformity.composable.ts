import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { Ref } from 'vue'
import { useEventListener, useScroll } from '@vueuse/core'
import { PROSPECT_CONFORMITY_STEPS } from './prospect-conformity.consts'

const SCROLL_LOCK_DURATION_MS = 800
const SCROLLSPY_ROOT_MARGIN = '-15% 0px -80% 0px'
const BOTTOM_DETECTION_THRESHOLD_PX = 4

function scrollToStep(stepId: string): void {
  const element = document.getElementById(`step-${stepId}`)
  if (element !== null) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

function updateHash(stepId: string, mode: 'push' | 'replace'): void {
  const { pathname, search } = globalThis.location
  const url = `${pathname}${search}#${stepId}`
  // Preserve the existing history.state so vue-router's internal tracking
  // is not wiped (passing null here would cause router-driven navigations
  // to land on a blank route).
  if (mode === 'push') {
    globalThis.history.pushState(globalThis.history.state, '', url)
  } else {
    globalThis.history.replaceState(globalThis.history.state, '', url)
  }
}

export function useProspectConformity(scrollContainerRef: Ref<HTMLElement | null>) {
  const initialHash = globalThis.location.hash.replaceAll('#', '')
  const isKnownStep = PROSPECT_CONFORMITY_STEPS.some((step) => step.id === initialHash)
  const fallbackId = PROSPECT_CONFORMITY_STEPS[0]?.id ?? ''
  const selectedId = ref(isKnownStep ? initialHash : fallbackId)

  let observer: IntersectionObserver | null = null
  let isScrollLocked = false
  let scrollLockTimer: ReturnType<typeof setTimeout> | null = null

  const lockScrollSync = (): void => {
    isScrollLocked = true
    if (scrollLockTimer !== null) {
      clearTimeout(scrollLockTimer)
    }
    scrollLockTimer = setTimeout(() => {
      isScrollLocked = false
      scrollLockTimer = null
    }, SCROLL_LOCK_DURATION_MS)
  }

  const onStepClick = (stepId: string): void => {
    lockScrollSync()
    selectedId.value = stepId
    updateHash(stepId, 'push')
    scrollToStep(stepId)
  }

  const handleHashChange = (): void => {
    const newHash = globalThis.location.hash.replaceAll('#', '')
    if (newHash === '' || newHash === selectedId.value) {
      return
    }
    const isKnown = PROSPECT_CONFORMITY_STEPS.some((step) => step.id === newHash)
    if (isKnown === false) {
      return
    }
    lockScrollSync()
    selectedId.value = newHash
    scrollToStep(newHash)
  }

  const handleIntersections = (entries: IntersectionObserverEntry[]): void => {
    if (isScrollLocked === true) {
      return
    }
    const intersecting = entries.filter((entry) => entry.isIntersecting === true)
    if (intersecting.length === 0) {
      return
    }
    const topmost = intersecting.reduce(
      (min, entry) =>
        entry.boundingClientRect.top < min.boundingClientRect.top ? entry : min,
      intersecting[0],
    )
    const stepId = topmost.target.id.replaceAll('step-', '')
    if (stepId === selectedId.value) {
      return
    }
    selectedId.value = stepId
    updateHash(stepId, 'replace')
  }

  const lastStepId = PROSPECT_CONFORMITY_STEPS.at(-1)?.id ?? ''

  // useScroll owns the (passive) scroll listener and its cleanup, and exposes
  // arrivedState.bottom — true once within BOTTOM_DETECTION_THRESHOLD_PX of the
  // end — replacing the manual listener and scrollTop/clientHeight/scrollHeight math.
  const { arrivedState } = useScroll(scrollContainerRef, {
    offset: { bottom: BOTTOM_DETECTION_THRESHOLD_PX },
  })

  // flush: 'sync' so reaching the bottom selects the last step synchronously,
  // matching the behaviour of the previous scroll handler.
  watch(
    () => arrivedState.bottom,
    (isAtBottom) => {
      const container = scrollContainerRef.value
      // Guard against a non-scrollable container, whose arrivedState.bottom
      // reads as true even though no scrolling can ever happen.
      const isScrollable = container !== null && container.scrollHeight > container.clientHeight
      if (
        isAtBottom === false ||
        isScrollable === false ||
        isScrollLocked === true ||
        lastStepId === '' ||
        selectedId.value === lastStepId
      ) {
        return
      }
      selectedId.value = lastStepId
      updateHash(lastStepId, 'replace')
    },
    { flush: 'sync' },
  )

  // Auto-removed on unmount; replaces the manual add/removeEventListener pair.
  useEventListener(globalThis, 'hashchange', handleHashChange)

  const setupObserver = (): void => {
    if (scrollContainerRef.value === null) {
      return
    }
    observer = new IntersectionObserver(handleIntersections, {
      root: scrollContainerRef.value,
      rootMargin: SCROLLSPY_ROOT_MARGIN,
      threshold: 0,
    })
    PROSPECT_CONFORMITY_STEPS.forEach((step) => {
      const element = document.getElementById(`step-${step.id}`)
      if (element !== null) {
        observer?.observe(element)
      }
    })
  }

  onMounted(async () => {
    await nextTick()
    const shouldRestoreScroll = isKnownStep === true && initialHash !== ''
    if (shouldRestoreScroll === true) {
      // Lock the scrollspy so the initial intersection burst doesn't
      // overwrite the hash-based selection while the smooth scroll runs.
      lockScrollSync()
    }
    setupObserver()
    if (shouldRestoreScroll === true) {
      requestAnimationFrame(() => scrollToStep(initialHash))
    }
  })

  onBeforeUnmount(() => {
    if (scrollLockTimer !== null) {
      clearTimeout(scrollLockTimer)
    }
    observer?.disconnect()
    observer = null
  })

  return {
    selectedId,
    onStepClick,
  }
}
