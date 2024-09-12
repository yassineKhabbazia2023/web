import { describe, it, expect } from 'vitest'
import { getInitials } from '.'

describe('getInitials', () => {
  it.each([
    ['Janelle', 'Boyd', 'JB'],
    ['Janelle', '', 'J'],
    ['', 'Boyd', 'B'],
    [undefined, 'Boyd', 'B'],
    ['', '', ''],
    [undefined, undefined, ''],
  ])(
    'returns correct initials (%s, %s) => %s',
    (firstName, lastName, expected) => {
      const initials = getInitials(firstName, lastName)
      expect(initials).toBe(expected)
    },
  )
})
