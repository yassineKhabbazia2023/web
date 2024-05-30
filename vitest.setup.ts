import { setAssetsBaseUrl } from '@kpmg/styleguide'
import { vi } from 'vitest'
import { defineStore } from 'pinia'

setAssetsBaseUrl('https://www.example.kpmg')

const CGU_URL = 'https://custom-CGU.com'

vi.mock('@kpmg/common', () => ({
  fetchUrlTerms: vi.fn(() => CGU_URL),
  commonStore: defineStore('common', {
    getters: {
      isCollab: () => true,
    },
  }),
}))
