import { createPinia, setActivePinia } from 'pinia'
import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBookingQueryParams } from './use-booking-query-params.composable'
import { useBookingAppointmentsStore, useBookingCustomerStore } from '@booking/stores'
import {
  BOOKING_QUERY_PARAM_WIDGET,
  BOOKING_QUERY_PARAM_COLLABORATOR_ID,
} from '@booking/constants'

const mockRoute = {
  query: {} as Record<string, string | string[] | undefined>,
}

const mockReplace = vi.fn()
const mockRouter = {
  replace: mockReplace,
}

describe('useBookingQueryParams', () => {
  let pinia: ReturnType<typeof createPinia>

  beforeEach(() => {
    // Shared vue-router spies are armed per test (doctrine: shared-hubs).
    vi.mocked(useRoute).mockReturnValue(mockRoute as unknown as ReturnType<typeof useRoute>)
    vi.mocked(useRouter).mockReturnValue(mockRouter as unknown as ReturnType<typeof useRouter>)
    pinia = createPinia()
    setActivePinia(pinia)
    mockRoute.query = {}
    mockReplace.mockClear()
  })

  // Helper to mount the composable in a component
  function mountComposable() {
    const TestComponent = defineComponent({
      setup() {
        useBookingQueryParams()
        return () => h('div')
      },
    })

    return mount(TestComponent, {
      global: {
        plugins: [pinia],
      },
    })
  }

  describe('hasBookingQueryParams', () => {
    it('should return true when bookingWidget query param is "true"', async () => {
      mockRoute.query = { [BOOKING_QUERY_PARAM_WIDGET]: 'true' }

      const customerStore = useBookingCustomerStore()
      customerStore.setIsBookingEnabled(true)

      mountComposable()
      await flushPromises()

      const appointmentsStore = useBookingAppointmentsStore()

      // The drawer should have been opened, meaning hasBookingQueryParams returned true
      expect(appointmentsStore.isBookingAppointmentDrawerOpen).toBe(true)
    })

    it('should return false when bookingWidget query param is not "true"', () => {
      mockRoute.query = { [BOOKING_QUERY_PARAM_WIDGET]: 'false' }

      const customerStore = useBookingCustomerStore()
      customerStore.setIsBookingEnabled(true)

      mountComposable()

      const appointmentsStore = useBookingAppointmentsStore()

      // The drawer should not have been opened, meaning hasBookingQueryParams returned false
      expect(appointmentsStore.isBookingAppointmentDrawerOpen).toBe(false)
    })

    it('should return false when bookingWidget query param is missing', () => {
      mockRoute.query = {}

      const customerStore = useBookingCustomerStore()
      customerStore.setIsBookingEnabled(true)

      mountComposable()

      const appointmentsStore = useBookingAppointmentsStore()

      // The drawer should not have been opened
      expect(appointmentsStore.isBookingAppointmentDrawerOpen).toBe(false)
    })
  })

  describe('clearBookingQueryParams', () => {
    it('should remove bookingWidget and collaboratorId from query params', async () => {
      mockRoute.query = {
        [BOOKING_QUERY_PARAM_WIDGET]: 'true',
        [BOOKING_QUERY_PARAM_COLLABORATOR_ID]: '123',
        otherParam: 'value',
      }

      const customerStore = useBookingCustomerStore()
      customerStore.setIsBookingEnabled(true)

      mountComposable()

      const appointmentsStore = useBookingAppointmentsStore()
      await flushPromises()

      // Close the drawer to trigger clearBookingQueryParams
      appointmentsStore.closeBookingAppointmentDrawer()
      await flushPromises()

      expect(mockReplace).toHaveBeenCalledWith({
        query: { otherParam: 'value' },
      })
    })

    it('should not call router.replace when no booking query params exist', async () => {
      mockRoute.query = { otherParam: 'value' }

      const customerStore = useBookingCustomerStore()
      customerStore.setIsBookingEnabled(true)

      mountComposable()

      const appointmentsStore = useBookingAppointmentsStore()

      // Close the drawer
      appointmentsStore.closeBookingAppointmentDrawer()
      await flushPromises()

      // router.replace should not be called since there are no booking params
      expect(mockReplace).not.toHaveBeenCalled()
    })

    it('should keep other query params intact when clearing booking params', async () => {
      mockRoute.query = {
        [BOOKING_QUERY_PARAM_WIDGET]: 'true',
        keepThis: 'value1',
        andThis: 'value2',
      }

      const customerStore = useBookingCustomerStore()
      customerStore.setIsBookingEnabled(true)

      mountComposable()

      const appointmentsStore = useBookingAppointmentsStore()
      await flushPromises()

      // Close the drawer to trigger clearBookingQueryParams
      appointmentsStore.closeBookingAppointmentDrawer()
      await flushPromises()

      expect(mockReplace).toHaveBeenCalledWith({
        query: { keepThis: 'value1', andThis: 'value2' },
      })
    })
  })

  describe('handleBookingQueryParams', () => {
    it('should not open drawer when booking is disabled', () => {
      mockRoute.query = { [BOOKING_QUERY_PARAM_WIDGET]: 'true' }

      const customerStore = useBookingCustomerStore()
      customerStore.setIsBookingEnabled(false)

      mountComposable()

      const appointmentsStore = useBookingAppointmentsStore()

      expect(appointmentsStore.isBookingAppointmentDrawerOpen).toBe(false)
    })

    it('should not open drawer when no booking query params exist', () => {
      mockRoute.query = {}

      const customerStore = useBookingCustomerStore()
      customerStore.setIsBookingEnabled(true)

      mountComposable()

      const appointmentsStore = useBookingAppointmentsStore()

      expect(appointmentsStore.isBookingAppointmentDrawerOpen).toBe(false)
    })

    it('should not open drawer when drawer is already open', () => {
      mockRoute.query = { [BOOKING_QUERY_PARAM_WIDGET]: 'true' }

      const customerStore = useBookingCustomerStore()
      customerStore.setIsBookingEnabled(true)

      const appointmentsStore = useBookingAppointmentsStore()
      appointmentsStore.isBookingAppointmentDrawerOpen = true

      const openSpy = vi.spyOn(appointmentsStore, 'openBookingAppointmentDrawer')

      mountComposable()

      expect(openSpy).not.toHaveBeenCalled()
    })

    it('should open drawer without collaborator when no collaboratorId param exists', async () => {
      mockRoute.query = { [BOOKING_QUERY_PARAM_WIDGET]: 'true' }

      const customerStore = useBookingCustomerStore()
      customerStore.setIsBookingEnabled(true)

      const appointmentsStore = useBookingAppointmentsStore()
      const openSpy = vi.spyOn(appointmentsStore, 'openBookingAppointmentDrawer')

      mountComposable()
      await flushPromises()

      expect(openSpy).toHaveBeenCalledExactlyOnceWith(undefined)
    })

    it('should open drawer with collaborator when valid collaboratorId param exists', async () => {
      mockRoute.query = {
        [BOOKING_QUERY_PARAM_WIDGET]: 'true',
        [BOOKING_QUERY_PARAM_COLLABORATOR_ID]: '42',
      }

      const customerStore = useBookingCustomerStore()
      customerStore.setIsBookingEnabled(true)

      const appointmentsStore = useBookingAppointmentsStore()
      const openSpy = vi.spyOn(appointmentsStore, 'openBookingAppointmentDrawer')

      mountComposable()
      await flushPromises()

      expect(openSpy).toHaveBeenCalledExactlyOnceWith(42)
    })

    it('should open drawer without collaborator when collaboratorId is not a valid number', async () => {
      mockRoute.query = {
        [BOOKING_QUERY_PARAM_WIDGET]: 'true',
        [BOOKING_QUERY_PARAM_COLLABORATOR_ID]: 'invalid',
      }

      const customerStore = useBookingCustomerStore()
      customerStore.setIsBookingEnabled(true)

      const appointmentsStore = useBookingAppointmentsStore()
      const openSpy = vi.spyOn(appointmentsStore, 'openBookingAppointmentDrawer')

      mountComposable()
      await flushPromises()

      expect(openSpy).toHaveBeenCalledExactlyOnceWith(undefined)
      expect(openSpy).toHaveBeenCalledWith(undefined)
    })

    it('should extract first value when collaboratorId is an array', async () => {
      mockRoute.query = {
        [BOOKING_QUERY_PARAM_WIDGET]: 'true',
        [BOOKING_QUERY_PARAM_COLLABORATOR_ID]: ['42', '43'],
      }

      const customerStore = useBookingCustomerStore()
      customerStore.setIsBookingEnabled(true)

      const appointmentsStore = useBookingAppointmentsStore()
      const openSpy = vi.spyOn(appointmentsStore, 'openBookingAppointmentDrawer')

      mountComposable()
      await flushPromises()

      expect(openSpy).toHaveBeenCalledExactlyOnceWith(42)
    })

    it('should parse collaboratorId as integer', async () => {
      mockRoute.query = {
        [BOOKING_QUERY_PARAM_WIDGET]: 'true',
        [BOOKING_QUERY_PARAM_COLLABORATOR_ID]: '123',
      }

      const customerStore = useBookingCustomerStore()
      customerStore.setIsBookingEnabled(true)

      const appointmentsStore = useBookingAppointmentsStore()
      const openSpy = vi.spyOn(appointmentsStore, 'openBookingAppointmentDrawer')

      mountComposable()
      await flushPromises()

      expect(openSpy).toHaveBeenCalledWith(123)
    })

    it('should reject partial number strings like "123abc"', async () => {
      mockRoute.query = {
        [BOOKING_QUERY_PARAM_WIDGET]: 'true',
        [BOOKING_QUERY_PARAM_COLLABORATOR_ID]: '123abc',
      }

      const customerStore = useBookingCustomerStore()
      customerStore.setIsBookingEnabled(true)

      const appointmentsStore = useBookingAppointmentsStore()
      const openSpy = vi.spyOn(appointmentsStore, 'openBookingAppointmentDrawer')

      mountComposable()
      await flushPromises()

      expect(openSpy).toHaveBeenCalledWith(undefined)
    })
  })

  describe('watcher on isBookingAppointmentDrawerOpen', () => {
    it('should clear query params when drawer closes after being opened via URL params', async () => {
      mockRoute.query = { [BOOKING_QUERY_PARAM_WIDGET]: 'true' }

      const customerStore = useBookingCustomerStore()
      customerStore.setIsBookingEnabled(true)

      mountComposable()

      const appointmentsStore = useBookingAppointmentsStore()
      await flushPromises()

      // Drawer should be open now
      expect(appointmentsStore.isBookingAppointmentDrawerOpen).toBe(true)

      // Close the drawer
      appointmentsStore.closeBookingAppointmentDrawer()
      await flushPromises()

      // Query params should be cleared
      expect(mockReplace).toHaveBeenCalledWith({ query: {} })
    })

    it('should not clear query params when drawer closes if no booking params exist', async () => {
      mockRoute.query = {}

      const customerStore = useBookingCustomerStore()
      customerStore.setIsBookingEnabled(true)

      mountComposable()

      const appointmentsStore = useBookingAppointmentsStore()
      await flushPromises()

      // Manually open the drawer (not via URL params)
      appointmentsStore.openBookingAppointmentDrawer()
      await flushPromises()

      // Close the drawer
      appointmentsStore.closeBookingAppointmentDrawer()
      await flushPromises()

      // router.replace should not be called since there are no booking params to clear
      expect(mockReplace).not.toHaveBeenCalled()
    })

    it('should clear query params on every drawer close when booking params exist', async () => {
      mockRoute.query = { [BOOKING_QUERY_PARAM_WIDGET]: 'true' }

      const customerStore = useBookingCustomerStore()
      customerStore.setIsBookingEnabled(true)

      mountComposable()

      const appointmentsStore = useBookingAppointmentsStore()
      await flushPromises()

      // First close - params should be cleared
      appointmentsStore.closeBookingAppointmentDrawer()
      await flushPromises()

      expect(mockReplace).toHaveBeenCalledWith({ query: {} })
      mockReplace.mockClear()

      // Simulate that query was actually cleared (in real scenario, route.query would be updated by router)
      mockRoute.query = {}

      // Open again manually
      appointmentsStore.openBookingAppointmentDrawer()
      await flushPromises()

      // Close again - no params to clear this time
      appointmentsStore.closeBookingAppointmentDrawer()
      await flushPromises()

      // router.replace should NOT be called since no booking params exist
      expect(mockReplace).not.toHaveBeenCalled()
    })

    it('should not do anything when drawer opens', async () => {
      mockRoute.query = {}

      const customerStore = useBookingCustomerStore()
      customerStore.setIsBookingEnabled(true)

      mountComposable()

      const appointmentsStore = useBookingAppointmentsStore()
      await flushPromises()

      // Manually open the drawer
      appointmentsStore.openBookingAppointmentDrawer()
      await flushPromises()

      // No router.replace should be called when opening
      expect(mockReplace).not.toHaveBeenCalled()
    })
  })

  describe('reactive watcher on isBookingEnabled', () => {
    it('should automatically call handleBookingQueryParams when booking becomes enabled', async () => {
      mockRoute.query = { [BOOKING_QUERY_PARAM_WIDGET]: 'true' }

      const customerStore = useBookingCustomerStore()
      customerStore.setIsBookingEnabled(true)

      mountComposable()
      await flushPromises()

      const appointmentsStore = useBookingAppointmentsStore()

      // The watcher should have triggered handleBookingQueryParams, opening the drawer
      expect(appointmentsStore.isBookingAppointmentDrawerOpen).toBe(true)
    })

    it('should react when booking is enabled after mount', async () => {
      mockRoute.query = { [BOOKING_QUERY_PARAM_WIDGET]: 'true' }

      const customerStore = useBookingCustomerStore()
      customerStore.setIsBookingEnabled(false) // Initially disabled

      mountComposable()

      const appointmentsStore = useBookingAppointmentsStore()

      // Drawer should not be open yet
      expect(appointmentsStore.isBookingAppointmentDrawerOpen).toBe(false)

      // Enable booking
      customerStore.setIsBookingEnabled(true)
      await flushPromises()

      // Now the watcher should have triggered and opened the drawer
      expect(appointmentsStore.isBookingAppointmentDrawerOpen).toBe(true)
    })
  })
})
