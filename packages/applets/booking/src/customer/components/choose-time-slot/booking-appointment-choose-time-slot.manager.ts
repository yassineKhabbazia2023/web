import { sanitizeUrl } from '@pulse/toolbox/utils/url'

export class BookingAppointmentChooseTimeSlotManager {
  static getSanitizedIframeUrl(iframeUrl: string | null): string {
    if (iframeUrl === '' || iframeUrl === null) {
      return ''
    }
    return sanitizeUrl(iframeUrl)
  }
}
