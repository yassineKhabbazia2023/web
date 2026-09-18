import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { Ref } from 'vue'

/**
 * Where, down the visible part of the scrolling frame, a section is read as
 * reached: well below the top edge, so that a block the reader clearly has in
 * view is pointed at before it touches the top. Sections brought to their rest
 * by `scrollIntoView` sit at their `scroll-margin-top`, far above this line.
 */
const READING_LINE_RATIO = 0.3

/**
 * Nearest ancestor that actually scrolls: the main container of the layout on
 * the collaborator and customer apps, the viewport itself when no ancestor
 * clips its overflow. Walked rather than assumed, so the nav needs to know
 * nothing of the layout that hosts it.
 */
function findScrollFrameBounds(element: HTMLElement): { top: number, height: number } {
  let ancestor = element.parentElement

  while (ancestor !== null) {
    const { overflowY } = getComputedStyle(ancestor)
    const isScrolling = (overflowY === 'auto' || overflowY === 'scroll')
      && ancestor.scrollHeight > ancestor.clientHeight

    if (isScrolling) {
      const { top, height } = ancestor.getBoundingClientRect()

      return { top, height }
    }

    ancestor = ancestor.parentElement
  }

  return { top: 0, height: window.innerHeight }
}

function findReadingLine(element: HTMLElement): number {
  const { top, height } = findScrollFrameBounds(element)

  return top + height * READING_LINE_RATIO
}

/**
 * The anchor the reader is at: the last one, in reading order, whose top has
 * gone past the reading line. Nothing is active before the first anchor
 * reaches it — the reader is then in the header, not in the report.
 */
export function findActiveAnchorId(anchorIds: string[]): string | undefined {
  let activeAnchorId: string | undefined
  let readingLine: number | undefined

  for (const anchorId of anchorIds) {
    const anchor = document.getElementById(anchorId)

    if (anchor === null) {
      continue
    }

    readingLine ??= findReadingLine(anchor)

    if (anchor.getBoundingClientRect().top > readingLine) {
      break
    }

    activeAnchorId = anchorId
  }

  return activeAnchorId
}

/**
 * Follows the scroll of the report so that the navigation points at what the
 * viewport shows, whether the reader got there by a click or by the wheel.
 * Listened to in capture on the window rather than on one container: the
 * scroll event does not bubble, and the frame that scrolls is not this nav's
 * business to know.
 */
export function useScrollSpy(anchorIds: () => string[]): { activeAnchorId: Ref<string | undefined> } {
  const activeAnchorId = ref<string>()

  let pendingFrame: number | undefined

  function update(): void {
    pendingFrame = undefined
    activeAnchorId.value = findActiveAnchorId(anchorIds())
  }

  /** One reading per frame, however many scroll events the frame carries. */
  function scheduleUpdate(): void {
    pendingFrame ??= requestAnimationFrame(update)
  }

  onMounted(() => {
    window.addEventListener('scroll', scheduleUpdate, { capture: true, passive: true })
    scheduleUpdate()
  })

  // A rebuilt report moves every anchor: read again where the reader stands
  watch(anchorIds, scheduleUpdate, { flush: 'post' })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', scheduleUpdate, { capture: true })

    if (pendingFrame !== undefined) {
      cancelAnimationFrame(pendingFrame)
    }
  })

  return { activeAnchorId }
}

/**
 * Distance under which an anchor is read as at rest where `scrollIntoView`
 * leaves it, and a scroll as no longer moving between two frames.
 */
const SCROLL_REST_TOLERANCE_PX = 1

/**
 * Frames a scroll may stay still, re-aimed every time, before the anchor is
 * given up as out of reach — the last sections of a report cannot be brought to
 * the top of a frame that has no more room to scroll.
 */
const MAX_STALLED_FRAMES = 10

/** Events by which the reader takes the scroll back, and ends the follow-up. */
const READER_SCROLL_EVENTS = ['wheel', 'touchstart', 'keydown'] as const

/**
 * Where the top of an anchor sits once `scrollIntoView` has brought it to rest:
 * at its `scroll-margin-top` below the top of the scrolling frame.
 */
function findRestTop(anchor: HTMLElement): number {
  const { top: frameTop } = findScrollFrameBounds(anchor)
  const scrollMarginTop = Number.parseFloat(getComputedStyle(anchor).scrollMarginTop)

  return frameTop + (Number.isNaN(scrollMarginTop) ? 0 : scrollMarginTop)
}

/**
 * Brings an anchor to the top of the frame and keeps it there. The blocks of
 * the report are laid out only as they come near the viewport
 * (`content-visibility: auto`), on an estimated height until then: a smooth
 * scroll aimed at a far anchor is aimed at where the estimate put it, and the
 * blocks it passes over push the anchor further down as they take their real
 * height. So the anchor is watched frame by frame, and aimed at again every
 * time the scroll comes to a stop short of it.
 *
 * Re-aiming every frame would not do: each call restarts the easing of the
 * smooth scroll, which then crawls. Only a scroll that has stopped is relaunched.
 *
 * The follow-up ends as soon as the reader scrolls by themselves: they are not
 * to be dragged back to a section they have left.
 */
export function useAnchorScroll(): { scrollToAnchor: (anchorId: string) => void } {
  let pendingFrame: number | undefined
  let stopFollowing: (() => void) | undefined

  function followAnchor(anchor: HTMLElement): void {
    const restTop = findRestTop(anchor)
    let previousDistance: number | undefined
    let stalledFrames = 0

    function aim(): void {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    function stop(): void {
      if (pendingFrame !== undefined) {
        cancelAnimationFrame(pendingFrame)
        pendingFrame = undefined
      }

      for (const eventName of READER_SCROLL_EVENTS) {
        window.removeEventListener(eventName, stop, { capture: true })
      }

      stopFollowing = undefined
    }

    function follow(): void {
      pendingFrame = undefined

      const distance = anchor.getBoundingClientRect().top - restTop
      const hasStalled = previousDistance !== undefined
        && Math.abs(distance - previousDistance) < SCROLL_REST_TOLERANCE_PX

      stalledFrames = hasStalled ? stalledFrames + 1 : 0
      previousDistance = distance

      const isAtRest = Math.abs(distance) < SCROLL_REST_TOLERANCE_PX

      if (isAtRest || stalledFrames >= MAX_STALLED_FRAMES) {
        stop()

        return
      }

      if (hasStalled) {
        aim()
      }

      pendingFrame = requestAnimationFrame(follow)
    }

    for (const eventName of READER_SCROLL_EVENTS) {
      window.addEventListener(eventName, stop, { capture: true, passive: true })
    }

    stopFollowing = stop
    aim()
    pendingFrame = requestAnimationFrame(follow)
  }

  function scrollToAnchor(anchorId: string): void {
    stopFollowing?.()

    const anchor = document.getElementById(anchorId)

    // A rebuild may have dropped the section between the render of the nav and the click
    if (anchor !== null) {
      followAnchor(anchor)
    }
  }

  onBeforeUnmount(() => stopFollowing?.())

  return { scrollToAnchor }
}
