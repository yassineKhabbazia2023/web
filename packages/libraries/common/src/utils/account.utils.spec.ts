import type { SearchCriteria } from '../types/account.types'

import { getQueryParams, getSearchParams } from './account.utils'

const searchCriteria: SearchCriteria = {
  currentPage: 1,
  limit: 15,
  search: undefined,
  filterByDeploymentStatus: undefined,
}

const fullSearchCriteria: SearchCriteria = {
  currentPage: 2,
  limit: 25,
  search: 'test search',
  sorting: {
    field: 'name',
    descending: true,
  },
  accountNumber: 'ACC123',
  filterByDeploymentStatus: 'active',
  isFavoriteFilter: true,
  isCustomerRelationFilter: false,
}

describe('test account.utils', () => {
  describe('getQueryParams', () => {
    it('should return FilterQueryParams with basic properties', () => {
      const result = getQueryParams(searchCriteria)

      expect(result).toEqual({
        pageNumber: 1,
        pageSize: 15,
        search: undefined,
        'sorting.field': undefined,
        'sorting.descending': undefined,
        accountNumber: undefined,
        deploymentStatus: undefined,
        isFavoriteFilter: undefined,
        isCustomerRelationFilter: undefined,
      })
    })

    it('should handle complete SearchCriteria with all properties', () => {
      const result = getQueryParams(fullSearchCriteria)

      expect(result).toEqual({
        pageNumber: 2,
        pageSize: 25,
        search: 'test search',
        'sorting.field': 'name',
        'sorting.descending': true,
        accountNumber: 'ACC123',
        deploymentStatus: 'active',
        isFavoriteFilter: true,
        isCustomerRelationFilter: false,
      })
    })
  })

  describe('getSearchParams', () => {
    it('should return proper queryParams', () => {
      const queryParams = getSearchParams(searchCriteria)
      const expectedSearchParams = [
        'currentuser',
        `?pageNumber=${searchCriteria.currentPage}`,
        `&pageSize=${searchCriteria.limit}`,
      ].join('')

      expect(queryParams).toBe(expectedSearchParams)
    })
    it('should return the correct query parameters when the allAccounts parameter is set to true', () => {
      const queryParams = getSearchParams(searchCriteria, true)
      const expectedSearchParams = [
        'all',
        `?pageNumber=${searchCriteria.currentPage}`,
        `&pageSize=${searchCriteria.limit}`,
      ].join('')

      expect(queryParams).toBe(expectedSearchParams)
    })
  })
})
