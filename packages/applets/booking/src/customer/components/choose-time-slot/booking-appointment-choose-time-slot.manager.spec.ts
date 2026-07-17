import { sanitizeUrl } from '@pulse/toolbox/utils/url'
import { BookingAppointmentChooseTimeSlotManager } from './booking-appointment-choose-time-slot.manager'

describe('BookingAppointmentChooseTimeSlotManager', () => {
  describe('getSanitizedIframeUrl', () => {
    it('should return empty string when iframeUrl is null', () => {
      const result = BookingAppointmentChooseTimeSlotManager.getSanitizedIframeUrl(null)

      expect(result).toBe('')
      expect(vi.mocked(sanitizeUrl)).not.toHaveBeenCalled()
    })

    it('should return empty string when iframeUrl is empty string', () => {
      const result = BookingAppointmentChooseTimeSlotManager.getSanitizedIframeUrl('')

      expect(result).toBe('')
      expect(vi.mocked(sanitizeUrl)).not.toHaveBeenCalled()
    })

    it('should return sanitized URL when iframeUrl is provided', () => {
      const testUrl = 'https://example.com/booking'
      vi.mocked(sanitizeUrl).mockReturnValue(`sanitized-${testUrl}`)

      const result = BookingAppointmentChooseTimeSlotManager.getSanitizedIframeUrl(testUrl)

      expect(result).toBe(`sanitized-${testUrl}`)
      expect(vi.mocked(sanitizeUrl)).toHaveBeenCalledWith(testUrl)
    })

    it('should sanitize URL with special characters', () => {
      const testUrl = 'https://example.com/booking?param=value&other=<script>'
      vi.mocked(sanitizeUrl).mockReturnValue(`sanitized-${testUrl}`)

      const result = BookingAppointmentChooseTimeSlotManager.getSanitizedIframeUrl(testUrl)

      expect(result).toBe(`sanitized-${testUrl}`)
      expect(vi.mocked(sanitizeUrl)).toHaveBeenCalledWith(testUrl)
    })
  })
})
