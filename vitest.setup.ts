import { setAssetsBaseUrl } from '@kpmg/styleguide'
import { vi } from 'vitest'

setAssetsBaseUrl('https://www.example.kpmg')

const CGU_URL = 'https://custom-CGU.com'

vi.mock('@kpmg/common', () => ({
  fetchUrlTerms: vi.fn(() => CGU_URL),
}))
