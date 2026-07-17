import { getFullName, getFullNameWithUppercaseLastName, getInitials } from './user.utils'

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

describe('getFullNameWithUppercaseLastName', () => {
  it.each([
    ['Janelle', 'Boyd', 'Janelle BOYD'],
    ['Janelle', '', 'Janelle'],
    ['', 'Boyd', 'BOYD'],
    [undefined, 'Boyd', 'BOYD'],
    ['Janelle', undefined, 'Janelle'],
    ['', '', ''],
    [undefined, undefined, ''],
  ])(
    'returns the correct full name with uppercase last name (%s, %s) => %s',
    (firstName, lastName, expected) => {
      const fullName = getFullNameWithUppercaseLastName(firstName, lastName)

      expect(fullName).toBe(expected)
    },
  )
})
