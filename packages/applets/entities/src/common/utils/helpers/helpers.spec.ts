import { describe, it, expect, vi } from 'vitest'
import type { AccessibleMenuItem } from '@entities/common/types'
import {
  displayNotification,
  filterAccessibleMenuItems,
  getFullName,
  getFullNameWithUppercaseLastName,
} from '.'

// Mocks
const mockedMenuItems: AccessibleMenuItem[] = [
  {
    pIconName: 'arrowUpCircle',
    pValue: 'Deploy this folder',
    pActionName: 'deploy',
    pState: 'default',
    display: false,
  },
  {
    pIconName: 'folder',
    pValue: 'Access this folder',
    pActionName: 'access',
    pState: 'default',
    display: true,
  },
]
const PNotificationMocked = vi.hoisted(() => vi.fn())
vi.mock('@pulse/styleguide', () => ({
  PNotification: PNotificationMocked,
}))

// Expectations
const expectedAccessibleMenuItems = {
  pIconName: 'folder',
  pValue: 'Access this folder',
  pActionName: 'access',
  pState: 'default',
}

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
describe('displayNotification', () => {
  it.each([
    ['success', 'check'],
    ['error', 'x'],
  ])('should display correctly the notification', (type: any, iconName) => {
    const expectedParams = {
      customClass: type,
      duration: 3000,
      iconName,
      message: 'Test Message',
      position: 'bottom-right',
      showClose: true,
    }

    displayNotification(type, 'Test Message')

    expect(PNotificationMocked).toHaveBeenCalledOnce()
    expect(PNotificationMocked).toHaveBeenNthCalledWith(1, expectedParams)
  })
})
describe('filterAccessibleMenuItems', () => {
  it('should return only the menu items that the user has access to', () => {
    const accessibleMenuItems = filterAccessibleMenuItems(mockedMenuItems)

    expect(accessibleMenuItems).toStrictEqual([expectedAccessibleMenuItems])
  })
})
