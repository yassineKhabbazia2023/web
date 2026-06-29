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

  static buildSelectedFoldersMenuElements(translations: ManageWalletMenuTranslations): AccessibleMenuItem[] {
    return [
      {
        pIconName: 'folderSymlink',
        pValue: translations.delegateFolders,
        pActionName: ManageWalletAction.DELEGATE_FOLDERS,
        pState: 'default',
        display: true,
      },
      {
        pIconName: 'personRemove',
        pValue: translations.removeFromFolders,
        pActionName: ManageWalletAction.REMOVE_FROM_FOLDERS,
        pState: 'default',
        display: true,
      },
    ]
  }

  static getMenuElements(
    selectedFoldersCount: number,
    translations: ManageWalletMenuTranslations,
  ): PToolboxItemProps[] {
    if (selectedFoldersCount > 0) {
      return filterAccessibleMenuItems(ManageWalletMenuManager.buildSelectedFoldersMenuElements(translations))
    }
    return filterAccessibleMenuItems(ManageWalletMenuManager.buildWalletMenuElements(translations))
  }
}
