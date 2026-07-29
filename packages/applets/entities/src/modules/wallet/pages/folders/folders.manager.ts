import { i18n } from '@pulse/common/i18n'
import type { Entity } from '@pulse/common/types'
import type { ActiveFilterItem } from '@pulse/styleguide/types'
import { ENTITY_STATUS_COLOR } from '@entities/constants'
import { EntityStatus } from '@entities/modules/wallet/enums'
import type { AccountFilters } from '@entities/types'
import type { DeploymentStatus, SearchCriteria } from '@entities/modules/wallet/types'
import {
  ACCOUNT_FILTERS_I18N_KEY,
  LAST_ACTIVITY_PERIOD_OPTIONS,
  MULTI_SELECT_FILTER_GROUPS,
} from './components/AccountFiltersDrawer/account-filters-drawer.consts'
import {
  ACCOUNT_FILTER_CODE_SEPARATOR,
  CUSTOMER_RELATION_FILTER_CODE,
  FAVORITE_ENTITY_COLOR,
  FAVORITE_FILTER_CODE,
  I18N_KEY,
  LAST_ACTIVITY_PERIOD_FILTER_CODE,
} from './folders.consts'

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

  /** One chip per selected value, so a single value can be removed without clearing its whole group. */
  static toActiveFilterItems(filters: AccountFilters): ActiveFilterItem[] {
    const { t } = i18n.global
    const items: ActiveFilterItem[] = []

    if (filters.isFavoriteFilter) {
      items.push({
        pCode: FAVORITE_FILTER_CODE,
        pContent: t(`${ACCOUNT_FILTERS_I18N_KEY}.favorites`),
        pColor: 'default',
      })
    }

    if (filters.isCustomerRelationFilter) {
      items.push({
        pCode: CUSTOMER_RELATION_FILTER_CODE,
        pContent: t(`${ACCOUNT_FILTERS_I18N_KEY}.customerRelationship`),
        pColor: 'default',
      })
    }

    MULTI_SELECT_FILTER_GROUPS.forEach((group) => {
      const selectedValues = filters[group.field] ?? []

      group.options
        .filter(({ value }) => selectedValues.includes(value))
        .forEach(({ value, labelKey }) => {
          items.push({
            pCode: `${group.field}${ACCOUNT_FILTER_CODE_SEPARATOR}${value}`,
            pContent: t(`${ACCOUNT_FILTERS_I18N_KEY}.${labelKey}`),
            pColor: 'default',
          })
        })
    })

    const lastActivityPeriod = LAST_ACTIVITY_PERIOD_OPTIONS
      .find(({ value }) => value === filters.lastActivityPeriodFilter)

    if (lastActivityPeriod !== undefined) {
      items.push({
        pCode: LAST_ACTIVITY_PERIOD_FILTER_CODE,
        pContent: t(`${ACCOUNT_FILTERS_I18N_KEY}.${lastActivityPeriod.labelKey}`),
        pColor: 'default',
      })
    }

    return items
  }

  static removeFilterFromAccountFilters(filters: AccountFilters, code: string): AccountFilters {
    // Splits `missionTypeFilter:Tenue` into its field and its value. A single-valued code has no
    // separator: `value` stays undefined and only the field comparisons below can match.
    const [group, value] = code.split(ACCOUNT_FILTER_CODE_SEPARATOR)

    if (group === FAVORITE_FILTER_CODE) {
      return { ...filters, isFavoriteFilter: false }
    }

    if (group === CUSTOMER_RELATION_FILTER_CODE) {
      return { ...filters, isCustomerRelationFilter: false }
    }

    if (group === LAST_ACTIVITY_PERIOD_FILTER_CODE) {
      return { ...filters, lastActivityPeriodFilter: undefined }
    }

    const multiSelectGroup = MULTI_SELECT_FILTER_GROUPS.find(({ field }) => field === group)

    if (multiSelectGroup === undefined) {
      return filters
    }

    return {
      ...filters,
      [multiSelectGroup.field]: (filters[multiSelectGroup.field] ?? [])
        .filter((selectedValue) => selectedValue !== value),
    }
  }

  /** Goes back to the first page: the filtered result set may not have as many pages. */
  static applyFiltersToSearchCriteria(
    searchCriteria: SearchCriteria,
    filters: AccountFilters,
  ): SearchCriteria {
    return {
      ...searchCriteria,
      currentPage: 0,
      isFavoriteFilter: filters.isFavoriteFilter,
      isCustomerRelationFilter: filters.isCustomerRelationFilter,
      filterByMissionType: filters.missionTypeFilter,
      filterByDeploymentStatus: filters.deploymentStatusFilter,
      filterByLastActivityPeriodInDays: filters.lastActivityPeriodFilter,
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
