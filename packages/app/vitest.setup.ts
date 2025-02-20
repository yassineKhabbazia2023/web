import { vi } from 'vitest'
import { defineStore } from 'pinia'
import { notificationsMock } from './src/mocks/FeedCenter/notifications.mock'
import styleguideLibrary from '@pulse/styleguide'
import { createI18n } from 'vue-i18n'
import { config } from '@vue/test-utils'
import messages from '@intlify/unplugin-vue-i18n/messages'

const i18n = createI18n({
  locale: 'en-US',
  legacy: false,
  messages,
})

const styleguideParameters = {
  assetsBaseUrl: 'https://www.example.test',
}
config.global.plugins = [
  i18n,
  [styleguideLibrary, styleguideParameters],
]

const CGU_URL = 'https://custom-CGU.com'
export const spyAddEventListener = vi.spyOn(window, 'addEventListener')

vi.mock('@pulse/common', () => ({
  fetchUrlTerms: vi.fn(() => CGU_URL),
  commonStore: defineStore('common', {
    getters: {
      isCollab: () => true,
    },
    actions: {
      logout: () => vi.fn(),
    },
  }),
}))

export const fetchUnreadNotificationsCountMock = vi.fn(() => 5)
export const fetchNotificationsMock = vi.fn(() => ({ notifications: notificationsMock }))
export const patchNotificationReadStatusMock = vi.fn()
export const patchAllNotificationsAsReadStatusMock = vi.fn()

vi.mock('@app/modules/FeedCenter/services/notifications.service', () => ({
  fetchUnreadNotificationsCount: fetchUnreadNotificationsCountMock,
  fetchNotifications: fetchNotificationsMock,
  patchNotificationReadStatus: patchNotificationReadStatusMock,
  patchAllNotificationsReadStatus: patchAllNotificationsAsReadStatusMock,
}))

export const envVarsValues = {
  VITE_AMPLITUDE_API_KEY: 'mocked-amplitude-api-key',
  VITE_AMPLITUDE_SERVER_URL: 'mocked-amplitude-server-url',
  VITE_FEED_CENTER_ACTIVATED: 'true',
  VITE_IDLE_DURATION: 5,
  VITE_PRODUCT_FRUITS_KEY: 'TEST_KEY',
  VITE_PRODUCT_FRUITS_KEY_CLIENT: 'TEST_KEY',
  VITE_SCHEDULE_ACTIVATED: 'true',
}

vi.mock('env-vars', () => (envVarsValues))
