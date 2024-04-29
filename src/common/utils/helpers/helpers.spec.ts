import { describe, it, expect } from 'vitest'
import { getFullName } from '.'

describe('getFullName', () => {
  it.each([
    ['Janelle', 'Boyd', 'Janelle Boyd'],
    ['Janelle', '', 'Janelle'],
    ['', 'Boyd', 'Boyd'],
    [undefined, 'Boyd', 'Boyd'],
    ['Janelle', undefined, 'Janelle'],
    ['', '', ''],
    [undefined, undefined, ''],
  ])(
    'returns the correct full name (%s, %s) => %s',
    (firstName, lastName, expected) => {
      const fullName = getFullName(firstName, lastName)
      expect(fullName).toBe(expected)
    },
  )
})
