import { describe, it, expect } from 'vitest'
import { generateObject, getInitials } from './helper'

describe('getInitials', () => {
  it.each([
    ['gojo', 'satoru', 'GS'],
    ['Gojo', '', 'G'],
    ['', 'Satoru', 'S'],
    [undefined, 'Gojo', 'G'],
    ['', '', ''],
    [undefined, undefined, '']
  ])(
    'returns correct initials (%s, %s) => %s',
    (firstName, lastName, expected) => {
      const initials = getInitials(firstName, lastName)
      expect(initials).toBe(expected)
    }
  )
})

describe('generateObject', () => {
  it('should construct and return the correct object', () => {
    const expectedObject = { a: { b: 5 } }
    const generatedObject = generateObject('a', { 'a.b': 5 })
    expect(generatedObject).toStrictEqual(expectedObject)
  })
})
