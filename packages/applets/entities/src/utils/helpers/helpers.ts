import type { AccessibleMenuItem } from '@entities/types'
import type { PToolboxItemProps } from '@pulse/styleguide/types'

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
