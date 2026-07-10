import { AmplitudeService } from '@pulse/common/services/amplitude'
import { AmplitudeEvent } from '@pulse/common/enums'
import { WalletFilterValue, WalletMenuActionValue, WalletFavoriteActivation } from './wallet-tracking.enum'
import type { WalletCustomFilterParams } from './wallet-tracking.types'
import { LastActivityPeriodInDays } from '@entities/enums'

const LAST_ACTIVITY_PERIOD_FILTER_VALUE: Record<LastActivityPeriodInDays, WalletFilterValue> = {
  [LastActivityPeriodInDays.LAST_TWO_WEEKS]: WalletFilterValue.LAST_ACTIVITY_TWO_WEEKS,
  [LastActivityPeriodInDays.LAST_THIRTY_DAYS]: WalletFilterValue.LAST_ACTIVITY_THIRTY_DAYS,
  [LastActivityPeriodInDays.LAST_NINETY_DAYS]: WalletFilterValue.LAST_ACTIVITY_NINETY_DAYS,
}

export class WalletTrackingManager {
  static trackWalletSearched(searchValue: string, typeValues: string[]) {
    AmplitudeService.track(AmplitudeEvent.WALLET_ACTION_ACCOUNTS_SEARCHED, {
      wallet_action_search_term: searchValue,
      wallet_action_search_type: typeValues,
    })
  }

  static trackCustomFilterValidated(filters: WalletCustomFilterParams) {
    const activeFilters = this.getActiveFilters(filters)

    const filterValues: string[] = activeFilters.length === 0
      ? [WalletFilterValue.NONE]
      : activeFilters

    AmplitudeService.track(AmplitudeEvent.WALLET_ACTION_CUSTOM_FILTER_VALIDATED, {
      wallet_action_filter_value: filterValues,
    })
  }

  static trackStatusClicked(statusValue: string) {
    AmplitudeService.track(AmplitudeEvent.WALLET_ACTION_STATUS_CLICKED, {
      wallet_action_status_value: statusValue,
    })
  }

  static trackFolderMenuAction(actionValue: WalletMenuActionValue) {
    AmplitudeService.track(AmplitudeEvent.WALLET_ACTION_FOLDER_MENU_REQUESTED, {
      wallet_action_menu_value: actionValue,
    })
  }

  static trackFavoriteRequest(isActivating: boolean) {
    AmplitudeService.track(AmplitudeEvent.WALLET_ACTION_FAVORITE_REQUEST, {
      wallet_action_favorite_activation: isActivating
        ? WalletFavoriteActivation.ACTIVATE
        : WalletFavoriteActivation.DEACTIVATE,
    })
  }

  static trackPaginationSizeChanged(size: number) {
    AmplitudeService.track(AmplitudeEvent.WALLET_ACTION_PAGINATION_REQUESTED, {
      wallet_action_pagination_size: size,
    })
  }

  static trackPaginationPageClicked(page: number) {
    AmplitudeService.track(AmplitudeEvent.WALLET_ACTION_PAGINATION_CONSULTED, {
      wallet_action_pagination_page: page,
    })
  }

  static trackColumnSortRequested(columnLabel: string) {
    AmplitudeService.track(AmplitudeEvent.WALLET_ACTION_COLUMN_SORT_REQUESTED, {
      wallet_action_sort_column: columnLabel,
    })
  }

  private static getActiveFilters(filters: WalletCustomFilterParams): string[] {
    const activeFilters: string[] = []

    if (filters.isFavoriteFilter) {
      activeFilters.push(WalletFilterValue.FAVORITES)
    }

    if (filters.isCustomerRelationFilter) {
      activeFilters.push(WalletFilterValue.CUSTOMER_RELATION)
    }

    if (filters.missionTypeFilter !== undefined && filters.missionTypeFilter.length > 0) {
      activeFilters.push(WalletFilterValue.MISSION_TYPE)
    }

    if (filters.deploymentStatusFilter !== undefined && filters.deploymentStatusFilter.length > 0) {
      activeFilters.push(WalletFilterValue.STATUS)
    }

    if (filters.lastActivityPeriodFilter !== undefined) {
      activeFilters.push(LAST_ACTIVITY_PERIOD_FILTER_VALUE[filters.lastActivityPeriodFilter])
    }

    return activeFilters
  }
}
