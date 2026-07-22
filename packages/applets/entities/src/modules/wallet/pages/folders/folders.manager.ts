import { i18n } from '@pulse/common/i18n'
import type { Entity } from '@pulse/common/types'
import { ENTITY_STATUS_COLOR } from '@entities/constants'
import { EntityStatus } from '@entities/modules/wallet/enums'
import type { AccountFilters } from '@entities/types'
import type { DeploymentStatus, SearchCriteria } from '@entities/modules/wallet/types'
import { FAVORITE_ENTITY_COLOR, I18N_KEY } from './folders.consts'

type AccountNumbersQuery = string | null | (string | null)[]

interface RemovalMessageKeys {
  success: string,
  remainingFailure: string
}

export class FoldersManager {
  /**
   * Deployment statuses are ordered: `FoldersUtils` resolves an account status
   * through its 1-based index, so the order must not change.
   */
  static getDeploymentStatuses(): DeploymentStatus[] {
    const { t } = i18n.global

    return [
      {
        text: t(`${I18N_KEY}.toDeploy`),
        color: ENTITY_STATUS_COLOR[EntityStatus.TO_DEPLOY],
        iconName: 'arrowUpCircle',
      },
      {
        text: t(`${I18N_KEY}.inProgress`),
        color: ENTITY_STATUS_COLOR[EntityStatus.IN_PROGRESS],
        iconName: 'arrowRepeat',
      },
      {
        text: t(`${I18N_KEY}.connected`),
        color: ENTITY_STATUS_COLOR[EntityStatus.CONNECTED],
        iconName: 'checkCircle',
      },
    ]
  }

  static countActiveFilters(filters: AccountFilters): number {
    const {
      isFavoriteFilter,
      isCustomerRelationFilter,
      missionTypeFilter,
      deploymentStatusFilter,
      lastActivityPeriodFilter,
    } = filters

    return (isFavoriteFilter ? 1 : 0) +
      (isCustomerRelationFilter ? 1 : 0) +
      (missionTypeFilter !== undefined && missionTypeFilter.length > 0 ? 1 : 0) +
      (deploymentStatusFilter !== undefined && deploymentStatusFilter.length > 0 ? 1 : 0) +
      (lastActivityPeriodFilter !== undefined ? 1 : 0)
  }

  static applyFiltersToSearchCriteria(
    searchCriteria: SearchCriteria,
    filters: AccountFilters,
  ): SearchCriteria {
    return {
      ...searchCriteria,
      isFavoriteFilter: filters.isFavoriteFilter,
      isCustomerRelationFilter: filters.isCustomerRelationFilter,
      filterByMissionType: filters.missionTypeFilter,
      filterByDeploymentStatus: filters.deploymentStatusFilter,
      filterByLastActivityPeriodInDays: filters.lastActivityPeriodFilter,
    }
  }

  static clearFiltersFromSearchCriteria(searchCriteria: SearchCriteria): SearchCriteria {
    return {
      ...searchCriteria,
      isFavoriteFilter: false,
      isCustomerRelationFilter: false,
      filterByMissionType: undefined,
      filterByDeploymentStatus: undefined,
      filterByLastActivityPeriodInDays: undefined,
    }
  }

  /**
   * Deployment status shortcuts reset every other criterion, unlike the filters drawer.
   */
  static getDeploymentStatusSearchCriteria(limit: number, status?: EntityStatus): SearchCriteria {
    return {
      currentPage: 0,
      limit,
      filterByDeploymentStatus: status === undefined ? undefined : [status.toString()],
      sorting: {
        field: '',
        descending: false,
      },
    }
  }

  static toFavoriteEntities(entities: Entity[] | undefined): Entity[] {
    return entities?.map((entity) => ({
      ...entity,
      color: FAVORITE_ENTITY_COLOR,
    })) as Entity[]
  }

  static getSearchValueFromAccountNumbers(accountNumbers: AccountNumbersQuery): string | undefined {
    if (Array.isArray(accountNumbers)) {
      return accountNumbers.at(0) ?? undefined
    }

    return `${accountNumbers ?? ''}`
  }

  static getRemovalMessageKeys(selectedCount: number, failedCount: number): RemovalMessageKeys {
    return {
      success: selectedCount === 1
        ? 'removeFromFoldersSuccessSingle'
        : 'removeFromFoldersSuccessMultiple',
      remainingFailure: failedCount === 1
        ? 'removeFromFoldersRemainingFailureSingle'
        : 'removeFromFoldersRemainingFailureMultiple',
    }
  }
}
