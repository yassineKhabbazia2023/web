import { describe, it, expect, vi } from 'vitest'
import * as services from '.'

const CGU_URL = 'https://custom-CGU.com'
const mockGetUrlTerms = vi.fn(() => ({
  data: {
    value: CGU_URL,
  },
}))

vi.mock('../api', () => ({
  default: () => ({
    gateway: {
      get: mockGetUrlTerms,
    },
  }),
}),
)

describe('fetchUrlTerms', () => {
  it('should return the terms URL', async () => {
    const checkUrl = await services.fetchUrlTerms()
    expect(checkUrl).toBe(CGU_URL)
  })
  it('should catch error', async () => {
    mockGetUrlTerms.mockRejectedValue('error api')
    const spyFetchUrlTerms = vi.spyOn(
      services,
      'fetchUrlTerms',
    )

    await services.fetchUrlTerms()

    expect(spyFetchUrlTerms).toHaveBeenCalledOnce()
  })
})
