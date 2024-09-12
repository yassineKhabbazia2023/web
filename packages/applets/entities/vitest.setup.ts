import { vi } from 'vitest'
import { createPinia, defineStore, setActivePinia } from 'pinia'
import { commonPinia as pinia } from '@kpmg/common'
import { setAssetsBaseUrl } from '@kpmg/styleguide'
import {
  getMockedAuthorizationsConfig,
} from '@/common/components/ManageRightsDrawer/components/RightsList/RightsListMocks'

setAssetsBaseUrl('https://www.example.kpmg')

const mockedAuthorizationsConfig = getMockedAuthorizationsConfig()

// Exported Mocks
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
vi.mock('@/services/authorization', () => ({
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
vi.mock('@kpmg/common', () => ({
  commonPinia: () => createPinia(),
  commonStore: defineStore('common', {
    getters: {
      isAuthenticated: () => true,
      isCollab: () => true,
      defaultEntity: () => ({
        accountId: 1,
        legalName: 'Entity Test',
        accountNumber: 'IBS544G45F345F',
        color: 'orange',
      }),
    },
  }),
  userPermissions: () => ({
    hasPermission: mockHasPermission,
  }),
  amplitudeService: {
    track: vi.fn(),
  },
}))
