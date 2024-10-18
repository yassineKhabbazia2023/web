import { vi } from 'vitest'
import { setAssetsBaseUrl } from '@pulse/styleguide'
import { createI18n } from 'vue-i18n'
import { config } from '@vue/test-utils'
import { defineStore } from 'pinia'
import messages from '@intlify/unplugin-vue-i18n/messages'

const i18n = createI18n({
  locale: 'en-US',
  legacy: false,
  messages,
})

config.global.plugins = [i18n]

vi.spyOn(window, 'open')

setAssetsBaseUrl('https://www.example.kpmg')

export const givenToken = 'given-token'

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

vi.mock('env-vars', () => ({
  VITE_IDLE_DURATION: 5,
  VITE_AMPLITUDE_API_KEY: 'mocked-amplitude-api-key',
  VITE_AMPLITUDE_SERVER_URL: 'mocked-amplitude-server-url',
  VITE_PRODUCT_FRUITS_KEY: 'TEST_KEY',
  VITE_PRODUCT_FRUITS_KEY_CLIENT: 'TEST_KEY',
  VITE_SFCHAT_URL_SANDBOX: '',
  VITE_SFCHAT_BUTTON_ID: '',
  VITE_SFCHAT_URL_LIVEAGENT: '',
  VITE_SFCHAT_QUEUE_ID: '',
  VITE_SFCHAT_QUEUE_NAME: '',
  VITE_SFCHAT_BASE_LIVE_AGENT_CONTENT_URL: '',
  VITE_SFCHAT_DEPLOYMENT_ID: '',
  VITE_SFCHAT_BASE_LIVE_AGENT_URL: '',
  VITE_SFCHAT_SET_ATTRIBUTE_PATH: '',
}))
