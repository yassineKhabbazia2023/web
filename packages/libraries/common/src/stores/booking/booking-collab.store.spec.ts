import { createPinia, setActivePinia } from 'pinia'
import { useBookingCollabStore } from './booking-collab.store'

describe('useBookingCollabStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('initial state', () => {
    it('should have initial state', () => {
      const store = useBookingCollabStore()

      expect(store.hasConfigDrawerBeenOpened).toBe(false)
      expect(store.isConfigDrawerOpen).toBe(false)
    })
  })

  describe('configDrawer', () => {
    it('should open and close drawer', () => {
      const store = useBookingCollabStore()

      store.openConfigDrawer()
      expect(store.isConfigDrawerOpen).toBe(true)
      expect(store.hasConfigDrawerBeenOpened).toBe(true)

      store.closeConfigDrawer()
      expect(store.isConfigDrawerOpen).toBe(false)
      expect(store.hasConfigDrawerBeenOpened).toBe(true)
    })
  })

  describe('reset', () => {
    it('should reset all state', () => {
      const store = useBookingCollabStore()

      store.openConfigDrawer()

      store.reset()

      expect(store.hasConfigDrawerBeenOpened).toBe(false)
      expect(store.isConfigDrawerOpen).toBe(false)
    })
  })
})
