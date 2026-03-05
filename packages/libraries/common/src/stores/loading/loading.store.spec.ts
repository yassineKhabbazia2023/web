import { createPinia, setActivePinia } from 'pinia'
import { useLoadingStore } from './loading.store'

describe('useLoadingStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('initial state', () => {
    it('should have isGlobalLoading set to false initially', () => {
      const store = useLoadingStore()

      expect(store.isGlobalLoading).toBe(false)
    })

    it('should have isContentLoading set to false initially', () => {
      const store = useLoadingStore()

      expect(store.isContentLoading).toBe(false)
    })
  })

  describe('startGlobalLoading', () => {
    it('should not set isGlobalLoading to true immediately', () => {
      const store = useLoadingStore()

      store.startGlobalLoading()

      expect(store.isGlobalLoading).toBe(false)
    })

    it('should set isGlobalLoading to true after 250ms', () => {
      const store = useLoadingStore()

      store.startGlobalLoading()
      vi.advanceTimersByTime(250)

      expect(store.isGlobalLoading).toBe(true)
    })

    it('should not set isGlobalLoading to true before 250ms', () => {
      const store = useLoadingStore()

      store.startGlobalLoading()
      vi.advanceTimersByTime(249)

      expect(store.isGlobalLoading).toBe(false)
    })

    it('should not create multiple timers when called multiple times', () => {
      const store = useLoadingStore()

      store.startGlobalLoading()
      store.startGlobalLoading()
      vi.advanceTimersByTime(250)

      expect(store.isGlobalLoading).toBe(true)
    })

    it('should set isGlobalLoading to true immediately when delay is skipped', () => {
      const store = useLoadingStore()

      store.startGlobalLoading({ immediate: true })

      expect(store.isGlobalLoading).toBe(true)
    })

    it('should show loading immediately when delay is skipped after delayed start', () => {
      const store = useLoadingStore()

      store.startGlobalLoading()
      vi.advanceTimersByTime(100)

      store.startGlobalLoading({ immediate: true })

      expect(store.isGlobalLoading).toBe(true)
      vi.advanceTimersByTime(250)
      expect(store.isGlobalLoading).toBe(true)
    })
  })

  describe('stopGlobalLoading', () => {
    it('should cancel the timer and not show loading if stopped before 250ms', () => {
      const store = useLoadingStore()

      store.startGlobalLoading()
      vi.advanceTimersByTime(100)
      store.stopGlobalLoading()
      vi.advanceTimersByTime(200)

      expect(store.isGlobalLoading).toBe(false)
    })

    it('should set isGlobalLoading to false after it was shown', () => {
      const store = useLoadingStore()

      store.startGlobalLoading()
      vi.advanceTimersByTime(250)
      expect(store.isGlobalLoading).toBe(true)

      store.stopGlobalLoading()

      expect(store.isGlobalLoading).toBe(false)
    })

    it('should not throw when already stopped', () => {
      const store = useLoadingStore()

      store.stopGlobalLoading()

      expect(store.isGlobalLoading).toBe(false)
    })
  })

  describe('startContentLoading', () => {
    it('should not set isContentLoading to true immediately', () => {
      const store = useLoadingStore()

      store.startContentLoading()

      expect(store.isContentLoading).toBe(false)
    })

    it('should set isContentLoading to true after 250ms', () => {
      const store = useLoadingStore()

      store.startContentLoading()
      vi.advanceTimersByTime(250)

      expect(store.isContentLoading).toBe(true)
    })

    it('should not set isContentLoading to true before 250ms', () => {
      const store = useLoadingStore()

      store.startContentLoading()
      vi.advanceTimersByTime(249)

      expect(store.isContentLoading).toBe(false)
    })

    it('should not create multiple timers when called multiple times', () => {
      const store = useLoadingStore()

      store.startContentLoading()
      store.startContentLoading()
      vi.advanceTimersByTime(250)

      expect(store.isContentLoading).toBe(true)
    })
  })

  describe('stopContentLoading', () => {
    it('should cancel the timer and not show loading if stopped before 250ms', () => {
      const store = useLoadingStore()

      store.startContentLoading()
      vi.advanceTimersByTime(100)
      store.stopContentLoading()
      vi.advanceTimersByTime(200)

      expect(store.isContentLoading).toBe(false)
    })

    it('should set isContentLoading to false after it was shown', () => {
      const store = useLoadingStore()

      store.startContentLoading()
      vi.advanceTimersByTime(250)
      expect(store.isContentLoading).toBe(true)

      store.stopContentLoading()

      expect(store.isContentLoading).toBe(false)
    })

    it('should not throw when already stopped', () => {
      const store = useLoadingStore()

      store.stopContentLoading()

      expect(store.isContentLoading).toBe(false)
    })
  })

  describe('reset', () => {
    it('should reset isGlobalLoading to false', () => {
      const store = useLoadingStore()
      store.startGlobalLoading()
      vi.advanceTimersByTime(250)

      store.reset()

      expect(store.isGlobalLoading).toBe(false)
    })

    it('should reset isContentLoading to false', () => {
      const store = useLoadingStore()
      store.startContentLoading()
      vi.advanceTimersByTime(250)

      store.reset()

      expect(store.isContentLoading).toBe(false)
    })

    it('should cancel pending timers', () => {
      const store = useLoadingStore()
      store.startGlobalLoading()
      store.startContentLoading()

      store.reset()
      vi.advanceTimersByTime(250)

      expect(store.isGlobalLoading).toBe(false)
      expect(store.isContentLoading).toBe(false)
    })

    it('should reset all loading states when already false', () => {
      const store = useLoadingStore()

      store.reset()

      expect(store.isGlobalLoading).toBe(false)
      expect(store.isContentLoading).toBe(false)
    })
  })

  describe('loading flow', () => {
    it('should handle complete loading cycle', () => {
      const store = useLoadingStore()

      expect(store.isGlobalLoading).toBe(false)

      store.startGlobalLoading()
      vi.advanceTimersByTime(250)
      expect(store.isGlobalLoading).toBe(true)

      store.stopGlobalLoading()
      expect(store.isGlobalLoading).toBe(false)
    })

    it('should handle multiple start/stop cycles', () => {
      const store = useLoadingStore()

      store.startGlobalLoading()
      vi.advanceTimersByTime(250)
      expect(store.isGlobalLoading).toBe(true)

      store.stopGlobalLoading()
      expect(store.isGlobalLoading).toBe(false)

      store.startGlobalLoading()
      vi.advanceTimersByTime(250)
      expect(store.isGlobalLoading).toBe(true)

      store.stopGlobalLoading()
      expect(store.isGlobalLoading).toBe(false)
    })

    it('should handle content and global loading independently', () => {
      const store = useLoadingStore()

      store.startGlobalLoading()
      store.startContentLoading()
      vi.advanceTimersByTime(250)
      expect(store.isGlobalLoading).toBe(true)
      expect(store.isContentLoading).toBe(true)

      store.stopGlobalLoading()
      expect(store.isGlobalLoading).toBe(false)
      expect(store.isContentLoading).toBe(true)

      store.stopContentLoading()
      expect(store.isContentLoading).toBe(false)
    })

    it('should not show loading when operation completes within 250ms', () => {
      const store = useLoadingStore()

      store.startGlobalLoading()
      vi.advanceTimersByTime(200)
      store.stopGlobalLoading()

      expect(store.isGlobalLoading).toBe(false)
    })
  })
})
