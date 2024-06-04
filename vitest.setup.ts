import { vi } from 'vitest'
import { createPinia, defineStore, setActivePinia } from 'pinia'
import { commonPinia as pinia } from '@kpmg/common'
import { setAssetsBaseUrl } from '@kpmg/styleguide'

setAssetsBaseUrl('https://www.example.kpmg')

export const mockHasPermission = vi.fn((_code: string) => true)

// Power BI Mocks
window.powerbi = {
  reset: () => vi.fn(),
  bootstrap: () => vi.fn(),
} as any
vi.mock('powerbi-client', () => ({
  powerBiEmbed: () => vi.fn(),
}))

setActivePinia(pinia)
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
}))
