import { SortDirection } from '@pulse/common/enums'
import { FAVORITE_SORT_FIELD } from '@entities/constants'
import { WalletSortColumn, WalletMenuActionValue } from '@entities/managers/wallet-tracking/wallet-tracking.enum'

/**
 * The favorite column only toggles between "favorites first" and "not sorted",
 * so the star header can reflect the sort state as filled or empty.
 */
export const FAVORITE_SORT_ORDERS: (SortDirection | null)[] = [SortDirection.DESCENDING, null]

export const SORT_COLUMN_TRACKING_MAP: Record<string, WalletSortColumn> = {
  [FAVORITE_SORT_FIELD]: WalletSortColumn.FAVORITE,
  companyName: WalletSortColumn.COMPANY_NAME,
  customerCode: WalletSortColumn.CUSTOMER_CODE,
  leader: WalletSortColumn.LEADER,
  email: WalletSortColumn.EMAIL,
  city: WalletSortColumn.CITY,
  lastActivityDate: WalletSortColumn.LAST_ACTIVITY_DATE,
}

export const LAST_ACTIVITY_DATE_FALLBACK_LABEL = '-'

export const MENU_ACTION_TRACKING_MAP: Record<string, WalletMenuActionValue> = {
  access: WalletMenuActionValue.ACCESS_FOLDER,
  retryMassActivationEmail: WalletMenuActionValue.RESEND_ACTIVATION_EMAIL,
  declareCustomerRelation: WalletMenuActionValue.DECLARE_CUSTOMER_RELATION,
  removeCustomerRelation: WalletMenuActionValue.REMOVE_CUSTOMER_RELATION,
}
