import { WidgetName } from '@pulse/widgets/enums'
import { defineAsyncComponent } from 'vue'

import BookingAppointmentWidget from './booking-appointment.widget'

vi.mock('vue')

describe('booking-appointment widget', () => {
  it('should install', () => {
    const _options: any = {}
    const appComponentMock = vi.fn()
    const app: any = {
      component: appComponentMock,
    }

    const expectedDefineAsyncComponentArguments = [
      expect.any(Function),
    ]
    const expectedAppComponentArguments = [
      WidgetName.BOOKING_APPOINTMENT,
      expect.any(Promise),
    ]

    const defineAsyncComponentSpy = vi
      .mocked(defineAsyncComponent)
      .mockImplementation((callback: any) => callback())

    BookingAppointmentWidget.install(app, _options)

    expect(appComponentMock).toHaveBeenCalledOnce()
    expect(defineAsyncComponentSpy).toHaveBeenCalledOnce()
    expect(defineAsyncComponentSpy).toHaveBeenCalledWith(...expectedDefineAsyncComponentArguments)
    expect(appComponentMock).toHaveBeenCalledWith(...expectedAppComponentArguments)
  })
})

