import { WalletSortColumn, WalletMenuActionValue } from '@entities/managers/wallet-tracking/wallet-tracking.enum'

export const SORT_COLUMN_TRACKING_MAP: Record<string, WalletSortColumn> = {
  companyName: WalletSortColumn.COMPANY_NAME,
  customerCode: WalletSortColumn.CUSTOMER_CODE,
  leader: WalletSortColumn.LEADER,
  email: WalletSortColumn.EMAIL,
  city: WalletSortColumn.CITY,
}

export const MENU_ACTION_TRACKING_MAP: Record<string, WalletMenuActionValue> = {
  access: WalletMenuActionValue.ACCESS_FOLDER,
  retryMassActivationEmail: WalletMenuActionValue.RESEND_ACTIVATION_EMAIL,
  declareCustomerRelation: WalletMenuActionValue.DECLARE_CUSTOMER_RELATION,
}
