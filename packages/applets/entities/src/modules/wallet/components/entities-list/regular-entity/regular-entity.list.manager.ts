import type { AccessibleMenuItem } from '@entities/types'
import type { PToolboxItemProps } from '@pulse/styleguide/types'
import type { MenuTranslations } from './regular-entity.list.types'
import { filterAccessibleMenuItems } from '@entities/utils'
import { formatDateToLocale } from '@entities/helpers'
import { ACTION_PERMISSIONS } from '@pulse/common/constants'
import { CurrentUserManager } from '@pulse/common/managers'
import { isNullOrEmpty } from '@pulse/toolbox/utils/validator'
import { RegularEntityAction } from './regular-entity.list.enums'
import { LAST_ACTIVITY_DATE_FALLBACK_LABEL } from './regular-entity.list.consts'

export class RegularEntitiesListManager {
  static buildDefaultMenuElements(translations: MenuTranslations): AccessibleMenuItem[] {
    return [
      {
        pIconName: 'folder',
        pValue: translations.accessThisFolder,
        pActionName: RegularEntityAction.ACCESS,
        pState: 'default',
        display: true,
      },
      {
        pIconName: 'folderSymlink',
        pValue: translations.delegateThisFolder,
        pActionName: RegularEntityAction.DELEGATE_FOLDER,
        pState: 'default',
        display: true,
      },
      {
        pIconName: 'send',
        pValue: translations.resendActivationEmail,
        pActionName: RegularEntityAction.RETRY_MASS_ACTIVATION_EMAIL,
        pState: 'default',
        display: CurrentUserManager.hasPermission(ACTION_PERMISSIONS.ACTIVATE_OFFER),
      },
      {
        pIconName: 'personCheck',
        pValue: translations.declareCustomerRelation,
        pActionName: RegularEntityAction.DECLARE_CUSTOMER_RELATION,
        pState: 'default',
        display: true,
      },
      {
        pIconName: 'personRemove',
        pValue: translations.removeCurrentUserFromThisFolder,
        pActionName: RegularEntityAction.REMOVE_CURRENT_USER_FROM_FOLDER,
        pState: 'default',
        display: true,
      },
    ]
  }

  static buildMenuToDeployElements(translations: MenuTranslations): AccessibleMenuItem[] {
    return [
      {
        pIconName: 'arrowUpCircle',
        pValue: translations.deployThisFolder,
        pActionName: RegularEntityAction.DEPLOY,
        pState: 'default',
        display: true,
      },
      ...RegularEntitiesListManager.buildDefaultMenuElements(translations),
    ]
  }

  static getLastActivityDateLabel(lastActivityDate: string | null): string {
    if (isNullOrEmpty(lastActivityDate)) {
      return LAST_ACTIVITY_DATE_FALLBACK_LABEL
    }
    return formatDateToLocale(lastActivityDate)
  }

  static getMenuElementsForRow(
    deploymentStatusText: string,
    toDeployLabel: string,
    translations: MenuTranslations,
  ): PToolboxItemProps[] {
    return deploymentStatusText === toDeployLabel
      ? filterAccessibleMenuItems(RegularEntitiesListManager.buildMenuToDeployElements(translations))
      : filterAccessibleMenuItems(RegularEntitiesListManager.buildDefaultMenuElements(translations))
  }
}
