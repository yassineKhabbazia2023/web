import { vi } from 'vitest'
import { setAssetsBaseUrl } from '@kpmg/styleguide'

setAssetsBaseUrl('https://www.example.kpmg')

export const givenToken = 'given-token'

vi.mock('@kpmg/common', () => ({
  amplitudeService: {
    track: vi.fn(),
    reset: vi.fn(),
  },
}))
