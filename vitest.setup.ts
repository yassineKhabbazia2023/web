import { setAssetsBaseUrl } from '@kpmg/styleguide'
import { vi } from 'vitest'
import { defineStore } from 'pinia'

setAssetsBaseUrl('https://www.example.kpmg')

const CGU_URL = 'https://custom-CGU.com'

export const spyAddEventListener = vi.spyOn(window, 'addEventListener')

vi.mock('@kpmg/common', () => ({
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
