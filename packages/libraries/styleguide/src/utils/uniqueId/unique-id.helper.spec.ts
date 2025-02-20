import { describe, it, expect, vi } from 'vitest'
import { genereateUniqueId } from './unique-id.helper'

describe('unique id helper', () => {
  it('should return a unique identifier using Date.now() and Math.random()', () => {
    const fakeDateNow = 1609459200000
    const fakeRandom = 0.123456789

    vi.spyOn(Date, 'now').mockReturnValue(fakeDateNow)
    vi.spyOn(Math, 'random').mockReturnValue(fakeRandom)

    const expectedTimePart = fakeDateNow.toString(36)
    const expectedRandomPart = fakeRandom.toString(36).substring(2, 9)
    const expectedId = `${expectedTimePart}-${expectedRandomPart}`

    expect(genereateUniqueId()).toBe(expectedId)

    vi.restoreAllMocks()
  })
})
