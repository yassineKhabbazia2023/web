import { nextTick, ref } from 'vue'
import { useElementBounding, useScroll, unrefElement } from '@vueuse/core'
import type { MaybeElementRef } from '@vueuse/core'

const SCROLL_BOTTOM_PADDING_PX = 16
const SCROLLABLE_OVERFLOW_PATTERN = /auto|scroll|overlay/

// Walk up the DOM until a scrollable ancestor is found. Returns null when none
// exists so the caller can decide how to react.
function findScrollableAncestor(element: HTMLElement): HTMLElement | null {
  let parent: HTMLElement | null = element.parentElement
  while (parent !== null) {
    const { overflowY } = globalThis.getComputedStyle(parent)
    if (SCROLLABLE_OVERFLOW_PATTERN.test(overflowY)) {
      return parent
    }
    parent = parent.parentElement
  }
  return null
}

// Exposes an imperative scrollToAlert() so callers can trigger the scroll on
// user actions (e.g. a "Next" button click), instead of relying on a reactive
// watch that misses cases where the same error key is re-emitted.
export function useScrollToAlert(alertRef: MaybeElementRef): {
  scrollToAlert: () => Promise<void>
} {
  const scrollContainerRef = ref<HTMLElement | null>(null)
  const { y } = useScroll(scrollContainerRef, { behavior: 'smooth' })
  const { top: alertTopViewport, height: alertHeight, update } = useElementBounding(alertRef)

  async function scrollToAlert(): Promise<void> {
    // Let any v-if for the alert flush to the DOM before measuring.
    await nextTick()

    const alertElement = unrefElement(alertRef)
    if (alertElement === null || alertElement === undefined) {
      return
    }

    // Lazily resolve the scroll container on first use.
    scrollContainerRef.value ??= findScrollableAncestor(alertElement as HTMLElement)

    const scrollContainer = scrollContainerRef.value
    if (scrollContainer === null) {
      return
    }

    // Force a fresh measurement: useElementBounding's auto-update may not have
    // run yet for an element that just entered the DOM.
    update()

    const containerRect = scrollContainer.getBoundingClientRect()
    const alertBottomViewport = alertTopViewport.value + alertHeight.value
    const containerBottomViewport = containerRect.top + scrollContainer.clientHeight

    const isAlertBelowViewport = alertBottomViewport > containerBottomViewport
    const isAlertAboveViewport = alertTopViewport.value < containerRect.top

    // Read the live scrollTop rather than the cached y from useScroll: when the
    // container is resolved lazily, useScroll's internal state may not yet
    // reflect the actual position. y.value (the setter) still drives a smooth scroll.
    const currentScrollTop = scrollContainer.scrollTop

    if (isAlertBelowViewport === true) {
      y.value = currentScrollTop + (alertBottomViewport - containerBottomViewport) + SCROLL_BOTTOM_PADDING_PX
      return
    }

    if (isAlertAboveViewport === true) {
      y.value = currentScrollTop - (containerRect.top - alertTopViewport.value) - SCROLL_BOTTOM_PADDING_PX
    }
  }

  return { scrollToAlert }
}
