import { describe, it, expect } from 'vitest'
import { getInitials } from './helper'

describe('getInitials', () => {
  it.each([
    ['gojo', 'satoru', 'GS'],
    ['Gojo', '', 'G'],
    ['', 'Satoru', 'S'],
    [undefined, 'Gojo', 'G'],
    ['', '', ''],
    [undefined, undefined, '']
  ])('returns correct initials (%s, %s) => %s', (firstName, lastName, expected) => {
    const initials = getInitials(firstName, lastName)
    expect(initials).toBe(expected)
  })
})
