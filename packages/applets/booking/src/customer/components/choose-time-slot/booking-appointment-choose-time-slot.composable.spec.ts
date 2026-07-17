import { flushPromises } from '@vue/test-utils'
import { loggerMock } from '@pulse/toolbox/mocks'
import { withSetup } from '@pulse/toolbox/utils/test'
import { useBookingAppointmentChooseTimeSlot } from './booking-appointment-choose-time-slot.composable'
import { BookingService } from '../../../services'
import { BookingAppointmentChooseTimeSlotManager } from './booking-appointment-choose-time-slot.manager'

describe('useBookingAppointmentChooseTimeSlot', () => {
  it('should have isLoading true initially and set sanitized iframeUrl after API call', async () => {
    const rawUrl = 'https://outlook.office.com/booking/test'
    const sanitizedUrl = 'https://outlook.office.com/booking/test-sanitized'

    vi.spyOn(BookingService, 'getBookingIframeUrl').mockResolvedValueOnce(rawUrl)
    vi.spyOn(BookingAppointmentChooseTimeSlotManager, 'getSanitizedIframeUrl').mockReturnValueOnce(sanitizedUrl)

    const [result] = withSetup(() => useBookingAppointmentChooseTimeSlot(42))

    expect(result.isLoading.value).toBe(true)
    expect(result.iframeUrl.value).toBe('')

    await flushPromises()

    expect(result.isLoading.value).toBe(false)
    expect(result.iframeUrl.value).toBe(sanitizedUrl)
    expect(BookingService.getBookingIframeUrl).toHaveBeenCalledWith(42)
    expect(BookingAppointmentChooseTimeSlotManager.getSanitizedIframeUrl).toHaveBeenCalledWith(rawUrl)
  })

  it('should set empty iframeUrl and log error when API call fails', async () => {
    const mockError = new Error('API error')
    vi.spyOn(BookingService, 'getBookingIframeUrl').mockRejectedValueOnce(mockError)

    const [result] = withSetup(() => useBookingAppointmentChooseTimeSlot(42))

    await flushPromises()

    expect(result.isLoading.value).toBe(false)
    expect(result.iframeUrl.value).toBe('')
    expect(loggerMock.error).toHaveBeenCalledWith(mockError)
  })
})
