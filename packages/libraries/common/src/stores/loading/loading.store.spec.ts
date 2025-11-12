import { createPinia, setActivePinia } from 'pinia'
import { useLoadingStore } from './loading.store'

describe('useLoadingStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('initial state', () => {
    it('should have isGlobalLoading set to false initially', () => {
      const store = useLoadingStore()

      expect(store.isGlobalLoading).toBe(false)
    })
  })

  describe('startGlobalLoading', () => {
    it('should set isGlobalLoading to true', () => {
      const store = useLoadingStore()

      store.startGlobalLoading()

      expect(store.isGlobalLoading).toBe(true)
    })

    it('should set isGlobalLoading to true multiple times', () => {
      const store = useLoadingStore()

      store.startGlobalLoading()
      store.startGlobalLoading()

      expect(store.isGlobalLoading).toBe(true)
    })
  })

  describe('stopGlobalLoading', () => {
    it('should set isGlobalLoading to false', () => {
      const store = useLoadingStore()
      store.startGlobalLoading()

      store.stopGlobalLoading()

      expect(store.isGlobalLoading).toBe(false)
    })

    it('should set isLoading to false when already stopped', () => {
      const store = useLoadingStore()

      store.stopGlobalLoading()

      expect(store.isGlobalLoading).toBe(false)
    })
  })

  describe('reset', () => {
    it('should reset isGlobalLoading to false', () => {
      const store = useLoadingStore()
      store.startGlobalLoading()

      store.reset()

      expect(store.isGlobalLoading).toBe(false)
    })

    it('should reset isGlobalLoading to false when already false', () => {
      const store = useLoadingStore()

      store.reset()

      expect(store.isGlobalLoading).toBe(false)
    })
  })

  describe('loading flow', () => {
    it('should handle complete loading cycle', () => {
      const store = useLoadingStore()

      expect(store.isGlobalLoading).toBe(false)

      store.startGlobalLoading()
      expect(store.isGlobalLoading).toBe(true)

      store.stopGlobalLoading()
      expect(store.isGlobalLoading).toBe(false)
    })

    it('should handle multiple start/stop cycles', () => {
      const store = useLoadingStore()

      store.startGlobalLoading()
      expect(store.isGlobalLoading).toBe(true)

      store.stopGlobalLoading()
      expect(store.isGlobalLoading).toBe(false)

      store.startGlobalLoading()
      expect(store.isGlobalLoading).toBe(true)

      store.stopGlobalLoading()
      expect(store.isGlobalLoading).toBe(false)
    })
  })
})
