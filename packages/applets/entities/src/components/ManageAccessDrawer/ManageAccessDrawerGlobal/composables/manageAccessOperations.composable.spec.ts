import { fetchAccountOperationsMock } from '@entities/__mocks__/vitest'
import type { AccountOperations } from '@entities/services/registry'
import { getPaginationMock } from '@pulse/common/mocks'
import { getAccountOperationsListMock } from '@entities/__mocks__/operations.mocks'

import { useManageAccessOperations } from './manageAccessOperations.composable'


const MANAGE_ACCESS_PAGE_SIZE_MOCK = 5
const accountOperationsListMock = getAccountOperationsListMock()

const searchResultMock = getPaginationMock<AccountOperations>({
  items: accountOperationsListMock,
  currentPage: 2,
  totalItems: 20,
  totalPages: 5,
})

describe('manageAccessOperation.composable', () => {
  describe('initial state', () => {
    it('initialize properly', () => {
      const {
        searchTerm,
        searchResult,
        showPagination,
        showNoOperation,
      } = useManageAccessOperations(MANAGE_ACCESS_PAGE_SIZE_MOCK)

      expect(searchResult.value).toBeUndefined()
      expect(showPagination.value).toStrictEqual(false)
      expect(showNoOperation.value).toStrictEqual(false)
      expect(searchTerm.value).toStrictEqual('')
    })
  })

  describe('call refreshManageAccessOperations twice', () => {
    const searchResultMock1 = searchResultMock
    const searchResultMock2 = {
      ...searchResultMock,
      currentPage: 1,
    }
    const searchResultMock3 = {
      ...searchResultMock,
      currentPage: 5,
    }

    const tests = [{
      pageFirstCall: undefined,
      pageSecondCall: 3,
      expectedCallTimes: 2,
      expectedPageParameterFirstCall: 1,
      expectedPageParameterLastCall: 3,
      expectedSearchResult: searchResultMock2,
    }, {
      pageFirstCall: 2,
      pageSecondCall: 4,
      expectedCallTimes: 2,
      expectedPageParameterFirstCall: 2,
      expectedPageParameterLastCall: 4,
      expectedSearchResult: searchResultMock2,
    }, {
      pageFirstCall: 2,
      pageSecondCall: 40,
      expectedCallTimes: 3,
      expectedPageParameterFirstCall: 2,
      expectedPageParameterLastCall: 5,
      expectedSearchResult: searchResultMock3,
    }]
    it.each(tests)(
      'call fetchAccountOperations properly when pageFirstCall equals $pageFirstCall and pageSecondCall equals $pageSecondCall',
      async ({
        pageFirstCall,
        pageSecondCall,
        expectedCallTimes,
        expectedPageParameterFirstCall,
        expectedPageParameterLastCall,
        expectedSearchResult,
      }) => {
        // Reset mock completely before each test
        fetchAccountOperationsMock.mockReset()
        fetchAccountOperationsMock
          .mockResolvedValueOnce(searchResultMock1)
          .mockResolvedValueOnce(searchResultMock2)
          .mockResolvedValueOnce(searchResultMock3)

        // Create fresh instance for each test
        const {
          searchResult,
          showPagination,
          refreshManageAccessOperations,
        } = useManageAccessOperations(MANAGE_ACCESS_PAGE_SIZE_MOCK)

        const expectedParametersFirstCall = [expectedPageParameterFirstCall, 5, '']
        const expectedParametersSecondCall = [expectedPageParameterLastCall, 5, '']

        await refreshManageAccessOperations({
          page: pageFirstCall,
        })
        await refreshManageAccessOperations({
          page: pageSecondCall,
        })

        expect(fetchAccountOperationsMock).toHaveBeenCalledTimes(expectedCallTimes)
        expect(fetchAccountOperationsMock).toHaveBeenNthCalledWith(1, ...expectedParametersFirstCall)
        expect(fetchAccountOperationsMock).toHaveBeenNthCalledWith(expectedCallTimes, ...expectedParametersSecondCall)
        expect(searchResult.value).toStrictEqual(expectedSearchResult)
        expect(showPagination.value).toStrictEqual(true)
      })
  })

  describe('search', () => {
    const searchNoResultResultMock = {
      ...searchResultMock,
      items: [],
    }
    const tests = [{
      search: '',
      hasResult: false,
      expectedshowNoOperation: true,
      reason: 'no result, no searchTerm',
    }, {
      search: 'anything',
      hasResult: false,
      expectedshowNoOperation: false,
      reason: 'no result, some searchTerm',
    }, {
      search: '',
      hasResult: true,
      expectedshowNoOperation: false,
      reason: 'some result, no searchTerm',
    }, {
      search: 'any search term',
      hasResult: true,
      expectedshowNoOperation: false,
      reason: 'some result, any searchTerm',
    }]
    it.each(tests)('should showNoOperation should be $expectedshowNoOperation when $reason', async ({
      search,
      hasResult,
      expectedshowNoOperation,
    }) => {
      // Reset mock completely before each test
      fetchAccountOperationsMock.mockReset()
      fetchAccountOperationsMock
        .mockResolvedValueOnce(hasResult ? searchResultMock : searchNoResultResultMock)

      // Create fresh instance for each test
      const {
        searchTerm,
        showNoOperation,
        refreshManageAccessOperations,
      } = useManageAccessOperations(MANAGE_ACCESS_PAGE_SIZE_MOCK)
      searchTerm.value = search
      const page = 2
      const expectedParameters = [page, 5, search]

      await refreshManageAccessOperations({ page })
      expect(showNoOperation.value).toBe(expectedshowNoOperation)
      expect(fetchAccountOperationsMock).toHaveBeenCalledExactlyOnceWith(...expectedParameters)
    })
  })
})
