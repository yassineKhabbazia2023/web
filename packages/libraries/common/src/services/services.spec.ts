import { describe, it, expect, vi } from 'vitest'
import { fetchUrlTerms } from '.'
import { VITE_API_GATEWAY } from '../../__mocks__/env-vars'

vi.mock('env-vars')

const CGU_URL = 'contact/api/terms/latest/content?language=fr'

describe('fetchUrlTerms', () => {
  it('should return the terms URL', async () => {
    const checkUrl = await fetchUrlTerms()
    expect(checkUrl).toBe(`${VITE_API_GATEWAY}${CGU_URL}`)
  })
})
