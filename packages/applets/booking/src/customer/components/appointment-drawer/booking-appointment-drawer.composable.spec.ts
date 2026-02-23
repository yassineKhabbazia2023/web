import { ref } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { flushPromises } from '@vue/test-utils'
import { useBookingAppointmentDrawer } from './booking-appointment-drawer.composable'
import { BookingAppointmentDrawerTabs } from './booking-appointment-drawer.enum'
import { useBookingCustomerStore } from '@booking/stores'
import { BookingManager } from '@booking/shared/managers/booking.manager'
import { getBookingServiceExpert } from '../../../__mocks__'

vi.mock('vue-i18n', () => ({
  createI18n: vi.fn(() => ({})),
  useI18n: () => ({
    t: (key: string) => key,
  }),
}))

vi.mock('@booking/shared/managers/booking.manager')

describe('useBookingAppointmentDrawer', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.mocked(BookingManager.refreshAvailableExperts).mockReset()
  })

  describe('initial state', () => {
    it('should have currentStep set to CHOOSE_EXPERT initially', () => {
      const isOpened = ref(false)
      const { currentStep } = useBookingAppointmentDrawer(isOpened)

      expect(currentStep.value).toBe(BookingAppointmentDrawerTabs.CHOOSE_EXPERT)
    })

    it('should have selectedExpertId as undefined initially', () => {
      const isOpened = ref(false)
      const { selectedExpertId } = useBookingAppointmentDrawer(isOpened)

      expect(selectedExpertId.value).toBeUndefined()
    })

    it('should have isLoadingExperts as false initially', () => {
      const isOpened = ref(false)
      const { isLoadingExperts } = useBookingAppointmentDrawer(isOpened)

      expect(isLoadingExperts.value).toBe(false)
    })

    it('should return empty availableExperts when store has none', () => {
      const isOpened = ref(false)
      const { availableExperts } = useBookingAppointmentDrawer(isOpened)

      expect(availableExperts.value).toEqual([])
    })
  })

  describe('steps', () => {
    it('should return translated step labels', () => {
      const isOpened = ref(false)
      const { steps } = useBookingAppointmentDrawer(isOpened)

      expect(steps.value).toEqual([
        { label: 'booking-appointment-drawer.steps.choose-expert' },
        { label: 'booking-appointment-drawer.steps.choose-time-slot' },
      ])
    })
  })

  describe('closeDrawer', () => {
    it('should set isOpened to false when called', () => {
      const isOpened = ref(true)
      const { closeDrawer } = useBookingAppointmentDrawer(isOpened)

      closeDrawer()

      expect(isOpened.value).toBe(false)
    })

    it('should keep isOpened false if already false', () => {
      const isOpened = ref(false)
      const { closeDrawer } = useBookingAppointmentDrawer(isOpened)

      closeDrawer()

      expect(isOpened.value).toBe(false)
    })
  })

  describe('onSelectExpert', () => {
    it('should set selectedExpertId when expert is selected', () => {
      const isOpened = ref(false)
      const { selectedExpertId, onSelectExpert } = useBookingAppointmentDrawer(isOpened)

      onSelectExpert(42)

      expect(selectedExpertId.value).toBe(42)
    })

    it('should change currentStep to CHOOSE_TIME_SLOT when expert is selected', () => {
      const isOpened = ref(false)
      const { currentStep, onSelectExpert } = useBookingAppointmentDrawer(isOpened)

      expect(currentStep.value).toBe(BookingAppointmentDrawerTabs.CHOOSE_EXPERT)

      onSelectExpert(42)

      expect(currentStep.value).toBe(BookingAppointmentDrawerTabs.CHOOSE_TIME_SLOT)
    })

    it('should allow selecting a different expert', () => {
      const isOpened = ref(false)
      const { selectedExpertId, onSelectExpert } = useBookingAppointmentDrawer(isOpened)

      onSelectExpert(1)
      expect(selectedExpertId.value).toBe(1)

      onSelectExpert(2)
      expect(selectedExpertId.value).toBe(2)
    })
  })

  describe('availableExperts', () => {
    it('should return experts from store', () => {
      const isOpened = ref(false)
      const store = useBookingCustomerStore()
      const mockExperts = [
        getBookingServiceExpert({ contactId: 1, fullName: 'Expert 1' }),
        getBookingServiceExpert({ contactId: 2, fullName: 'Expert 2' }),
      ]
      store.setAvailableExperts(mockExperts)

      const { availableExperts } = useBookingAppointmentDrawer(isOpened)

      expect(availableExperts.value).toEqual(mockExperts)
    })
  })

  describe('watcher on isOpened', () => {
    it('should reset drawer and load experts when drawer opens and booking is enabled', async () => {
      vi.mocked(BookingManager.refreshAvailableExperts).mockResolvedValueOnce(undefined)
      const isOpened = ref(false)
      const store = useBookingCustomerStore()
      const { currentStep, selectedExpertId } = useBookingAppointmentDrawer(isOpened)

      store.setIsBookingEnabled(true)
      currentStep.value = BookingAppointmentDrawerTabs.CHOOSE_TIME_SLOT
      selectedExpertId.value = 99

      isOpened.value = true
      await flushPromises()

      expect(currentStep.value).toBe(BookingAppointmentDrawerTabs.CHOOSE_EXPERT)
      expect(selectedExpertId.value).toBeUndefined()
      expect(vi.mocked(BookingManager.refreshAvailableExperts)).toHaveBeenCalledOnce()
    })

    it('should reset drawer and load experts even when booking is disabled', async () => {
      vi.mocked(BookingManager.refreshAvailableExperts).mockResolvedValueOnce(undefined)
      const isOpened = ref(false)
      const store = useBookingCustomerStore()
      const { currentStep, selectedExpertId } = useBookingAppointmentDrawer(isOpened)

      store.setIsBookingEnabled(false)
      currentStep.value = BookingAppointmentDrawerTabs.CHOOSE_TIME_SLOT
      selectedExpertId.value = 99

      isOpened.value = true
      await flushPromises()

      expect(currentStep.value).toBe(BookingAppointmentDrawerTabs.CHOOSE_EXPERT)
      expect(selectedExpertId.value).toBeUndefined()
      expect(vi.mocked(BookingManager.refreshAvailableExperts)).toHaveBeenCalledOnce()
    })

    it('should not reset drawer when drawer closes', async () => {
      const isOpened = ref(true)
      const { currentStep, selectedExpertId } = useBookingAppointmentDrawer(isOpened)

      currentStep.value = BookingAppointmentDrawerTabs.CHOOSE_TIME_SLOT
      selectedExpertId.value = 99

      isOpened.value = false
      await flushPromises()

      expect(currentStep.value).toBe(BookingAppointmentDrawerTabs.CHOOSE_TIME_SLOT)
      expect(selectedExpertId.value).toBe(99)
    })
  })
})

