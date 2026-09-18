import { flushPromises } from '@vue/test-utils'
import { withSetup } from '@pulse/toolbox/utils/test'
import { findActiveAnchorId, useAnchorScroll, useScrollSpy } from './nav.composable'

/**
 * Anchors laid in the document at the given tops, inside a 500px-high scrolling
 * frame at `frameTop` — its reading line therefore sits 150px below its top.
 */
function mountAnchors(tops: Record<string, number>, frameTop = 0): HTMLElement {
  const frame = document.createElement('div')
  frame.style.overflowY = 'auto'
  Object.defineProperty(frame, 'scrollHeight', { value: 2000 })
  Object.defineProperty(frame, 'clientHeight', { value: 500 })
  frame.getBoundingClientRect = () => ({ top: frameTop, height: 500 } as DOMRect)

  for (const [id, top] of Object.entries(tops)) {
    const anchor = document.createElement('section')
    anchor.id = id
    anchor.getBoundingClientRect = () => ({ top } as DOMRect)
    frame.appendChild(anchor)
  }

  document.body.appendChild(frame)

  return frame
}

let frame: HTMLElement | undefined

afterEach(() => {
  frame?.remove()
  frame = undefined
})

describe('findActiveAnchorId', () => {
  it('should return undefined when no anchor has reached the reading line', () => {
    frame = mountAnchors({ a: 300, b: 600 })

    expect(findActiveAnchorId(['a', 'b'])).toBeUndefined()
  })

  it('should return the last anchor that has gone past the reading line', () => {
    frame = mountAnchors({ a: -200, b: 10, c: 400 })

    expect(findActiveAnchorId(['a', 'b', 'c'])).toBe('b')
  })

  it('should count an anchor still below the top of the frame as reached once past 30% of its height', () => {
    frame = mountAnchors({ a: -200, b: 150, c: 151 })

    expect(findActiveAnchorId(['a', 'b', 'c'])).toBe('b')
  })

  it('should measure the reading line from the top of the scrolling frame', () => {
    frame = mountAnchors({ a: -200, b: 250, c: 251 }, 100)

    expect(findActiveAnchorId(['a', 'b', 'c'])).toBe('b')
  })

  it('should skip anchors missing from the document', () => {
    frame = mountAnchors({ a: -200 })

    expect(findActiveAnchorId(['missing', 'a', 'other-missing'])).toBe('a')
  })
})

describe('useScrollSpy', () => {
  beforeEach(() => {
    // Asynchronous like the real one: a frame never runs before it is requested
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      queueMicrotask(() => callback(0))
      return 1
    })
    vi.stubGlobal('cancelAnimationFrame', vi.fn())
  })

  it('should read the active anchor on mount', async () => {
    frame = mountAnchors({ a: -50, b: 300 })

    const [{ activeAnchorId }] = withSetup(() => useScrollSpy(() => ['a', 'b']))
    await flushPromises()

    expect(activeAnchorId.value).toBe('a')
  })

  it('should follow the scroll', async () => {
    frame = mountAnchors({ a: -50, b: 300 })
    const [{ activeAnchorId }] = withSetup(() => useScrollSpy(() => ['a', 'b']))
    await flushPromises()

    frame.querySelector('#b')!.getBoundingClientRect = () => ({ top: 0 } as DOMRect)
    frame.dispatchEvent(new Event('scroll'))
    await flushPromises()

    expect(activeAnchorId.value).toBe('b')
  })

  it('should read again when the anchors change', async () => {
    frame = mountAnchors({ a: -50, b: -20 })
    const ids = { value: ['a'] }
    const [{ activeAnchorId }] = withSetup(() => useScrollSpy(() => ids.value))
    await flushPromises()

    expect(activeAnchorId.value).toBe('a')

    ids.value = ['a', 'b']
    // the getter is not reactive on its own: a scroll is what re-reads it here
    frame.dispatchEvent(new Event('scroll'))
    await flushPromises()

    expect(activeAnchorId.value).toBe('b')
  })

  it('should stop listening once unmounted', async () => {
    frame = mountAnchors({ a: -50, b: 300 })
    const [{ activeAnchorId }, app] = withSetup(() => useScrollSpy(() => ['a', 'b']))
    await flushPromises()

    app.unmount()
    frame.querySelector('#b')!.getBoundingClientRect = () => ({ top: 0 } as DOMRect)
    frame.dispatchEvent(new Event('scroll'))
    await flushPromises()

    expect(activeAnchorId.value).toBe('a')
  })
})

describe('useAnchorScroll', () => {
  let frames: Map<number, FrameRequestCallback>
  let scrollIntoView: ReturnType<typeof vi.fn<Element['scrollIntoView']>>

  /** Runs the frames requested so far; the ones they request wait for the next call. */
  function runFrame(): void {
    const dueFrames = [...frames.values()]
    frames = new Map()
    dueFrames.forEach(callback => callback(0))
  }

  function placeAnchor(top: number): void {
    frame!.querySelector('#a')!.getBoundingClientRect = () => ({ top } as DOMRect)
  }

  beforeEach(() => {
    frames = new Map()
    let nextFrameId = 1
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      frames.set(nextFrameId, callback)

      return nextFrameId++
    })
    vi.stubGlobal('cancelAnimationFrame', vi.fn((frameId: number) => frames.delete(frameId)))
    scrollIntoView = vi.fn<Element['scrollIntoView']>()
    Element.prototype.scrollIntoView = scrollIntoView
  })

  it('should scroll the anchor into view', () => {
    frame = mountAnchors({ a: 3000 })
    const [{ scrollToAnchor }] = withSetup(() => useAnchorScroll())

    scrollToAnchor('a')

    expect(scrollIntoView).toHaveBeenCalledExactlyOnceWith({ behavior: 'smooth', block: 'start' })
  })

  it('should not scroll when the anchor is missing from the document', () => {
    frame = mountAnchors({ a: 3000 })
    const [{ scrollToAnchor }] = withSetup(() => useAnchorScroll())

    scrollToAnchor('missing')

    expect(scrollIntoView).not.toHaveBeenCalled()
    expect(frames.size).toBe(0)
  })

  it('should leave a moving scroll alone', () => {
    frame = mountAnchors({ a: 3000 })
    const [{ scrollToAnchor }] = withSetup(() => useAnchorScroll())
    scrollToAnchor('a')

    placeAnchor(2500)
    runFrame()
    placeAnchor(2000)
    runFrame()

    expect(scrollIntoView).toHaveBeenCalledTimes(1)
    expect(frames.size).toBe(1)
  })

  it('should aim again when the scroll stops short of the anchor', () => {
    frame = mountAnchors({ a: 3000 })
    const [{ scrollToAnchor }] = withSetup(() => useAnchorScroll())
    scrollToAnchor('a')

    // the blocks passed over took their real height: the anchor stands 1000px further
    placeAnchor(1000)
    runFrame()
    runFrame()

    expect(scrollIntoView).toHaveBeenCalledTimes(2)
  })

  it('should stop watching once the anchor is at rest', () => {
    frame = mountAnchors({ a: 3000 })
    const [{ scrollToAnchor }] = withSetup(() => useAnchorScroll())
    scrollToAnchor('a')

    placeAnchor(0)
    runFrame()

    expect(frames.size).toBe(0)
  })

  it('should give up an anchor the frame cannot bring to its top', () => {
    frame = mountAnchors({ a: 3000 })
    const [{ scrollToAnchor }] = withSetup(() => useAnchorScroll())
    scrollToAnchor('a')

    placeAnchor(200)
    for (let index = 0; index < 20; index++) {
      runFrame()
    }

    expect(frames.size).toBe(0)
    expect(scrollIntoView.mock.calls.length).toBeLessThan(20)
  })

  it('should stop watching when the reader scrolls by themselves', () => {
    frame = mountAnchors({ a: 3000 })
    const [{ scrollToAnchor }] = withSetup(() => useAnchorScroll())
    scrollToAnchor('a')

    window.dispatchEvent(new Event('wheel'))
    placeAnchor(1000)
    runFrame()
    runFrame()

    expect(cancelAnimationFrame).toHaveBeenCalled()
    expect(scrollIntoView).toHaveBeenCalledTimes(1)
  })

  it('should stop watching once unmounted', () => {
    frame = mountAnchors({ a: 3000 })
    const [{ scrollToAnchor }, app] = withSetup(() => useAnchorScroll())
    scrollToAnchor('a')

    app.unmount()

    expect(cancelAnimationFrame).toHaveBeenCalled()
  })
})
