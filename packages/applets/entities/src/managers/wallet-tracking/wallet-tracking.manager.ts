import { AmplitudeService } from '@pulse/common/services/amplitude'
import { AmplitudeEvent } from '@pulse/common/enums'
import {
  WalletFilterType,
  WalletActivityFilterValue,
  WalletMenuActionValue,
  WalletMenuActionType,
  WalletFavoriteActivation,
  WalletMissionTypeFilterValue,
  WalletDeploymentStatusFilterValue,
} from './wallet-tracking.enum'
import type { WalletCustomFilterParams } from './wallet-tracking.types'
import { LastActivityPeriodInDays } from '@entities/enums'
import { MISSION_TYPE } from '@entities/constants'
import { EntityStatus } from '@entities/modules/wallet/enums'

const LAST_ACTIVITY_PERIOD_FILTER_VALUE: Record<LastActivityPeriodInDays, WalletActivityFilterValue> = {
  [LastActivityPeriodInDays.LAST_TWO_WEEKS]: WalletActivityFilterValue.TWO_WEEKS,
  [LastActivityPeriodInDays.LAST_THIRTY_DAYS]: WalletActivityFilterValue.THIRTY_DAYS,
  [LastActivityPeriodInDays.LAST_NINETY_DAYS]: WalletActivityFilterValue.NINETY_DAYS,
}

const MISSION_TYPE_FILTER_VALUE: Record<string, WalletMissionTypeFilterValue> = {
  [MISSION_TYPE.TENUE]: WalletMissionTypeFilterValue.TENUE,
  [MISSION_TYPE.REVISION]: WalletMissionTypeFilterValue.REVISION,
  [MISSION_TYPE.NOT_SPECIFIED]: WalletMissionTypeFilterValue.NOT_SPECIFIED,
}

const DEPLOYMENT_STATUS_FILTER_VALUE: Record<string, WalletDeploymentStatusFilterValue> = {
  [EntityStatus.TO_DEPLOY]: WalletDeploymentStatusFilterValue.TO_DEPLOY,
  [EntityStatus.IN_PROGRESS]: WalletDeploymentStatusFilterValue.IN_PROGRESS,
  [EntityStatus.CONNECTED]: WalletDeploymentStatusFilterValue.CONNECTED,
}

export class WalletTrackingManager {
  static trackWalletSearched(searchValue: string, typeValues: string[]) {
    AmplitudeService.track(AmplitudeEvent.WALLET_ACTION_ACCOUNTS_SEARCHED, {
      wallet_action_search_term: searchValue,
      wallet_action_search_type: typeValues,
    })
  }

  static trackCustomFilterValidated(filters: WalletCustomFilterParams) {
    const filterTypes = WalletTrackingManager.getActiveFilterTypes(filters)

    // Only mission type, deployment status and last activity carry a value: the value dimension
    // stays empty for the boolean filters and when no filter is active at all.
    AmplitudeService.track(AmplitudeEvent.WALLET_ACTION_CUSTOM_FILTER_VALIDATED, {
      wallet_action_filter_type: filterTypes.length > 0 ? filterTypes : [WalletFilterType.NONE],
      wallet_action_filter_value: WalletTrackingManager.getFilterValues(filters),
    })
  }

  static trackFolderMenuAction(actionValue: WalletMenuActionValue, menuType: WalletMenuActionType) {
    AmplitudeService.track(AmplitudeEvent.WALLET_ACTION_FOLDER_MENU_REQUESTED, {
      wallet_action_menu_type: menuType,
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

  private static getFilterValues(filters: WalletCustomFilterParams): string[] {
    const values: string[] = []

    if (filters.missionTypeFilter !== undefined && filters.missionTypeFilter.length > 0) {
      values.push(...filters.missionTypeFilter.map(
        (missionType) => MISSION_TYPE_FILTER_VALUE[missionType] ?? missionType,
      ))
    }

    if (filters.deploymentStatusFilter !== undefined && filters.deploymentStatusFilter.length > 0) {
      values.push(...filters.deploymentStatusFilter.map(
        (deploymentStatus) => DEPLOYMENT_STATUS_FILTER_VALUE[deploymentStatus] ?? deploymentStatus,
      ))
    }

    if (filters.lastActivityPeriodFilter !== undefined) {
      values.push(LAST_ACTIVITY_PERIOD_FILTER_VALUE[filters.lastActivityPeriodFilter])
    }

    return values
  }

  private static getActiveFilterTypes(filters: WalletCustomFilterParams): string[] {
    const filterTypes: string[] = []

    if (filters.isFavoriteFilter) {
      filterTypes.push(WalletFilterType.FAVORITES)
    }

    if (filters.isCustomerRelationFilter) {
      filterTypes.push(WalletFilterType.CUSTOMER_RELATION)
    }

    if (filters.missionTypeFilter !== undefined && filters.missionTypeFilter.length > 0) {
      filterTypes.push(WalletFilterType.MISSION_TYPE)
    }

    if (filters.deploymentStatusFilter !== undefined && filters.deploymentStatusFilter.length > 0) {
      filterTypes.push(WalletFilterType.STATUS)
    }

    if (filters.lastActivityPeriodFilter !== undefined) {
      filterTypes.push(WalletFilterType.LAST_ACTIVITY)
    }

    return filterTypes
  }
}
