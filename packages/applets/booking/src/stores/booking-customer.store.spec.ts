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
      expect(store.getIsBookingEnabled()).toBe(false)
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
    it('should reset all state to initial values', () => {
      const store = useBookingCustomerStore()
      const mockExperts = [{ contactId: 1, fullName: 'John Doe' }]

      store.setAvailableExperts(mockExperts as any)
      store.setIsBookingEnabled(true)

      expect(store.getAvailableExperts()).toEqual(mockExperts)
      expect(store.getIsBookingEnabled()).toBe(true)

      store.reset()

      expect(store.getAvailableExperts()).toEqual([])
      expect(store.getIsBookingEnabled()).toBe(false)
    })
  })
})
