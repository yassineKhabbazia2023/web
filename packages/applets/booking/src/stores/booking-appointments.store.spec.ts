import { createPinia, setActivePinia } from 'pinia'
import { useBookingAppointmentsStore } from './booking-appointments.store'
import { BookingService } from '../services/booking.service'
import type { AppointmentResponse } from '../types/booking.types'

vi.mock('../services/booking.service')

const mockAppointments: AppointmentResponse[] = [
  {
    id: 1,
    startDateTime: '2026-03-20T10:00:00',
    endDateTime: '2026-03-20T11:00:00',
    subject: 'Meeting with client',
    counterpartName: 'Jean Dupont',
    isOnlineMeeting: true,
    joinWebUrl: 'https://teams.microsoft.com/meeting/123',
    locationName: null,
  },
  {
    id: 2,
    startDateTime: '2026-03-21T14:00:00',
    endDateTime: '2026-03-21T15:00:00',
    subject: 'Follow-up call',
    counterpartName: 'Marie Martin',
    isOnlineMeeting: false,
    joinWebUrl: null,
    locationName: 'Office Paris',
  },
]

describe('useBookingAppointmentsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('should have initial state', () => {
      const store = useBookingAppointmentsStore()

      expect(store.upcomingAppointments).toEqual([])
      expect(store.pastAppointments).toEqual([])
      expect(store.upcomingAppointmentsCount).toBe(0)
      expect(store.hasUpcomingAppointments).toBe(false)
      expect(store.isLoadingUpcomingAppointments).toBe(false)
      expect(store.isLoadingPastAppointments).toBe(false)
      expect(store.isBookingAppointmentDrawerOpen).toBe(false)
      expect(store.isBookingAppointmentsListDrawerOpen).toBe(false)
    })
  })

  describe('fetchUpcomingAppointments', () => {
    it('should fetch upcoming appointments successfully', async () => {
      const store = useBookingAppointmentsStore()
      vi.mocked(BookingService.getUpcomingAppointments).mockResolvedValue(mockAppointments)

      await store.fetchUpcomingAppointments()

      expect(BookingService.getUpcomingAppointments).toHaveBeenCalledWith(10)
      expect(store.upcomingAppointments).toEqual(mockAppointments)
      expect(store.isLoadingUpcomingAppointments).toBe(false)
    })

    it('should fetch upcoming appointments with custom limit', async () => {
      const store = useBookingAppointmentsStore()
      vi.mocked(BookingService.getUpcomingAppointments).mockResolvedValue(mockAppointments)

      await store.fetchUpcomingAppointments(5)

      expect(BookingService.getUpcomingAppointments).toHaveBeenCalledWith(5)
      expect(store.upcomingAppointments).toEqual(mockAppointments)
    })

    it('should handle fetch upcoming appointments error', async () => {
      const store = useBookingAppointmentsStore()
      const error = new Error('Network error')
      vi.mocked(BookingService.getUpcomingAppointments).mockRejectedValue(error)

      await store.fetchUpcomingAppointments()

      expect(store.upcomingAppointments).toEqual([])
      expect(store.isLoadingUpcomingAppointments).toBe(false)
    })

    it('should set loading state while fetching', async () => {
      const store = useBookingAppointmentsStore()
      vi.mocked(BookingService.getUpcomingAppointments).mockImplementation(
        () => new Promise((resolve) => {
          expect(store.isLoadingUpcomingAppointments).toBe(true)
          setTimeout(() => resolve(mockAppointments), 10)
        }),
      )

      await store.fetchUpcomingAppointments()

      expect(store.isLoadingUpcomingAppointments).toBe(false)
    })
  })

  describe('fetchPastAppointments', () => {
    it('should fetch past appointments successfully', async () => {
      const store = useBookingAppointmentsStore()
      vi.mocked(BookingService.getPastAppointments).mockResolvedValue(mockAppointments)

      await store.fetchPastAppointments()

      expect(BookingService.getPastAppointments).toHaveBeenCalledWith(6)
      expect(store.pastAppointments).toEqual(mockAppointments)
      expect(store.isLoadingPastAppointments).toBe(false)
    })

    it('should fetch past appointments with custom limit', async () => {
      const store = useBookingAppointmentsStore()
      vi.mocked(BookingService.getPastAppointments).mockResolvedValue(mockAppointments)

      await store.fetchPastAppointments(10)

      expect(BookingService.getPastAppointments).toHaveBeenCalledWith(10)
      expect(store.pastAppointments).toEqual(mockAppointments)
    })

    it('should handle fetch past appointments error', async () => {
      const store = useBookingAppointmentsStore()
      const error = new Error('Network error')
      vi.mocked(BookingService.getPastAppointments).mockRejectedValue(error)

      await store.fetchPastAppointments()

      expect(store.pastAppointments).toEqual([])
      expect(store.isLoadingPastAppointments).toBe(false)
    })

    it('should set loading state while fetching', async () => {
      const store = useBookingAppointmentsStore()
      vi.mocked(BookingService.getPastAppointments).mockImplementation(
        () => new Promise((resolve) => {
          expect(store.isLoadingPastAppointments).toBe(true)
          setTimeout(() => resolve(mockAppointments), 10)
        }),
      )

      await store.fetchPastAppointments()

      expect(store.isLoadingPastAppointments).toBe(false)
    })
  })

  describe('fetchUpcomingAppointmentsCount', () => {
    it('should fetch upcoming appointments count successfully', async () => {
      const store = useBookingAppointmentsStore()
      vi.mocked(BookingService.getUpcomingAppointmentsCount).mockResolvedValue(5)

      await store.fetchUpcomingAppointmentsCount()

      expect(BookingService.getUpcomingAppointmentsCount).toHaveBeenCalled()
      expect(store.upcomingAppointmentsCount).toBe(5)
      expect(store.hasUpcomingAppointments).toBe(true)
    })

    it('should handle fetch count error', async () => {
      const store = useBookingAppointmentsStore()
      const error = new Error('Network error')
      vi.mocked(BookingService.getUpcomingAppointmentsCount).mockRejectedValue(error)

      await store.fetchUpcomingAppointmentsCount()

      expect(store.upcomingAppointmentsCount).toBe(0)
      expect(store.hasUpcomingAppointments).toBe(false)
    })
  })

  describe('hasUpcomingAppointments', () => {
    it('should return false when count is 0', () => {
      const store = useBookingAppointmentsStore()

      expect(store.hasUpcomingAppointments).toBe(false)
    })

    it('should return true when count is greater than 0', async () => {
      const store = useBookingAppointmentsStore()
      vi.mocked(BookingService.getUpcomingAppointmentsCount).mockResolvedValue(3)

      await store.fetchUpcomingAppointmentsCount()

      expect(store.hasUpcomingAppointments).toBe(true)
    })
  })

  describe('reset', () => {
    it('should reset all state to initial values', async () => {
      const store = useBookingAppointmentsStore()
      vi.mocked(BookingService.getUpcomingAppointments).mockResolvedValue(mockAppointments)
      vi.mocked(BookingService.getPastAppointments).mockResolvedValue(mockAppointments)
      vi.mocked(BookingService.getUpcomingAppointmentsCount).mockResolvedValue(5)

      await store.fetchUpcomingAppointments()
      await store.fetchPastAppointments()
      await store.fetchUpcomingAppointmentsCount()
      store.openBookingAppointmentDrawer()
      store.openBookingAppointmentsListDrawer()

      expect(store.upcomingAppointments).toEqual(mockAppointments)
      expect(store.pastAppointments).toEqual(mockAppointments)
      expect(store.upcomingAppointmentsCount).toBe(5)
      expect(store.isBookingAppointmentDrawerOpen).toBe(true)
      expect(store.isBookingAppointmentsListDrawerOpen).toBe(true)

      store.reset()

      expect(store.upcomingAppointments).toEqual([])
      expect(store.pastAppointments).toEqual([])
      expect(store.upcomingAppointmentsCount).toBe(0)
      expect(store.isLoadingUpcomingAppointments).toBe(false)
      expect(store.isLoadingPastAppointments).toBe(false)
      expect(store.isBookingAppointmentDrawerOpen).toBe(false)
      expect(store.isBookingAppointmentsListDrawerOpen).toBe(false)
    })
  })

  describe('drawers', () => {
    it('should open and close appointment drawer', () => {
      const store = useBookingAppointmentsStore()

      store.openBookingAppointmentDrawer()
      expect(store.isBookingAppointmentDrawerOpen).toBe(true)

      store.closeBookingAppointmentDrawer()
      expect(store.isBookingAppointmentDrawerOpen).toBe(false)
    })

    it('should open and close appointments drawer', () => {
      const store = useBookingAppointmentsStore()

      store.openBookingAppointmentsListDrawer()
      expect(store.isBookingAppointmentsListDrawerOpen).toBe(true)

      store.closeBookingAppointmentsListDrawer()
      expect(store.isBookingAppointmentsListDrawerOpen).toBe(false)
    })
  })
})
