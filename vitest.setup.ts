import { vi } from 'vitest'
import { createPinia, defineStore } from 'pinia'
import { setAssetsBaseUrl } from '@kpmg/styleguide'

setAssetsBaseUrl('https://www.example.kpmg')

export const mockHasPermission = vi.fn((_code: string) => true)

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
