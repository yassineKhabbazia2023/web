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

describe('useFoldersAccountFilters', () => {
  it('starts with no active filter and a closed drawer', () => {
    const { accountFiltersCount, isFiltersDrawerOpen, hasActiveFilters } =
      useFoldersAccountFilters(ref(getSearchCriteria()))

    expect(accountFiltersCount.value).toBe(0)
    expect(isFiltersDrawerOpen.value).toBe(false)
    expect(hasActiveFilters.value).toBe(false)
  })

  it('opens the filters drawer', () => {
    const { isFiltersDrawerOpen, openFiltersDrawer } =
      useFoldersAccountFilters(ref(getSearchCriteria()))

    openFiltersDrawer()

    expect(isFiltersDrawerOpen.value).toBe(true)
  })

  it('applies the filters to the search criteria and closes the drawer', () => {
    const searchCriteria = ref(getSearchCriteria())
    const { accountFiltersCount, applyAccountFilters, isFiltersDrawerOpen, openFiltersDrawer } =
      useFoldersAccountFilters(searchCriteria)

    openFiltersDrawer()
    applyAccountFilters({
      isFavoriteFilter: true,
      isCustomerRelationFilter: false,
      missionTypeFilter: [MISSION_TYPE.TENUE],
      deploymentStatusFilter: [EntityStatus.CONNECTED.toString()],
    })

    expect(accountFiltersCount.value).toBe(3)
    expect(isFiltersDrawerOpen.value).toBe(false)
    expect(searchCriteria.value).toStrictEqual({
      ...getSearchCriteria(),
      isFavoriteFilter: true,
      isCustomerRelationFilter: false,
      filterByMissionType: [MISSION_TYPE.TENUE],
      filterByDeploymentStatus: [EntityStatus.CONNECTED.toString()],
      filterByLastActivityPeriodInDays: undefined,
    })
  })

  it('clears every filter without losing the search and pagination criteria', () => {
    const searchCriteria = ref(getSearchCriteria())
    const {
      accountFiltersCount,
      applyAccountFilters,
      clearAllAccountFilters,
      hasActiveFilters,
    } = useFoldersAccountFilters(searchCriteria)

    applyAccountFilters({
      isFavoriteFilter: true,
      isCustomerRelationFilter: true,
    })
    hasActiveFilters.value = true

    clearAllAccountFilters()

    expect(accountFiltersCount.value).toBe(0)
    expect(hasActiveFilters.value).toBe(false)
    expect(searchCriteria.value).toStrictEqual({
      ...getSearchCriteria(),
      isFavoriteFilter: false,
      isCustomerRelationFilter: false,
      filterByMissionType: undefined,
      filterByDeploymentStatus: undefined,
      filterByLastActivityPeriodInDays: undefined,
    })
  })
})
