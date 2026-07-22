import type { Entity } from '@pulse/common/types'
import { ENTITY_STATUS_COLOR, MISSION_TYPE } from '@entities/constants'
import { EntityStatus } from '@entities/modules/wallet/enums'
import type { AccountFilters } from '@entities/types'
import type { SearchCriteria } from '@entities/modules/wallet/types'
import { LastActivityPeriodInDays } from '@entities/enums'
import { FoldersManager } from './folders.manager'
import { FAVORITE_ENTITY_COLOR } from './folders.consts'

const getSearchCriteria = (overrides: Partial<SearchCriteria> = {}): SearchCriteria => ({
  currentPage: 2,
  limit: 90,
  search: 'acme',
  sorting: {
    field: 'name',
    descending: true,
  },
  ...overrides,
})

const getFilters = (overrides: Partial<AccountFilters> = {}): AccountFilters => ({
  isFavoriteFilter: false,
  isCustomerRelationFilter: false,
  ...overrides,
})

describe('FoldersManager', () => {
  describe('getDeploymentStatuses', () => {
    it('returns the three statuses ordered by their deployment status index', () => {
      const statuses = FoldersManager.getDeploymentStatuses()

      expect(statuses).toHaveLength(3)
      expect(statuses.map(({ color }) => color)).toStrictEqual([
        ENTITY_STATUS_COLOR[EntityStatus.TO_DEPLOY],
        ENTITY_STATUS_COLOR[EntityStatus.IN_PROGRESS],
        ENTITY_STATUS_COLOR[EntityStatus.CONNECTED],
      ])
      expect(statuses.map(({ iconName }) => iconName)).toStrictEqual([
        'arrowUpCircle',
        'arrowRepeat',
        'checkCircle',
      ])
    })
  })

  describe('countActiveFilters', () => {
    it('returns 0 when no filter is active', () => {
      expect(FoldersManager.countActiveFilters(getFilters())).toBe(0)
    })

    it('ignores empty mission type and deployment status lists', () => {
      const filters = getFilters({
        missionTypeFilter: [],
        deploymentStatusFilter: [],
      })

      expect(FoldersManager.countActiveFilters(filters)).toBe(0)
    })

    it('counts every active filter', () => {
      const filters = getFilters({
        isFavoriteFilter: true,
        isCustomerRelationFilter: true,
        missionTypeFilter: [MISSION_TYPE.TENUE],
        deploymentStatusFilter: [EntityStatus.CONNECTED.toString()],
        lastActivityPeriodFilter: LastActivityPeriodInDays.LAST_THIRTY_DAYS,
      })

      expect(FoldersManager.countActiveFilters(filters)).toBe(5)
    })
  })

  describe('applyFiltersToSearchCriteria', () => {
    it('maps the drawer filters onto the criteria without losing the other ones', () => {
      const searchCriteria = getSearchCriteria()
      const filters = getFilters({
        isFavoriteFilter: true,
        missionTypeFilter: [MISSION_TYPE.TENUE],
        deploymentStatusFilter: [EntityStatus.CONNECTED.toString()],
        lastActivityPeriodFilter: LastActivityPeriodInDays.LAST_THIRTY_DAYS,
      })

      expect(FoldersManager.applyFiltersToSearchCriteria(searchCriteria, filters)).toStrictEqual({
        ...searchCriteria,
        isFavoriteFilter: true,
        isCustomerRelationFilter: false,
        filterByMissionType: [MISSION_TYPE.TENUE],
        filterByDeploymentStatus: [EntityStatus.CONNECTED.toString()],
        filterByLastActivityPeriodInDays: LastActivityPeriodInDays.LAST_THIRTY_DAYS,
      })
    })
  })

  describe('clearFiltersFromSearchCriteria', () => {
    it('resets every filter and keeps the search, pagination and sorting', () => {
      const searchCriteria = getSearchCriteria({
        isFavoriteFilter: true,
        filterByMissionType: [MISSION_TYPE.TENUE],
      })

      expect(FoldersManager.clearFiltersFromSearchCriteria(searchCriteria)).toStrictEqual({
        ...searchCriteria,
        isFavoriteFilter: false,
        isCustomerRelationFilter: false,
        filterByMissionType: undefined,
        filterByDeploymentStatus: undefined,
        filterByLastActivityPeriodInDays: undefined,
      })
    })
  })

  describe('getDeploymentStatusSearchCriteria', () => {
    it('resets every criterion when no status is given', () => {
      expect(FoldersManager.getDeploymentStatusSearchCriteria(90)).toStrictEqual({
        currentPage: 0,
        limit: 90,
        filterByDeploymentStatus: undefined,
        sorting: {
          field: '',
          descending: false,
        },
      })
    })

    it('keeps only the given deployment status', () => {
      const searchCriteria = FoldersManager.getDeploymentStatusSearchCriteria(5, EntityStatus.TO_DEPLOY)

      expect(searchCriteria.filterByDeploymentStatus).toStrictEqual([EntityStatus.TO_DEPLOY.toString()])
      expect(searchCriteria.limit).toBe(5)
    })
  })

  describe('toFavoriteEntities', () => {
    it('applies the favorite color to every entity', () => {
      const entities = [{ id: 1 }, { id: 2 }] as unknown as Entity[]

      expect(FoldersManager.toFavoriteEntities(entities)).toStrictEqual([
        { id: 1, color: FAVORITE_ENTITY_COLOR },
        { id: 2, color: FAVORITE_ENTITY_COLOR },
      ])
    })

    it('returns undefined when there is no entity', () => {
      expect(FoldersManager.toFavoriteEntities(undefined)).toBeUndefined()
    })
  })

  describe('getSearchValueFromAccountNumbers', () => {
    it.each([
      { accountNumbers: '100', expected: '100' },
      { accountNumbers: ['100'], expected: '100' },
      { accountNumbers: ['100', '200'], expected: '100' },
      { accountNumbers: [], expected: undefined },
      { accountNumbers: [null], expected: undefined },
    ])('returns $expected for $accountNumbers', ({ accountNumbers, expected }) => {
      expect(FoldersManager.getSearchValueFromAccountNumbers(accountNumbers)).toBe(expected)
    })
  })

  describe('getRemovalMessageKeys', () => {
    it('uses the singular keys for a single selected and a single failed folder', () => {
      expect(FoldersManager.getRemovalMessageKeys(1, 1)).toStrictEqual({
        success: 'removeFromFoldersSuccessSingle',
        remainingFailure: 'removeFromFoldersRemainingFailureSingle',
      })
    })

    it('uses the plural keys otherwise', () => {
      expect(FoldersManager.getRemovalMessageKeys(3, 2)).toStrictEqual({
        success: 'removeFromFoldersSuccessMultiple',
        remainingFailure: 'removeFromFoldersRemainingFailureMultiple',
      })
    })
  })
})
