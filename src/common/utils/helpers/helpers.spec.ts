import { describe, it, expect } from 'vitest'
import { getFullName } from '.'

describe('getFullName', () => {
  it('should return the correct full name', () => {
    const firstName = 'Jannelle'
    const lastName = 'Braydon'
    const expectedFullName = 'Jannelle Braydon'
    const fullName = getFullName({ firstName, lastName })

    expect(expectedFullName).toBe(fullName)
  })
})
