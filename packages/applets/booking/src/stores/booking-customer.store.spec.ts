import { createPinia, setActivePinia } from 'pinia'
import { useBookingCustomerStore } from './booking-customer.store'

describe('useBookingCustomerStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('initial state', () => {
    it('should have initial state', () => {
      const store = useBookingCustomerStore()

      expect(store.getAvailableExperts()).toEqual([])
      expect(store.isAppointmentDrawerOpen).toBe(false)
      expect(store.getIsBookingEnabled()).toBe(false)
      expect(store.hasAvailableExperts()).toBe(false)
    })
  })

  describe('availableExperts', () => {
    it('should set and get available experts', () => {
      const store = useBookingCustomerStore()
      const mockExperts = [
        { contactId: 1, fullName: 'John Doe' },
        { contactId: 2, fullName: 'Jane Smith' },
      ]

      store.setAvailableExperts(mockExperts as any)

      expect(store.getAvailableExperts()).toEqual(mockExperts)
      expect(store.hasAvailableExperts()).toBe(true)
    })
  })

  describe('appointmentDrawer', () => {
    it('should open and close drawer', () => {
      const store = useBookingCustomerStore()

      store.openAppointmentDrawer()
      expect(store.isAppointmentDrawerOpen).toBe(true)

      store.closeAppointmentDrawer()
      expect(store.isAppointmentDrawerOpen).toBe(false)
    })
  })

  describe('bookingEnabled', () => {
    it('should set booking enabled state', () => {
      const store = useBookingCustomerStore()

      store.setIsBookingEnabled(true)
      expect(store.getIsBookingEnabled()).toBe(true)

      store.setIsBookingEnabled(false)
      expect(store.getIsBookingEnabled()).toBe(false)
    })
  })

  describe('reset', () => {
    it('should reset all state', () => {
      const store = useBookingCustomerStore()
      const mockExperts = [{ contactId: 1, fullName: 'John Doe' }]

      store.setAvailableExperts(mockExperts as any)
      store.openAppointmentDrawer()
      store.setIsBookingEnabled(true)

      store.reset()

      expect(store.getAvailableExperts()).toEqual([])
      expect(store.isAppointmentDrawerOpen).toBe(false)
      expect(store.getIsBookingEnabled()).toBe(false)
    })
  })
})
