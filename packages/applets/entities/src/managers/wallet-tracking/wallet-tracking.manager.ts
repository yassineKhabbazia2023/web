import { AmplitudeService } from '@pulse/common/services/amplitude'
import { AmplitudeEvent } from '@pulse/common/enums'
import { WalletFilterValue, WalletMenuActionValue, WalletFavoriteActivation } from './wallet-tracking.enum'
import type { WalletCustomFilterParams } from './wallet-tracking.types'

export class WalletTrackingManager {
  static trackCustomFilterValidated(filters: WalletCustomFilterParams) {
    const activeFilters = this.getActiveFilters(filters)

    const filterValues = activeFilters.length === 0
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

  private static getActiveFilters(filters: WalletCustomFilterParams): WalletFilterValue[] {
    const activeFilters: WalletFilterValue[] = []

    if (filters.isFavoriteFilter) {
      activeFilters.push(WalletFilterValue.FAVORITES)
    }

    if (filters.isCustomerRelationFilter) {
      activeFilters.push(WalletFilterValue.CUSTOMER_RELATION)
    }

    return activeFilters
  }
}
