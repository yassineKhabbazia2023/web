import { http, HttpResponse } from 'msw'
import { getTermsMock } from '@pulse/common/mocks'

export const cguHandlers = [
  http.get('*/contact/api/terms/latest', () => {
    const terms = getTermsMock().terms
    return HttpResponse.json(terms)
  }),

  http.get('*/contact/api/contacts/currentuser/terms', () => {
    return HttpResponse.json(getTermsMock())
  }),

  http.patch('*/contact/api/contacts/currentuser/terms', () => {
    return HttpResponse.json({ message: 'Terms accepted' })
  }),
]
