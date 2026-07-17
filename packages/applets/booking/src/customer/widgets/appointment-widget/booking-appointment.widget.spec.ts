import { WidgetName } from '@pulse/widgets/enums'
import { asyncComponentMatcher, installWidgetOnAppMock } from '@pulse/widgets/mocks'

import BookingAppointmentWidget from './booking-appointment.widget'

describe('booking-appointment widget', () => {
  it('should install', () => {
    const appComponentMock = installWidgetOnAppMock(BookingAppointmentWidget)

    expect(appComponentMock).toHaveBeenCalledExactlyOnceWith(WidgetName.BOOKING_APPOINTMENT, asyncComponentMatcher())
  })
})
