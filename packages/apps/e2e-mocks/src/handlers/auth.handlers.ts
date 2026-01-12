import { http, HttpResponse } from 'msw'
import {
  getLoginResponseMock,
  getCurrentUserResponseMock,
  getUserContextResponseMock,
} from '@pulse/common/mocks'

export const authHandlers = [
  // Login endpoint
  http.post('*/authentication/api/login', () => {
    return HttpResponse.json(getLoginResponseMock())
  }),

  // Current user (contact/me) - called by LoginManager.initAuthClient
  http.get('*/contact/me', () => {
    return HttpResponse.json(getCurrentUserResponseMock())
  }),

  // User context - called after navigation to landing page
  http.get('*/connect/api/get-user-information', () => {
    return HttpResponse.json(getUserContextResponseMock())
  }),
]
