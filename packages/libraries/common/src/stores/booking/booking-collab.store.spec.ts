import { createPinia, setActivePinia } from 'pinia'
import { useBookingCollabStore } from './booking-collab.store'

describe('useBookingCollabStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('initial state', () => {
    it('should have initial state', () => {
      const store = useBookingCollabStore()

      expect(store.hasBookingDrawerBeenOpened).toBe(false)
      expect(store.isBookingDrawerOpened).toBe(false)
    })
  })

  describe('bookingDrawer', () => {
    it('should open and close drawer', () => {
      const store = useBookingCollabStore()

      store.openBookingDrawer()
      expect(store.isBookingDrawerOpened).toBe(true)
      expect(store.hasBookingDrawerBeenOpened).toBe(true)

      store.closeBookingDrawer()
      expect(store.isBookingDrawerOpened).toBe(false)
      expect(store.hasBookingDrawerBeenOpened).toBe(true)
    })
  })

  describe('reset', () => {
    it('should reset all state', () => {
      const store = useBookingCollabStore()

      store.openBookingDrawer()

      store.reset()

      expect(store.hasBookingDrawerBeenOpened).toBe(false)
      expect(store.isBookingDrawerOpened).toBe(false)
    })
  })
})
