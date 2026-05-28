import { ref, onMounted } from 'vue'
import { logger } from '@pulse/toolbox'
import { BookingService } from '../../../services'
import { BookingAppointmentChooseTimeSlotManager } from './booking-appointment-choose-time-slot.manager'

export function useBookingAppointmentChooseTimeSlot(collaboratorId: number) {
  const iframeUrl = ref('')
  const isLoading = ref(false)

  async function loadIframeUrl() {
    isLoading.value = true
    try {
      const rawUrl = await BookingService.getBookingIframeUrl(collaboratorId)
      iframeUrl.value = BookingAppointmentChooseTimeSlotManager.getSanitizedIframeUrl(rawUrl)
    } catch (error) {
      logger.error(error)
      iframeUrl.value = ''
    } finally {
      isLoading.value = false
    }
  }

  onMounted(loadIframeUrl)

  return {
    iframeUrl,
    isLoading,
  }
}
