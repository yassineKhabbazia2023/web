import { vi } from 'vitest'
import { createPinia, defineStore, setActivePinia } from 'pinia'
import { commonPinia as pinia } from '@pulse/common'
import styleguideLibrary from '@pulse/styleguide'
import {
  getMockedAuthorizationsConfig,
} from '@entities/common/components/ManageRightsDrawer/components/RightsList/RightsListMocks'

import { createI18n } from 'vue-i18n'
import { config } from '@vue/test-utils'
import messages from '@intlify/unplugin-vue-i18n/messages'

const i18n = createI18n({
  locale: 'en-US',
  legacy: false,
  messages,
})

const styleguideParameters = {
  assetsBaseUrl: 'https://www.example.pulse',
}
config.global.plugins = [
  i18n,
  [styleguideLibrary, styleguideParameters],
]

const mockedAuthorizationsConfig = getMockedAuthorizationsConfig()

// Exported Mocks
export const mockSelectedEntity = {
  accountId: 1,
  legalName: 'Entity Test',
  accountNumber: 'IBS544G45F345F',
  color: 'orange',
}
export const mockHasPermission = vi.fn((_code: string) => true)
export const mockUpdateUserPermission = vi.fn()
export const mockUpdateAccountPermission = vi.fn()
export const mockFetchAuthorizationsConfig = vi.fn(() =>
  Promise.resolve(mockedAuthorizationsConfig),
)

// Power BI Mocks
// @ts-ignore
window.powerbi = {
  reset: () => vi.fn(),
  embed: () => vi.fn(),
} as any
vi.mock('powerbi-client', () => ({
  powerBiEmbed: () => vi.fn(),
}))

setActivePinia(pinia)

// Service Mocks
vi.mock('@entities/services/authorization', () => ({
  fetchAuthorizationsConfig: mockFetchAuthorizationsConfig,
  updateUserPermissions: mockUpdateUserPermission,
  fetchAccountAuthorizationsConfig: mockFetchAuthorizationsConfig,
  updateAccountPermissions: mockUpdateAccountPermission,
}))

// Vue-Router Mocks
vi.mock('vue-router', () => ({
  useRouter: () => ({
    go: vi.fn(),
  }),
}))

// External Package Mocks
vi.mock('@pulse/common', () => ({
  commonPinia: () => createPinia(),
  commonStore: defineStore('common', {
    getters: {
      isAuthenticated: () => true,
      isCollab: () => true,
      defaultEntity: () => (mockSelectedEntity),
    },
  }),
  userPermissions: () => ({
    hasPermission: mockHasPermission,
  }),
  amplitudeService: {
    track: vi.fn(),
  },
}))
