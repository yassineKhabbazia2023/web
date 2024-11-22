import { describe, it, expect, vi } from 'vitest'
import type { AccessibleMenuItem } from '@entities/common/types'
import { displayNotification, filterAccessibleMenuItems, getFullName } from '.'

// Mocks
const mockedMenuItems: AccessibleMenuItem[] = [
  {
    pIconName: 'PIArrowUpCircle',
    pValue: 'Deploy this folder',
    pActionName: 'deploy',
    pState: 'default',
    display: false,
  },
  {
    pIconName: 'PIFolder',
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

vi.mock('@pulse/styleguide/components', () => ({
  PICheck: 'PICheck',
  PIX: 'PIX',
}))

// Expectations
const expectedAccessibleMenuItems = {
  pIconName: 'PIFolder',
  pValue: 'Access this folder',
  pActionName: 'access',
  pState: 'default',
}

describe('getFullName', () => {
  it.each([
    ['Janelle', 'Boyd', false, 'Janelle Boyd'],
    ['Janelle', '', false, 'Janelle'],
    ['', 'Boyd', false, 'Boyd'],
    [undefined, 'Boyd', false, 'Boyd'],
    ['Janelle', undefined, false, 'Janelle'],
    ['', '', false, ''],
    [undefined, undefined, false, ''],
    [undefined, 'Boyd', true, 'BOYD'],
    [undefined, 'Boyd', undefined, 'Boyd'],
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
describe('displayNotification', () => {
  it.each([
    ['success', 'PICheck'],
    ['error', 'PIX'],
  ])('should display correctly the notification', (type: any, icon) => {
    const expectedParams = {
      customClass: type,
      duration: 3000,
      icon,
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
