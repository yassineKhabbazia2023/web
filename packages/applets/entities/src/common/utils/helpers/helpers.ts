import type { AccessibleMenuItem } from '@entities/common/types'
import { PNotification } from '@pulse/styleguide'
import type { PToolboxItemProps } from '@pulse/styleguide/types'

type NotificationPosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left'

/**
 * Function that constructs the full name using 'firstName' and 'lastName' as parameters
 * @param {string, string, boolean}
 * @returns {string}
 */
export const getFullName = (
  firstName: string | undefined,
  lastName: string | undefined,
  lastNameToUpper: boolean = false,
) => {
  return lastNameToUpper && lastName
    ? `${firstName ?? ''} ${lastName.toUpperCase()}`.trim()
    : `${firstName ?? ''} ${lastName ?? ''}`.trim()
}

/**
 * Function that simplifies the display of success and error notifications
 */
export const displayNotification = (
  type: 'success' | 'error',
  message: string,
  position: NotificationPosition = 'bottom-right',
  duration: number = 3000,
) => {
  PNotification({
    message,
    iconName: type === 'success' ? 'check' : 'x',
    showClose: true,
    customClass: type,
    position,
    duration,
  })
}

/**
 * Function that filters the menu items provided as arguments and returns
 * only those with the display property set to true
 */
export const filterAccessibleMenuItems = (menuItems: AccessibleMenuItem[]) => {
  return menuItems.filter(({ display }) => display)
    .map(({ pIconName, pValue, pActionName, pState }) => ({
      pIconName,
      pValue,
      pActionName,
      pState,
    })) as PToolboxItemProps[]
}
