import { describe, it, expect, vi } from 'vitest'
import { envVarsMock } from '@pulse/common/mocks'
import { fetchUrlTerms } from '.'

vi.mock('env-vars', () => envVarsMock)

const CGU_URL = 'contact/api/terms/latest/content?language=fr'

describe('fetchUrlTerms', () => {
  it('should return the terms URL', async () => {
    const checkUrl = await fetchUrlTerms()
    expect(checkUrl).toBe(`${envVarsMock.VITE_API_GATEWAY}${CGU_URL}`)
  })
})
