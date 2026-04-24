import { describe, it, expect, vi } from 'vitest'
import type { AccessibleMenuItem } from '@entities/types'
import { filterAccessibleMenuItems } from '.'

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

describe('filterAccessibleMenuItems', () => {
  it('should return only the menu items that the user has access to', () => {
    const accessibleMenuItems = filterAccessibleMenuItems(mockedMenuItems)

    expect(accessibleMenuItems).toStrictEqual([expectedAccessibleMenuItems])
  })
})
