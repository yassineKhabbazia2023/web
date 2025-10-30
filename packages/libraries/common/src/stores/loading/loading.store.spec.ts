import { createPinia, setActivePinia } from 'pinia'
import { useLoadingStore } from './loading.store'

describe('useLoadingStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('initial state', () => {
    it('should have isLoading set to false initially', () => {
      const store = useLoadingStore()

      expect(store.isLoading).toBe(false)
    })
  })

  describe('startLoading', () => {
    it('should set isLoading to true', () => {
      const store = useLoadingStore()

      store.startLoading()

      expect(store.isLoading).toBe(true)
    })

    it('should set isLoading to true multiple times', () => {
      const store = useLoadingStore()

      store.startLoading()
      store.startLoading()

      expect(store.isLoading).toBe(true)
    })
  })

  describe('stopLoading', () => {
    it('should set isLoading to false', () => {
      const store = useLoadingStore()
      store.startLoading()

      store.stopLoading()

      expect(store.isLoading).toBe(false)
    })

    it('should set isLoading to false when already stopped', () => {
      const store = useLoadingStore()

      store.stopLoading()

      expect(store.isLoading).toBe(false)
    })
  })

  describe('reset', () => {
    it('should reset isLoading to false', () => {
      const store = useLoadingStore()
      store.startLoading()

      store.reset()

      expect(store.isLoading).toBe(false)
    })

    it('should reset isLoading to false when already false', () => {
      const store = useLoadingStore()

      store.reset()

      expect(store.isLoading).toBe(false)
    })
  })

  describe('loading flow', () => {
    it('should handle complete loading cycle', () => {
      const store = useLoadingStore()

      expect(store.isLoading).toBe(false)

      store.startLoading()
      expect(store.isLoading).toBe(true)

      store.stopLoading()
      expect(store.isLoading).toBe(false)
    })

    it('should handle multiple start/stop cycles', () => {
      const store = useLoadingStore()

      store.startLoading()
      expect(store.isLoading).toBe(true)

      store.stopLoading()
      expect(store.isLoading).toBe(false)

      store.startLoading()
      expect(store.isLoading).toBe(true)

      store.stopLoading()
      expect(store.isLoading).toBe(false)
    })
  })
})
