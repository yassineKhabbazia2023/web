import { http, HttpResponse } from 'msw'

export const bookingHandlers = [
  http.get('*/booking/api/booking/eligibility/currentuser', () => {
    return HttpResponse.json({ isEligible: true })
  }),

  http.get('*/booking/api/enabled/currentuser', () => {
    return HttpResponse.json({ hasAccess: true })
  }),

  http.get('*/booking/api/appointments/upcoming/count/currentuser', () => {
    return HttpResponse.json({ count: 0 })
  }),
]
