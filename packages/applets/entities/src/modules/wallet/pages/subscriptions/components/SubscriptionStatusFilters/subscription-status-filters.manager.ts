import type { FilterOption } from '@pulse/styleguide/types'
import { SubscriptionStatusCode } from '@entities/services/subscription/subscriptionTypes'
import type { SubscriptionStats } from '@entities/services/subscription/subscriptionTypes'
import { i18n } from '@pulse/common/i18n'
import { SUBSCRIPTION_STATUS_COLOR, SUBSCRIPTION_STATUS_ICON } from './subscription-status-filters.constants'

export class SubscriptionStatusFiltersManager {

  static getDefaultActiveStatusCodes(): SubscriptionStatusCode[] {
    return [
      SubscriptionStatusCode.PENDING,
      SubscriptionStatusCode.PENNYLANE_TO_VERIFY,
      SubscriptionStatusCode.PENNYLANE_CREATED,
    ]
  }

  static getOfferActivationFilters(
    stats: SubscriptionStats,
  ): FilterOption<SubscriptionStatusCode>[] {
    return [
      {
        pContent: i18n.global.t('entities.wallet.subscriptionStatusFilters.toCreate'),
        pCode: SubscriptionStatusCode.PENDING,
        pValue: stats.statuses[SubscriptionStatusCode.PENDING] ?? 0,
        pColor: SUBSCRIPTION_STATUS_COLOR[SubscriptionStatusCode.PENDING],
        pIconName: SUBSCRIPTION_STATUS_ICON[SubscriptionStatusCode.PENDING],
        pDisabled: false,
      },
      {
        pContent: i18n.global.t('entities.wallet.subscriptionStatusFilters.toVerify'),
        pCode: SubscriptionStatusCode.PENNYLANE_TO_VERIFY,
        pValue: stats.statuses[SubscriptionStatusCode.PENNYLANE_TO_VERIFY] ?? 0,
        pColor: SUBSCRIPTION_STATUS_COLOR[SubscriptionStatusCode.PENNYLANE_TO_VERIFY],
        pIconName: SUBSCRIPTION_STATUS_ICON[SubscriptionStatusCode.PENNYLANE_TO_VERIFY],
        pDisabled: false,
      },
      {
        pContent: i18n.global.t('entities.wallet.subscriptionStatusFilters.created'),
        pCode: SubscriptionStatusCode.PENNYLANE_CREATED,
        pValue: stats.statuses[SubscriptionStatusCode.PENNYLANE_CREATED] ?? 0,
        pColor: SUBSCRIPTION_STATUS_COLOR[SubscriptionStatusCode.PENNYLANE_CREATED],
        pIconName: SUBSCRIPTION_STATUS_ICON[SubscriptionStatusCode.PENNYLANE_CREATED],
        pDisabled: false,
      },
    ]
  }

  static getValidatedFilters(
    stats: SubscriptionStats,
  ): FilterOption<SubscriptionStatusCode>[] {
    return [
      {
        pContent: i18n.global.t('entities.wallet.subscriptionStatusFilters.validated'),
        pCode: SubscriptionStatusCode.VALIDATED,
        pValue: stats.statuses[SubscriptionStatusCode.VALIDATED] ?? 0,
        pColor: SUBSCRIPTION_STATUS_COLOR[SubscriptionStatusCode.VALIDATED],
        pIconName: SUBSCRIPTION_STATUS_ICON[SubscriptionStatusCode.VALIDATED],
        pDisabled: false,
      },
    ]
  }
}
