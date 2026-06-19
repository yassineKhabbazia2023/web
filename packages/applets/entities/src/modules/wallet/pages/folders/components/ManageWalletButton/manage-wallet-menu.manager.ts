import type { PToolboxItemProps } from '@pulse/styleguide/types'
import type { AccessibleMenuItem } from '@entities/types'
import { filterAccessibleMenuItems } from '@entities/utils'
import { GLOBAL_PERMISSIONS } from '@pulse/common/constants'
import { CurrentUserManager, FeatureFlagManager } from '@pulse/common/managers'
import { ManageWalletAction } from '@entities/modules/wallet/enums'
import type { ManageWalletMenuTranslations } from './manage-wallet-button.types'

export class ManageWalletMenuManager {
  static buildWalletMenuElements(translations: ManageWalletMenuTranslations): AccessibleMenuItem[] {
    const isDelegationRequestActivated = FeatureFlagManager.isDelegationRequestTabsActivated()

    return [
      {
        pIconName: 'inbox',
        pValue: translations.delegateWallet,
        pActionName: ManageWalletAction.DELEGATE_WALLET,
        pState: 'default',
        display: true,
      },
      {
        pIconName: 'person',
        pValue: translations.viewPermanentDelegations,
        pActionName: ManageWalletAction.VIEW_PERMANENT_DELEGATIONS,
        pState: 'default',
        display: true,
      },
      {
        pIconName: 'arrowLeftRight',
        pValue: translations.requestDelegation,
        pActionName: ManageWalletAction.REQUEST_DELEGATION,
        pState: 'default',
        display: isDelegationRequestActivated,
      },
      {
        pIconName: 'clockHistory',
        pValue: translations.pendingDelegations,
        pActionName: ManageWalletAction.PENDING_DELEGATIONS,
        pState: 'default',
        display: isDelegationRequestActivated,
      },
      {
        pIconName: 'fileText',
        pValue: translations.createTestAccount,
        pActionName: ManageWalletAction.CREATE_TEST_ACCOUNT,
        pState: 'default',
        display: CurrentUserManager.hasPermission(GLOBAL_PERMISSIONS.ENTITY_CREATOR),
      },
    ]
  }

  static getMenuElements(
    selectedFoldersCount: number,
    translations: ManageWalletMenuTranslations,
  ): PToolboxItemProps[] {
    // empty for now, dedicated selection menus will come in a next PR
    if (selectedFoldersCount > 0) {
      return []
    }
    return filterAccessibleMenuItems(ManageWalletMenuManager.buildWalletMenuElements(translations))
  }
}
