import { describe, it, expect, vi } from 'vitest'
import { generateUniqueId } from './unique-id.helper'

describe('unique id helper', () => {
  it('should return a unique identifier using Date.now() and crypto.getRandomValues()', () => {
    const fakeDateNow = 1609459200000
    const fakeRandomValue = 123456789

    vi.spyOn(Date, 'now').mockReturnValue(fakeDateNow)
    vi.spyOn(crypto, 'getRandomValues').mockImplementation((array) => {
      (array as Uint32Array)[0] = fakeRandomValue
      return array
    })

    const expectedTimePart = fakeDateNow.toString(36)
    const expectedRandomPart = fakeRandomValue.toString(36).substring(0, 7)
    const expectedId = `${expectedTimePart}-${expectedRandomPart}`

    expect(generateUniqueId()).toBe(expectedId)

    vi.restoreAllMocks()
  })

  it('should generate different ids on successive calls', () => {
    const id1 = generateUniqueId()
    const id2 = generateUniqueId()
    expect(id1).not.toBe(id2)
  })

  it('should match the expected format', () => {
    const id = generateUniqueId()
    expect(id).toMatch(/^[a-z0-9]+-[a-z0-9]+$/)
  })
})
