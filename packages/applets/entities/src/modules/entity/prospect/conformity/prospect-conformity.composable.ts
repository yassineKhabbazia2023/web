import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { Ref } from 'vue'
import { useElementSize, useEventListener, useScroll } from '@vueuse/core'
import { isNullOrEmpty } from '@pulse/toolbox/utils/validator'
import { PROSPECT_CONFORMITY_STEPS } from './prospect-conformity.consts'

const SCROLL_LOCK_DURATION_MS = 800
const SCROLLSPY_ROOT_MARGIN = '-15% 0px -80% 0px'
const BOTTOM_DETECTION_THRESHOLD_PX = 4
// Step cards load their own data after mount and grow the content; wait a beat
// so the layout has settled before the initial programmatic scroll runs.
const INITIAL_SCROLL_DELAY_MS = 500

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

export function useProspectConformity(
  scrollContainerRef: Ref<HTMLElement | null>,
  getFirstIncompleteStepId?: () => string | null | undefined,
) {
  const initialHash = globalThis.location.hash.replaceAll('#', '')
  const isKnownStep = PROSPECT_CONFORMITY_STEPS.some((step) => step.slug === initialHash)
  const fallbackId = PROSPECT_CONFORMITY_STEPS[0]?.slug ?? ''
  const selectedId = ref(isKnownStep ? initialHash : fallbackId)
  const shouldRestoreScroll = isKnownStep === true && initialHash !== ''

  let observer: IntersectionObserver | null = null
  let isScrollLocked = false
  let scrollLockTimer: ReturnType<typeof setTimeout> | null = null
  // True once the user picks a step on purpose (a click or browser back/forward).
  // isScrollLocked lasts only SCROLL_LOCK_DURATION_MS; this flag never resets, so
  // statuses that load late can't move the user off the step they chose.
  let hasUserNavigated = false
  let hasAutoFocused = false
  let stopAutoFocusWatch: (() => void) | null = null
  let initialScrollTimer: ReturnType<typeof setTimeout> | null = null

  const cancelScrollLock = (): void => {
    if (scrollLockTimer !== null) {
      clearTimeout(scrollLockTimer)
      scrollLockTimer = null
    }
  }

  const cancelInitialScroll = (): void => {
    if (initialScrollTimer !== null) {
      clearTimeout(initialScrollTimer)
      initialScrollTimer = null
    }
  }

  const lockScrollSync = (): void => {
    isScrollLocked = true
    cancelScrollLock()
    scrollLockTimer = setTimeout(() => {
      isScrollLocked = false
      scrollLockTimer = null
    }, SCROLL_LOCK_DURATION_MS)
  }

  const onStepClick = (stepId: string): void => {
    hasUserNavigated = true
    cancelInitialScroll()
    lockScrollSync()
    selectedId.value = stepId
    updateHash(stepId, 'push')
    scrollToStep(stepId)
  }

  // A genuine user gesture (mouse wheel or touch drag) means the user has taken
  // control of the scroll. Unlike the 'scroll' event, these never fire for our
  // own programmatic smooth scroll, so they cleanly separate intent from
  // side-effect. Mark navigation and cancel any pending initial auto-scroll, so
  // a late-loading auto-focus can't yank the user away from where they scrolled.
  const handleUserScrollGesture = (): void => {
    hasUserNavigated = true
    cancelInitialScroll()
  }

  const handleHashChange = (): void => {
    const newHash = globalThis.location.hash.replaceAll('#', '')
    if (newHash === '' || newHash === selectedId.value) {
      return
    }
    const isKnown = PROSPECT_CONFORMITY_STEPS.some((step) => step.slug === newHash)
    if (isKnown === false) {
      return
    }
    hasUserNavigated = true
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

  const lastStepId = PROSPECT_CONFORMITY_STEPS.at(-1)?.slug ?? ''

  // The last (often shortest) card cannot be scrolled to the very top when the
  // remaining content below it is smaller than the viewport. A trailing spacer
  // fills that gap. Only the last card matters: every earlier card has a
  // smaller offsetTop, so it can already reach the top once the last one can.
  // useElementSize is backed by a ResizeObserver, so the spacer stays correct
  // as the card's async content loads or the window resizes.
  const lastStepCard = ref<HTMLElement | null>(null)
  const { height: containerHeight } = useElementSize(scrollContainerRef)
  const { height: lastStepCardHeight } = useElementSize(lastStepCard)
  const spacerHeight = computed(() =>
    Math.max(0, containerHeight.value - lastStepCardHeight.value),
  )

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

  // Passive: we only observe the gesture, never preventDefault. Keyboard scroll
  // is intentionally left out to avoid false positives while typing in a widget.
  useEventListener(scrollContainerRef, ['wheel', 'touchmove'], handleUserScrollGesture, {
    passive: true,
  })

  // Async step cards fetch their own data after mount and grow the content,
  // which would shift a step out from under an immediate scroll (and, on a cold
  // refresh, scroll while the page is still empty). Defer the initial scroll so
  // the layout has settled, then re-lock the scrollspy for the smooth scroll.
  const scrollToStepAfterContentSettles = (stepId: string): void => {
    cancelInitialScroll()
    initialScrollTimer = setTimeout(() => {
      initialScrollTimer = null
      lockScrollSync()
      scrollToStep(stepId)
    }, INITIAL_SCROLL_DELAY_MS)
  }

  const consumeAutoFocus = (): void => {
    hasAutoFocused = true
    stopAutoFocusWatch?.()
    stopAutoFocusWatch = null
  }

  // On initial load (no deep-linked hash) focus the first step the user still
  // has to complete. The statuses load asynchronously, so the getter returns
  // null until they are known; act at most once, then stop watching.
  const focusFirstIncompleteStep = (stepId: string | null | undefined): void => {
    if (hasAutoFocused === true || isNullOrEmpty(stepId)) {
      return
    }
    // The user already picked a step. Don't move them elsewhere when the
    // statuses finish loading, now or later — they stay in control.
    if (isScrollLocked === true || hasUserNavigated === true) {
      consumeAutoFocus()
      return
    }
    consumeAutoFocus()
    // Lock immediately so the scrollspy can't overwrite the selection during
    // the delay; the deferred scroll re-locks for the smooth scroll itself.
    lockScrollSync()
    selectedId.value = stepId
    updateHash(stepId, 'replace')
    scrollToStepAfterContentSettles(stepId)
  }

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
      const element = document.getElementById(`step-${step.slug}`)
      if (element !== null) {
        observer?.observe(element)
      }
    })
  }

  onMounted(async () => {
    await nextTick()
    if (shouldRestoreScroll === true) {
      // Lock the scrollspy so the initial intersection burst doesn't
      // overwrite the hash-based selection while the smooth scroll runs.
      lockScrollSync()
    }
    setupObserver()
    lastStepCard.value = document.getElementById(`step-${lastStepId}`)
    if (shouldRestoreScroll === true) {
      scrollToStepAfterContentSettles(initialHash)
      return
    }
    if (getFirstIncompleteStepId !== undefined) {
      stopAutoFocusWatch = watch(getFirstIncompleteStepId, focusFirstIncompleteStep, { immediate: true })
      // The immediate run may have already focused (statuses loaded synchronously);
      // tear the watcher down in that case since we only auto-focus once.
      if (hasAutoFocused === true) {
        stopAutoFocusWatch()
        stopAutoFocusWatch = null
      }
    }
  })

  onBeforeUnmount(() => {
    cancelScrollLock()
    cancelInitialScroll()
    stopAutoFocusWatch?.()
    observer?.disconnect()
    observer = null
  })

  return {
    selectedId,
    onStepClick,
    spacerHeight,
  }
}
