import { isAttribute } from './attribute'
import { describe, it, expect } from 'vitest'

describe('styleguide attribute', () => {
  const expectedAttributes = [
    { expected: '\n  name', flag: true, name: 'name' },
    { expected: '', flag: false, name: 'name' }
  ]

  it.each(expectedAttributes)('calls isAttribute methods', ({ expected, flag, name }) => {
    expect(isAttribute(flag, name)).toBe(expected)
  })
})
