import { ref } from 'vue'
import { MISSION_TYPE } from '@entities/constants'
import { EntityStatus } from '@entities/modules/wallet/enums'
import type { SearchCriteria } from '@entities/modules/wallet/types'
import { useFoldersAccountFilters } from './folders-account-filters.composable'

const getSearchCriteria = (): SearchCriteria => ({
  currentPage: 3,
  limit: 90,
  search: 'acme',
  sorting: {
    field: 'name',
    descending: true,
  },
})

const setupComposable = () => {
  const searchCriteria = ref(getSearchCriteria())
  const clearSelectedFolders = vi.fn()

  return {
    searchCriteria,
    clearSelectedFolders,
    ...useFoldersAccountFilters(searchCriteria, clearSelectedFolders),
  }
}

describe('useFoldersAccountFilters', () => {
  it('starts with no active filter and a closed drawer', () => {
    const { accountFiltersCount, isFiltersDrawerOpen, hasActiveFilters } = setupComposable()

    expect(accountFiltersCount.value).toBe(0)
    expect(isFiltersDrawerOpen.value).toBe(false)
    expect(hasActiveFilters.value).toBe(false)
  })

  it('opens the filters drawer', () => {
    const { isFiltersDrawerOpen, openFiltersDrawer } = setupComposable()

    openFiltersDrawer()

    expect(isFiltersDrawerOpen.value).toBe(true)
  })

  it('applies the filters to the search criteria and closes the drawer', () => {
    const {
      accountFiltersCount,
      applyAccountFilters,
      hasActiveFilters,
      isFiltersDrawerOpen,
      openFiltersDrawer,
      searchCriteria,
    } = setupComposable()

    openFiltersDrawer()
    applyAccountFilters({
      isFavoriteFilter: true,
      isCustomerRelationFilter: false,
      missionTypeFilter: [MISSION_TYPE.TENUE],
      deploymentStatusFilter: [EntityStatus.CONNECTED.toString()],
    })

    expect(accountFiltersCount.value).toBe(3)
    expect(hasActiveFilters.value).toBe(true)
    expect(isFiltersDrawerOpen.value).toBe(false)
    expect(searchCriteria.value).toStrictEqual({
      ...getSearchCriteria(),
      currentPage: 0,
      isFavoriteFilter: true,
      isCustomerRelationFilter: false,
      filterByMissionType: [MISSION_TYPE.TENUE],
      filterByDeploymentStatus: [EntityStatus.CONNECTED.toString()],
      filterByLastActivityPeriodInDays: undefined,
    })
  })

  it('exposes one chip per selected value', () => {
    const { activeFilterItems, applyAccountFilters } = setupComposable()

    applyAccountFilters({
      isFavoriteFilter: true,
      isCustomerRelationFilter: false,
      missionTypeFilter: [MISSION_TYPE.TENUE, MISSION_TYPE.REVISION],
    })

    expect(activeFilterItems.value.map(({ pCode }) => pCode)).toStrictEqual([
      'isFavoriteFilter',
      `missionTypeFilter:${MISSION_TYPE.TENUE}`,
      `missionTypeFilter:${MISSION_TYPE.REVISION}`,
    ])
  })

  it('removes a single chip and reapplies the remaining filters to the search criteria', () => {
    const { activeFilterItems, applyAccountFilters, hasActiveFilters, removeAccountFilter, searchCriteria } =
      setupComposable()

    applyAccountFilters({
      isFavoriteFilter: true,
      isCustomerRelationFilter: false,
      missionTypeFilter: [MISSION_TYPE.TENUE, MISSION_TYPE.REVISION],
    })

    removeAccountFilter(`missionTypeFilter:${MISSION_TYPE.TENUE}`)

    expect(activeFilterItems.value.map(({ pCode }) => pCode)).toStrictEqual([
      'isFavoriteFilter',
      `missionTypeFilter:${MISSION_TYPE.REVISION}`,
    ])
    expect(hasActiveFilters.value).toBe(true)
    expect(searchCriteria.value).toStrictEqual({
      ...getSearchCriteria(),
      currentPage: 0,
      isFavoriteFilter: true,
      isCustomerRelationFilter: false,
      filterByMissionType: [MISSION_TYPE.REVISION],
      filterByDeploymentStatus: undefined,
      filterByLastActivityPeriodInDays: undefined,
    })
  })

  it('deactivates the reset CTA once the last chip is removed', () => {
    const { accountFiltersCount, applyAccountFilters, hasActiveFilters, removeAccountFilter } =
      setupComposable()

    applyAccountFilters({
      isFavoriteFilter: true,
      isCustomerRelationFilter: false,
    })

    removeAccountFilter('isFavoriteFilter')

    expect(accountFiltersCount.value).toBe(0)
    expect(hasActiveFilters.value).toBe(false)
  })

  it('clears every filter and goes back to the first page without losing the search criteria', () => {
    const { accountFiltersCount, applyAccountFilters, clearAllAccountFilters, hasActiveFilters, searchCriteria } =
      setupComposable()

    applyAccountFilters({
      isFavoriteFilter: true,
      isCustomerRelationFilter: true,
    })

    clearAllAccountFilters()

    expect(accountFiltersCount.value).toBe(0)
    expect(hasActiveFilters.value).toBe(false)
    expect(searchCriteria.value).toStrictEqual({
      ...getSearchCriteria(),
      currentPage: 0,
      isFavoriteFilter: false,
      isCustomerRelationFilter: false,
      filterByMissionType: undefined,
      filterByDeploymentStatus: undefined,
      filterByLastActivityPeriodInDays: undefined,
    })
  })

  describe('selected folders reset', () => {
    it('drops the selection when filters are applied', () => {
      const { applyAccountFilters, clearSelectedFolders } = setupComposable()

      applyAccountFilters({
        isFavoriteFilter: true,
        isCustomerRelationFilter: false,
      })

      expect(clearSelectedFolders).toHaveBeenCalledOnce()
    })

    it('drops the selection when a chip is removed', () => {
      const { applyAccountFilters, clearSelectedFolders, removeAccountFilter } = setupComposable()

      applyAccountFilters({
        isFavoriteFilter: true,
        isCustomerRelationFilter: true,
      })
      clearSelectedFolders.mockClear()

      removeAccountFilter('isFavoriteFilter')

      expect(clearSelectedFolders).toHaveBeenCalledOnce()
    })

    it('drops the selection when every filter is cleared', () => {
      const { clearAllAccountFilters, clearSelectedFolders } = setupComposable()

      clearAllAccountFilters()

      expect(clearSelectedFolders).toHaveBeenCalledOnce()
    })
  })
})
