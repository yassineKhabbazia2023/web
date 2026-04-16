import { nextTick } from 'vue'
import { setActivePinia, createPinia } from 'pinia'
import { useBookingCollabStore, useUserStore } from '@pulse/common/stores'
import { BookingService } from '@booking/services'
import { BookingTrackingService } from '@booking/services/booking-tracking.service'
import type { BookingConfigurationDetails } from '@booking/types'
import { useBookingEditDrawer } from './booking-edit-drawer.composable'
import { BookingEditDrawerTab } from './booking-edit-drawer.enums'

vi.mock('@booking/services', () => ({
  BookingService: {
    getBookingConfigurationDetails: vi.fn(),
    updateBookingConfiguration: vi.fn(),
  },
}))

vi.mock('@booking/services/booking-tracking.service', () => ({
  BookingTrackingService: {
    trackSlotModificationStarted: vi.fn(),
    trackSlotModificationValidated: vi.fn(),
  },
}))

vi.mock('@pulse/toolbox', () => ({
  logger: {
    error: vi.fn(),
  },
}))

const mockConfigurationDetails: BookingConfigurationDetails = {
  displayName: 'Test Meeting',
  description: 'Test description',
  duration: 30,
  isOnline: true,
  availability: [
    {
      day: 'monday',
      timeSlots: [
        { start: '09:00', end: '12:00' },
        { start: '14:00', end: '17:00' },
      ],
    },
    {
      day: 'tuesday',
      timeSlots: [
        { start: '10:00', end: '16:00' },
      ],
    },
  ],
}

describe('useBookingEditDrawer', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('initialization', () => {
    const mockOptions = {
      onSuccess: vi.fn(),
      onError: vi.fn(),
    }

    it('should initialize with default values', () => {
      const { isLoading, isSaving, isConfirmationModalOpen, activeTab } = useBookingEditDrawer(mockOptions)

      expect(isLoading.value).toBe(false)
      expect(isSaving.value).toBe(false)
      expect(isConfirmationModalOpen.value).toBe(false)
      expect(activeTab.value).toBe(BookingEditDrawerTab.GENERAL)
    })

    it('should fetch configuration details when drawer opens', async () => {
      const collabStore = useBookingCollabStore()
      vi.mocked(BookingService.getBookingConfigurationDetails).mockResolvedValue(mockConfigurationDetails)

      const { configurationDetails, appointmentDetails, timeSlotsConfiguration } = useBookingEditDrawer(mockOptions)

      collabStore.openBookingEditDrawer(123)
      await nextTick()
      await vi.waitFor(() => {
        expect(BookingService.getBookingConfigurationDetails).toHaveBeenCalledWith(123)
      })

      expect(configurationDetails.value).toEqual(mockConfigurationDetails)
      expect(appointmentDetails.value.name).toBe('Test Meeting')
      expect(timeSlotsConfiguration.value.timeSlots).toHaveLength(3)
    })

    it('should track slot modification started when drawer opens', async () => {
      const collabStore = useBookingCollabStore()
      vi.mocked(BookingService.getBookingConfigurationDetails).mockResolvedValue(mockConfigurationDetails)

      useBookingEditDrawer(mockOptions)

      collabStore.openBookingEditDrawer(123)
      await nextTick()

      expect(BookingTrackingService.trackSlotModificationStarted).toHaveBeenCalled()
    })

    it('should detect unsaved changes', async () => {
      const collabStore = useBookingCollabStore()
      vi.mocked(BookingService.getBookingConfigurationDetails).mockResolvedValue(mockConfigurationDetails)

      const { hasUnsavedChanges, appointmentDetails } = useBookingEditDrawer(mockOptions)

      collabStore.openBookingEditDrawer(123)
      await nextTick()
      await vi.waitFor(() => {
        expect(hasUnsavedChanges.value).toBe(false)
      })

      appointmentDetails.value.name = 'Modified Name'
      await nextTick()

      expect(hasUnsavedChanges.value).toBe(true)
    })

    it('should show confirmation modal when closing with unsaved changes', async () => {
      const collabStore = useBookingCollabStore()
      vi.mocked(BookingService.getBookingConfigurationDetails).mockResolvedValue(mockConfigurationDetails)

      const { handleBeforeClose, isConfirmationModalOpen, appointmentDetails } = useBookingEditDrawer(mockOptions)

      collabStore.openBookingEditDrawer(123)
      await nextTick()
      await vi.waitFor(() => {
        expect(appointmentDetails.value.name).toBe('Test Meeting')
      })

      appointmentDetails.value.name = 'Changed Name'
      await nextTick()

      handleBeforeClose()

      expect(isConfirmationModalOpen.value).toBe(true)
    })

    it('should close directly when no unsaved changes', async () => {
      const collabStore = useBookingCollabStore()
      vi.mocked(BookingService.getBookingConfigurationDetails).mockResolvedValue(mockConfigurationDetails)

      const { handleBeforeClose, isConfirmationModalOpen } = useBookingEditDrawer(mockOptions)

      collabStore.openBookingEditDrawer(123)
      await nextTick()
      await vi.waitFor(() => {
        expect(collabStore.isBookingEditDrawerOpened).toBe(true)
      })

      const doneFn = vi.fn()
      handleBeforeClose(doneFn)

      expect(isConfirmationModalOpen.value).toBe(false)
      expect(doneFn).toHaveBeenCalled()
    })

    it('should call onSuccess callback after successful save', async () => {
      const collabStore = useBookingCollabStore()
      vi.mocked(BookingService.getBookingConfigurationDetails).mockResolvedValue(mockConfigurationDetails)
      vi.mocked(BookingService.updateBookingConfiguration).mockResolvedValue(undefined)

      const { handleSave } = useBookingEditDrawer(mockOptions)

      collabStore.openBookingEditDrawer(123)
      await nextTick()
      await vi.waitFor(() => {
        expect(collabStore.isBookingEditDrawerOpened).toBe(true)
      })

      await handleSave()

      expect(BookingService.updateBookingConfiguration).toHaveBeenCalledWith(123, expect.any(Object))
      expect(mockOptions.onSuccess).toHaveBeenCalled()
    })

    it('should track slot modification validated with success when save succeeds', async () => {
      const collabStore = useBookingCollabStore()
      vi.mocked(BookingService.getBookingConfigurationDetails).mockResolvedValue(mockConfigurationDetails)
      vi.mocked(BookingService.updateBookingConfiguration).mockResolvedValue(undefined)

      const { handleSave } = useBookingEditDrawer(mockOptions)

      collabStore.openBookingEditDrawer(123)
      await nextTick()
      await vi.waitFor(() => {
        expect(collabStore.isBookingEditDrawerOpened).toBe(true)
      })

      await handleSave()

      expect(BookingTrackingService.trackSlotModificationValidated).toHaveBeenCalledWith(true)
    })

    it('should call onError callback after failed save', async () => {
      const collabStore = useBookingCollabStore()
      vi.mocked(BookingService.getBookingConfigurationDetails).mockResolvedValue(mockConfigurationDetails)
      vi.mocked(BookingService.updateBookingConfiguration).mockRejectedValue(new Error('API Error'))

      const { handleSave } = useBookingEditDrawer(mockOptions)

      collabStore.openBookingEditDrawer(123)
      await nextTick()
      await vi.waitFor(() => {
        expect(collabStore.isBookingEditDrawerOpened).toBe(true)
      })

      await handleSave()

      expect(mockOptions.onError).toHaveBeenCalled()
    })

    it('should track slot modification validated with failure when save fails', async () => {
      const collabStore = useBookingCollabStore()
      vi.mocked(BookingService.getBookingConfigurationDetails).mockResolvedValue(mockConfigurationDetails)
      vi.mocked(BookingService.updateBookingConfiguration).mockRejectedValue(new Error('API Error'))

      const { handleSave } = useBookingEditDrawer(mockOptions)

      collabStore.openBookingEditDrawer(123)
      await nextTick()
      await vi.waitFor(() => {
        expect(collabStore.isBookingEditDrawerOpened).toBe(true)
      })

      await handleSave()

      expect(BookingTrackingService.trackSlotModificationValidated).toHaveBeenCalledWith(false)
    })

    it('should discard changes and close drawer', async () => {
      const collabStore = useBookingCollabStore()
      vi.mocked(BookingService.getBookingConfigurationDetails).mockResolvedValue(mockConfigurationDetails)

      const { handleDiscardChanges, isConfirmationModalOpen } = useBookingEditDrawer(mockOptions)

      collabStore.openBookingEditDrawer(123)
      await nextTick()
      await vi.waitFor(() => {
        expect(collabStore.isBookingEditDrawerOpened).toBe(true)
      })

      isConfirmationModalOpen.value = true
      handleDiscardChanges()

      expect(isConfirmationModalOpen.value).toBe(false)
      expect(collabStore.isBookingEditDrawerOpened).toBe(false)
    })

    it('should build booking URL with user ID', () => {
      const userStore = useUserStore()
      userStore.user = { id: 42 } as never

      const originalLocation = globalThis.window.location
      Object.defineProperty(globalThis.window, 'location', {
        value: { origin: 'https://example.com' },
        writable: true,
      })

      const { builtBookingUrl } = useBookingEditDrawer(mockOptions)

      expect(builtBookingUrl.value).toBe('https://example.com?bookingWidget=true&collaboratorId=42')

      Object.defineProperty(globalThis.window, 'location', {
        value: originalLocation,
        writable: true,
      })
    })
  })
})
