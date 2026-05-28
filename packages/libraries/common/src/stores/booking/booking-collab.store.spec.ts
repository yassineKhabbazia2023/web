import { createPinia, setActivePinia } from 'pinia'
import { useBookingCollabStore } from './booking-collab.store'

describe('useBookingCollabStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('initial state', () => {
    it('should have initial state', () => {
      const store = useBookingCollabStore()

      expect(store.hasBookingCreationDrawerBeenOpened).toBe(false)
      expect(store.isBookingCreationDrawerOpened).toBe(false)
      expect(store.isBookingEnabled).toBe(false)
      expect(store.bookingBusinessStatus).toBeNull()
    })
  })

  describe('bookingCreationDrawer', () => {
    it('should open and close drawer', () => {
      const store = useBookingCollabStore()

      store.openBookingCreationDrawer()
      expect(store.isBookingCreationDrawerOpened).toBe(true)
      expect(store.hasBookingCreationDrawerBeenOpened).toBe(true)

      store.closeBookingCreationDrawer()
      expect(store.isBookingCreationDrawerOpened).toBe(false)
      expect(store.hasBookingCreationDrawerBeenOpened).toBe(true)
    })
  })

  describe('reset', () => {
    it('should reset all state', () => {
      const store = useBookingCollabStore()

      store.openBookingCreationDrawer()
      store.setIsBookingEnabled(true)
      store.setBookingBusinessStatus({ configurationId: 123, status: 'Completed' })

      store.reset()

      expect(store.hasBookingCreationDrawerBeenOpened).toBe(false)
      expect(store.isBookingCreationDrawerOpened).toBe(false)
      expect(store.isBookingEnabled).toBe(false)
      expect(store.bookingBusinessStatus).toBeNull()
    })
  })

  describe('bookingEnabled', () => {
    it('should set booking enabled state', () => {
      const store = useBookingCollabStore()

      store.setIsBookingEnabled(true)
      expect(store.isBookingEnabled).toBe(true)

      store.setIsBookingEnabled(false)
      expect(store.isBookingEnabled).toBe(false)
    })
  })

  describe('bookingBusinessStatus', () => {
    it('should set and get booking business status', () => {
      const store = useBookingCollabStore()
      const mockStatus = { configurationId: 123, status: 'Completed' }

      store.setBookingBusinessStatus(mockStatus)
      expect(store.bookingBusinessStatus).toEqual(mockStatus)
    })

    it('should set booking business status to null', () => {
      const store = useBookingCollabStore()
      const mockStatus = { configurationId: 456, status: 'Pending' }

      store.setBookingBusinessStatus(mockStatus)
      expect(store.bookingBusinessStatus).toEqual(mockStatus)

      store.setBookingBusinessStatus(null)
      expect(store.bookingBusinessStatus).toBeNull()
    })
  })

  describe('bookingEditDrawer', () => {
    it('should open edit drawer with configuration ID', () => {
      const store = useBookingCollabStore()

      store.openBookingEditDrawer(123)

      expect(store.isBookingEditDrawerOpened).toBe(true)
      expect(store.editConfigurationId).toBe(123)
    })

    it('should close edit drawer and reset configuration ID', () => {
      const store = useBookingCollabStore()

      store.openBookingEditDrawer(456)
      expect(store.isBookingEditDrawerOpened).toBe(true)
      expect(store.editConfigurationId).toBe(456)

      store.closeBookingEditDrawer()

      expect(store.isBookingEditDrawerOpened).toBe(false)
      expect(store.editConfigurationId).toBeNull()
    })
  })
})
