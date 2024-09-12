import { describe, it, expect, vi } from 'vitest'
import * as styleguide from '@kpmg/styleguide'
import { displayNotification, getFullName } from '.'

vi.mock('@kpmg/styleguide', () => {
  return {
    PICheck: 'PICheck',
    PIX: 'PIX',
    PNotification: vi.fn(),
  }
})

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
    const PNotificationMocked = vi.spyOn(styleguide, 'PNotification')
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
