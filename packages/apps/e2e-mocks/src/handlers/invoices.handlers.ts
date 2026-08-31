import { http, HttpResponse } from 'msw'

export const invoicesHandlers = [
  http.get('*/ventya/api/accounts/:accountId/currentuser', () => {
    return HttpResponse.json({
      'tab-state': 'form-start',
      contactWithAccess: null,
      externalDematMail: 'testauto@conseilescgs.onmicrosoft.com',
    })
  }),
  http.get('*/connect/api/serenity-modal', () => {
    return HttpResponse.json({ shouldDisplay: false })
  }),
  http.post('*/connect/api/serenity-modal', () => {
    return new HttpResponse(null, { status: 204 })
  }),
]
