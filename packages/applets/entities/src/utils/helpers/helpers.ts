import type { AccessibleMenuItem } from '@entities/types'
import type { PToolboxItemProps } from '@pulse/styleguide/types'

/**
 * Function that constructs the full name using 'firstName' and 'lastName' as parameters
 * @param {string} firstName - The first name
 * @param {string} lastName - The last name
 * @returns {string} The full name in normal case
 */
export const getFullName = (
  firstName: string | undefined,
  lastName: string | undefined,
) => {
  return `${firstName ?? ''} ${lastName ?? ''}`.trim()
}

/**
 * Function that constructs the full name with last name in uppercase
 * @param {string} firstName - The first name
 * @param {string} lastName - The last name
 * @returns {string} The full name with uppercase last name
 */
export const getFullNameWithUppercaseLastName = (
  firstName: string | undefined,
  lastName: string | undefined,
) => {
  return lastName
    ? `${firstName ?? ''} ${lastName.toUpperCase()}`.trim()
    : `${firstName ?? ''}`.trim()
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
