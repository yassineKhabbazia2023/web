import type { AccessibleMenuItem } from '@entities/types'
import type { PToolboxItemProps } from '@pulse/styleguide/types'
import { filterAccessibleMenuItems } from '@entities/utils'
import { ACTION_PERMISSIONS, GLOBAL_PERMISSIONS } from '@pulse/common/constants'
import { CurrentUserManager } from '@pulse/common/managers'
import { i18n } from '@pulse/common/i18n'
import { EntitiesManagementAction } from './entities-management.list.enums'

const I18N_KEY = 'entities.wallet.entitiesListRegular'

export class EntitiesManagementListManager {
  static buildMenu(): AccessibleMenuItem[] {
    return [
      {
        pIconName: 'grid',
        pValue: i18n.global.t(`${I18N_KEY}.manageAccountRights`),
        pActionName: EntitiesManagementAction.MANAGE_ACCOUNT_RIGHTS,
        pState: 'default',
        display: CurrentUserManager.hasPermission(ACTION_PERMISSIONS.MODIFY_ACCOUNT_RIGHTS),
      },
      {
        pIconName: 'send',
        pValue: i18n.global.t(`${I18N_KEY}.resendActivationEmail`),
        pActionName: EntitiesManagementAction.RETRY_MASS_ACTIVATION_EMAIL,
        pState: 'default',
        display: CurrentUserManager.hasPermission(GLOBAL_PERMISSIONS.ACCOUNT_MANAGEMENT),
      },
    ]
  }

  static getMenuElements(): PToolboxItemProps[] {
    return filterAccessibleMenuItems(EntitiesManagementListManager.buildMenu())
  }
}
