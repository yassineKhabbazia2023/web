import { ref } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { flushPromises } from '@vue/test-utils'
import { useBookingAppointmentDrawer } from './booking-appointment-drawer.composable'
import { BookingAppointmentDrawerTabs } from './booking-appointment-drawer.enum'
import { useBookingCustomerStore, useBookingAppointmentsStore } from '@booking/stores'
import { BookingManager } from '@booking/shared/managers/booking.manager'
import { getMockExperts } from '../../../__mocks__'

describe('useBookingAppointmentDrawer', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
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
      const mockExperts = getMockExperts()
      store.setAvailableExperts(mockExperts)

      const { availableExperts } = useBookingAppointmentDrawer(isOpened)

      expect(availableExperts.value).toEqual(mockExperts)
    })
  })

  describe('watcher on isOpened', () => {
    it('should reset drawer and load experts when drawer opens and booking is enabled', async () => {
      vi.spyOn(BookingManager, 'refreshAvailableExperts').mockResolvedValueOnce(undefined)
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
      vi.spyOn(BookingManager, 'refreshAvailableExperts').mockResolvedValueOnce(undefined)
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
      vi.spyOn(BookingManager, 'refreshAvailableExperts').mockResolvedValueOnce(undefined)
      const isOpened = ref(false)
      const { currentStep, selectedExpertId } = useBookingAppointmentDrawer(isOpened)

      // Open drawer first
      isOpened.value = true
      await flushPromises()

      // Modify state
      currentStep.value = BookingAppointmentDrawerTabs.CHOOSE_TIME_SLOT
      selectedExpertId.value = 99

      // Close drawer
      isOpened.value = false
      await flushPromises()

      // State should not be reset when closing
      expect(currentStep.value).toBe(BookingAppointmentDrawerTabs.CHOOSE_TIME_SLOT)
      expect(selectedExpertId.value).toBe(99)
    })

    it('should load experts immediately when composable initialized with drawer already open', async () => {
      vi.spyOn(BookingManager, 'refreshAvailableExperts').mockResolvedValueOnce(undefined)
      const isOpened = ref(true)

      useBookingAppointmentDrawer(isOpened)
      await flushPromises()

      expect(vi.mocked(BookingManager.refreshAvailableExperts)).toHaveBeenCalledOnce()
    })

    it('should handle preselected expert when drawer already open on initialization', async () => {
      vi.spyOn(BookingManager, 'refreshAvailableExperts').mockResolvedValueOnce(undefined)
      const appointmentsStore = useBookingAppointmentsStore()
      const customerStore = useBookingCustomerStore()

      const mockExperts = getMockExperts()
      customerStore.setAvailableExperts(mockExperts)
      const preselectedExpertId = mockExperts[0].id

      // Set preselected collaborator and open drawer BEFORE composable initialization
      appointmentsStore.openBookingAppointmentDrawer(preselectedExpertId)
      const isOpened = ref(true)

      const { currentStep, selectedExpertId } = useBookingAppointmentDrawer(isOpened)
      await flushPromises()

      expect(selectedExpertId.value).toBe(preselectedExpertId)
      expect(currentStep.value).toBe(BookingAppointmentDrawerTabs.CHOOSE_TIME_SLOT)
      expect(appointmentsStore.preselectedCollaboratorId).toBeUndefined()
    })

    it('should auto-select preselected collaborator when drawer opens and expert exists', async () => {
      vi.spyOn(BookingManager, 'refreshAvailableExperts').mockResolvedValueOnce(undefined)
      const isOpened = ref(false)
      const appointmentsStore = useBookingAppointmentsStore()
      const customerStore = useBookingCustomerStore()

      // Set up available experts including the one we'll preselect
      const mockExperts = getMockExperts()
      customerStore.setAvailableExperts(mockExperts)
      const preselectedExpertId = mockExperts[0].id

      const { currentStep, selectedExpertId } = useBookingAppointmentDrawer(isOpened)

      // Set preselected collaborator before opening drawer
      appointmentsStore.openBookingAppointmentDrawer(preselectedExpertId)

      // Drawer should be open now
      expect(appointmentsStore.isBookingAppointmentDrawerOpen).toBe(true)

      // Simulate the drawer receiving the open state
      isOpened.value = true
      await flushPromises()

      // Should have auto-selected the expert and moved to time slot step
      expect(selectedExpertId.value).toBe(preselectedExpertId)
      expect(currentStep.value).toBe(BookingAppointmentDrawerTabs.CHOOSE_TIME_SLOT)
      // Preselected ID should be cleared after consumption
      expect(appointmentsStore.preselectedCollaboratorId).toBeUndefined()
    })

    it('should not auto-select when preselected collaborator does not exist in available experts', async () => {
      vi.spyOn(BookingManager, 'refreshAvailableExperts').mockResolvedValueOnce(undefined)
      const isOpened = ref(false)
      const appointmentsStore = useBookingAppointmentsStore()
      const customerStore = useBookingCustomerStore()

      // Set up available experts that do NOT include the preselected ID
      const mockExperts = getMockExperts()
      customerStore.setAvailableExperts(mockExperts)
      const nonExistentExpertId = 99999

      const { currentStep, selectedExpertId } = useBookingAppointmentDrawer(isOpened)

      // Set preselected collaborator that doesn't exist
      appointmentsStore.openBookingAppointmentDrawer(nonExistentExpertId)
      isOpened.value = true
      await flushPromises()

      // Should NOT have selected the expert, stay on choose expert step
      expect(selectedExpertId.value).toBeUndefined()
      expect(currentStep.value).toBe(BookingAppointmentDrawerTabs.CHOOSE_EXPERT)
      // Preselected ID should still be cleared
      expect(appointmentsStore.preselectedCollaboratorId).toBeUndefined()
    })

    it('should not auto-select when no preselected collaborator', async () => {
      vi.spyOn(BookingManager, 'refreshAvailableExperts').mockResolvedValueOnce(undefined)
      const isOpened = ref(false)
      const appointmentsStore = useBookingAppointmentsStore()
      const { currentStep, selectedExpertId } = useBookingAppointmentDrawer(isOpened)

      // Open drawer without preselected collaborator
      appointmentsStore.openBookingAppointmentDrawer()
      isOpened.value = true
      await flushPromises()

      // Should stay on choose expert step
      expect(selectedExpertId.value).toBeUndefined()
      expect(currentStep.value).toBe(BookingAppointmentDrawerTabs.CHOOSE_EXPERT)
    })
  })
})

