import { describe, it, expect } from 'vitest'
import { getFullName } from '.'

describe('getFullName', () => {
  it.each([
    ['Janelle', 'Boyd', false, 'Janelle Boyd'],
    ['Janelle', '', false, 'Janelle'],
    ['', 'Boyd', false, 'Boyd'],
    [undefined, 'Boyd', false, 'Boyd'],
    ['Janelle', undefined, false, 'Janelle'],
    ['', '', false, ''],
    [undefined, undefined, false, ''],
    ['Janelle', '', true, 'Janelle'],
    ['Janelle', 'Boyd', true, 'Janelle BOYD'],
    ['Janelle', undefined, true, 'Janelle'],
  ])(
    'returns the correct full name (%s, %s, %s) => %s',
    (firstName, lastName, lastNametoUpper, expected) => {
      const fullName = getFullName(firstName, lastName, lastNametoUpper)

      expect(fullName).toBe(expected)
    },
  )
})
