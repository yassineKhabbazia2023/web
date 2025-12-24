import { http, HttpResponse } from 'msw'
import {
  notificationsMock,
  unreadNotificationsMock,
  getNotificationSettingsConfiguration,
} from '@pulse/feed-center/mocks'

export const feedCenterHandlers = [
  // Fetch unread notifications count
  http.get('*/feedcenter/api/notifications/currentuser/unread/count', () => {
    return HttpResponse.json(unreadNotificationsMock.length)
  }),

  // Fetch all notifications
  http.get('*/feedcenter/api/notifications/currentuser', () => {
    return HttpResponse.json(notificationsMock)
  }),

  // Mark notification(s) as read
  http.put('*/feedcenter/api/notifications/read/currentUser', () => {
    return HttpResponse.json({ success: true })
  }),

  // Get notification settings
  http.get('*/feedcenter/api/settings/currentUser', () => {
    return HttpResponse.json(getNotificationSettingsConfiguration())
  }),

  // Save notification settings
  http.post('*/feedcenter/api/settings/currentUser', () => {
    return HttpResponse.json({ success: true })
  }),
]
