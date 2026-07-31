import { ManageWalletAction } from '@entities/modules/wallet/enums'
import { WalletMenuActionValue, WalletMenuActionType } from '@entities/managers/wallet-tracking/wallet-tracking.enum'

export const WALLET_ACTION_TRACKING_MAP: Record<
  ManageWalletAction,
  { value: WalletMenuActionValue, type: WalletMenuActionType }
> = {
  [ManageWalletAction.DELEGATE_WALLET]: {
    value: WalletMenuActionValue.DELEGATE_WALLET,
    type: WalletMenuActionType.GLOBAL,
  },
  [ManageWalletAction.VIEW_PERMANENT_DELEGATIONS]: {
    value: WalletMenuActionValue.VIEW_PERMANENT_DELEGATIONS,
    type: WalletMenuActionType.GLOBAL,
  },
  [ManageWalletAction.REQUEST_DELEGATION]: {
    value: WalletMenuActionValue.REQUEST_DELEGATION,
    type: WalletMenuActionType.GLOBAL,
  },
  [ManageWalletAction.PENDING_DELEGATIONS]: {
    value: WalletMenuActionValue.PENDING_DELEGATIONS,
    type: WalletMenuActionType.GLOBAL,
  },
  [ManageWalletAction.CREATE_TEST_ACCOUNT]: {
    value: WalletMenuActionValue.CREATE_TEST_ACCOUNT,
    type: WalletMenuActionType.GLOBAL,
  },
  [ManageWalletAction.DELEGATE_FOLDERS]: {
    value: WalletMenuActionValue.DELEGATE_FOLDERS,
    type: WalletMenuActionType.BULK,
  },
  [ManageWalletAction.DECLARE_CUSTOMER_RELATION]: {
    value: WalletMenuActionValue.DECLARE_CUSTOMER_RELATION,
    type: WalletMenuActionType.BULK,
  },
  [ManageWalletAction.REMOVE_CUSTOMER_RELATION]: {
    value: WalletMenuActionValue.REMOVE_CUSTOMER_RELATION,
    type: WalletMenuActionType.BULK,
  },
  [ManageWalletAction.REMOVE_FROM_FOLDERS]: {
    value: WalletMenuActionValue.REMOVE_FROM_FOLDERS,
    type: WalletMenuActionType.BULK,
  },
}
