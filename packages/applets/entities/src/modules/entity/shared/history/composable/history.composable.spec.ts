import { ref } from 'vue'
import { flushPromises } from '@vue/test-utils'
import { withSetup } from '@pulse/toolbox/utils/test'
import { PAGE_SIZES } from '@pulse/common/constants'
import { HistoryService } from '../services/history.service'
import { getMockedActivity, getMockedActivitiesResponse, getMockedThemes } from '../__mocks__/history.mocks'
import { useHistory } from './history.composable'

vi.mock('../services/history.service')
vi.mock('@pulse/toolbox')

const fetchActivitiesMock = vi.mocked(HistoryService.fetchActivities)
const fetchThemesMock = vi.mocked(HistoryService.fetchThemes)

describe('history.composable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    fetchThemesMock.mockResolvedValue(getMockedThemes())
  })

  describe('initial state', () => {
    it('should set initial state properly', () => {
      const currentAccountId = ref<number | null>(123)
      const search = ref('')

      const [result] = withSetup(() => useHistory(currentAccountId, search))

      expect(result.isLoading.value).toBe(true)
      expect(result.activities.value).toEqual([])
      expect(result.currentPage.value).toBe(1)
      expect(result.pageSize.value).toBe(PAGE_SIZES[0])
      expect(result.totalItems.value).toBe(0)
      expect(result.themes.value).toEqual([])
      expect(result.selectedCategoryIds.value).toEqual([])
      expect(result.dateRange.value).toBe(null)
      expect(result.activeFiltersCount.value).toBe(0)
    })
  })

  describe('initial loading on mount', () => {
    it('should fetch themes and activities on mount', async () => {
      const currentAccountId = ref<number | null>(123)
      const search = ref('')
      const mockActivities = [getMockedActivity(1), getMockedActivity(2)]
      const mockResponse = getMockedActivitiesResponse(mockActivities, 10)
      const mockThemes = getMockedThemes()

      fetchActivitiesMock.mockResolvedValue(mockResponse)
      fetchThemesMock.mockResolvedValue(mockThemes)

      const [result] = withSetup(() => useHistory(currentAccountId, search))

      await flushPromises()

      expect(fetchThemesMock).toHaveBeenCalledOnce()
      expect(fetchActivitiesMock).toHaveBeenCalledOnce()
      expect(result.activities.value).toEqual(mockActivities)
      expect(result.totalItems.value).toBe(10)
      expect(result.themes.value).toEqual(mockThemes)
      expect(result.isLoading.value).toBe(false)
    })

    it('should not fetch activities when currentAccountId is null', async () => {
      const currentAccountId = ref<number | null>(null)
      const search = ref('')

      withSetup(() => useHistory(currentAccountId, search))

      await flushPromises()

      expect(fetchThemesMock).toHaveBeenCalledOnce()
      expect(fetchActivitiesMock).not.toHaveBeenCalled()
    })

    it('should handle errors gracefully during initial load', async () => {
      const currentAccountId = ref<number | null>(123)
      const search = ref('')

      fetchActivitiesMock.mockRejectedValue(new Error('API Error'))
      fetchThemesMock.mockRejectedValue(new Error('Theme Error'))

      const [result] = withSetup(() => useHistory(currentAccountId, search))

      await flushPromises()

      expect(result.isLoading.value).toBe(false)
      expect(result.activities.value).toEqual([])
      expect(result.totalItems.value).toBe(0)
      expect(result.themes.value).toEqual([])
    })
  })

  describe('onUpdateCurrentPage', () => {
    it('should update currentPage and reload activities', async () => {
      const currentAccountId = ref<number | null>(123)
      const search = ref('')
      const mockResponse = getMockedActivitiesResponse([getMockedActivity(1)], 5)

      fetchActivitiesMock.mockResolvedValue(mockResponse)

      const [result] = withSetup(() => useHistory(currentAccountId, search))

      await flushPromises()

      expect(fetchActivitiesMock).toHaveBeenCalledOnce()

      await result.onUpdateCurrentPage(3)

      expect(result.currentPage.value).toBe(3)
      expect(fetchActivitiesMock).toHaveBeenCalledTimes(2)
      expect(fetchActivitiesMock).toHaveBeenLastCalledWith({
        accountId: 123,
        page: 3,
        pageSize: PAGE_SIZES[0],
        search: '',
      })
    })
  })

  describe('onPageRangeChanged', () => {
    it('should update pageSize, reset currentPage to 1, and reload activities', async () => {
      const currentAccountId = ref<number | null>(123)
      const search = ref('')
      const mockResponse = getMockedActivitiesResponse([getMockedActivity(1)], 5)

      fetchActivitiesMock.mockResolvedValue(mockResponse)

      const [result] = withSetup(() => useHistory(currentAccountId, search))

      await flushPromises()

      expect(fetchActivitiesMock).toHaveBeenCalledOnce()

      result.currentPage.value = 5

      await result.onPageRangeChanged(50)

      expect(result.pageSize.value).toBe(50)
      expect(result.currentPage.value).toBe(1)
      expect(fetchActivitiesMock).toHaveBeenCalledTimes(2)
      expect(fetchActivitiesMock).toHaveBeenLastCalledWith({
        accountId: 123,
        page: 1,
        pageSize: 50,
        search: '',
      })
    })
  })

  describe('search functionality', () => {
    it('should include search query in API call when search is provided', async () => {
      const currentAccountId = ref<number | null>(123)
      const search = ref('test query')
      const mockResponse = getMockedActivitiesResponse([getMockedActivity(1)], 5)

      fetchActivitiesMock.mockResolvedValue(mockResponse)

      withSetup(() => useHistory(currentAccountId, search))

      await flushPromises()

      expect(fetchActivitiesMock).toHaveBeenCalledWith({
        accountId: 123,
        page: 1,
        pageSize: PAGE_SIZES[0],
        search: 'test query',
      })
    })

    it('should reset currentPage to 1 and reload when search query changes', async () => {
      const currentAccountId = ref<number | null>(123)
      const search = ref('')
      const mockResponse = getMockedActivitiesResponse([getMockedActivity(1)], 5)

      fetchActivitiesMock.mockResolvedValue(mockResponse)

      const [result] = withSetup(() => useHistory(currentAccountId, search))

      await flushPromises()

      expect(fetchActivitiesMock).toHaveBeenCalledOnce()

      result.currentPage.value = 3

      search.value = 'new search'

      await flushPromises()

      expect(result.currentPage.value).toBe(1)
      expect(fetchActivitiesMock).toHaveBeenCalledTimes(2)
      expect(fetchActivitiesMock).toHaveBeenLastCalledWith({
        accountId: 123,
        page: 1,
        pageSize: PAGE_SIZES[0],
        search: 'new search',
      })
    })
  })

  describe('filter functionality', () => {
    describe('activeFiltersCount', () => {
      it('should return 0 when no filters are applied', () => {
        const currentAccountId = ref<number | null>(123)
        const search = ref('')

        const [result] = withSetup(() => useHistory(currentAccountId, search))

        expect(result.activeFiltersCount.value).toBe(0)
      })

      it('should count selected categories', async () => {
        const currentAccountId = ref<number | null>(123)
        const search = ref('')
        const mockResponse = getMockedActivitiesResponse([getMockedActivity(1)], 5)

        fetchActivitiesMock.mockResolvedValue(mockResponse)

        const [result] = withSetup(() => useHistory(currentAccountId, search))

        await flushPromises()

        expect(fetchActivitiesMock).toHaveBeenCalledOnce()

        await result.applyFilters({ categoryIds: [1, 2, 3], dateRange: null })

        expect(result.activeFiltersCount.value).toBe(3)
      })

      it('should count date range as 1 filter', async () => {
        const currentAccountId = ref<number | null>(123)
        const search = ref('')
        const mockResponse = getMockedActivitiesResponse([getMockedActivity(1)], 5)

        fetchActivitiesMock.mockResolvedValue(mockResponse)

        const [result] = withSetup(() => useHistory(currentAccountId, search))

        await flushPromises()

        expect(fetchActivitiesMock).toHaveBeenCalledOnce()

        const dateRange: [Date, Date] = [new Date('2024-01-01'), new Date('2024-01-31')]
        await result.applyFilters({ categoryIds: [], dateRange })

        expect(result.activeFiltersCount.value).toBe(1)
      })

      it('should count both categories and date range', async () => {
        const currentAccountId = ref<number | null>(123)
        const search = ref('')
        const mockResponse = getMockedActivitiesResponse([getMockedActivity(1)], 5)

        fetchActivitiesMock.mockResolvedValue(mockResponse)

        const [result] = withSetup(() => useHistory(currentAccountId, search))

        await flushPromises()

        expect(fetchActivitiesMock).toHaveBeenCalledOnce()

        const dateRange: [Date, Date] = [new Date('2024-01-01'), new Date('2024-01-31')]
        await result.applyFilters({ categoryIds: [1, 2], dateRange })

        expect(result.activeFiltersCount.value).toBe(3)
      })
    })

    describe('applyFilters', () => {
      it('should apply category filters and reload activities', async () => {
        const currentAccountId = ref<number | null>(123)
        const search = ref('')
        const mockResponse = getMockedActivitiesResponse([getMockedActivity(1)], 5)

        fetchActivitiesMock.mockResolvedValue(mockResponse)

        const [result] = withSetup(() => useHistory(currentAccountId, search))

        await flushPromises()

        expect(fetchActivitiesMock).toHaveBeenCalledOnce()

        result.currentPage.value = 3

        await result.applyFilters({ categoryIds: [1, 2], dateRange: null })

        expect(result.currentPage.value).toBe(1)
        expect(result.selectedCategoryIds.value).toEqual([1, 2])
        expect(fetchActivitiesMock).toHaveBeenCalledTimes(2)
        expect(fetchActivitiesMock).toHaveBeenLastCalledWith({
          accountId: 123,
          page: 1,
          pageSize: PAGE_SIZES[0],
          search: '',
          categoryIds: [1, 2],
          themeIds: [1],
        })
      })

      it('should apply date range filter and reload activities', async () => {
        const currentAccountId = ref<number | null>(123)
        const search = ref('')
        const mockResponse = getMockedActivitiesResponse([getMockedActivity(1)], 5)

        fetchActivitiesMock.mockResolvedValue(mockResponse)

        const [result] = withSetup(() => useHistory(currentAccountId, search))

        await flushPromises()

        expect(fetchActivitiesMock).toHaveBeenCalledOnce()

        const dateRangeValue: [Date, Date] = [new Date('2024-01-01'), new Date('2024-01-31')]
        await result.applyFilters({ categoryIds: [], dateRange: dateRangeValue })

        expect(result.dateRange.value).toEqual(dateRangeValue)
        expect(fetchActivitiesMock).toHaveBeenCalledTimes(2)
        expect(fetchActivitiesMock).toHaveBeenLastCalledWith(
          expect.objectContaining({
            accountId: 123,
            page: 1,
            pageSize: PAGE_SIZES[0],
            search: '',
            fromDate: expect.any(String),
            toDate: expect.any(String),
          }),
        )
      })

      it('should apply both filters and include correct themeIds', async () => {
        const currentAccountId = ref<number | null>(123)
        const search = ref('')
        const mockResponse = getMockedActivitiesResponse([getMockedActivity(1)], 5)

        fetchActivitiesMock.mockResolvedValue(mockResponse)

        const [result] = withSetup(() => useHistory(currentAccountId, search))

        await flushPromises()

        expect(fetchActivitiesMock).toHaveBeenCalledOnce()

        const dateRangeValue: [Date, Date] = [new Date('2024-01-01'), new Date('2024-01-31')]
        await result.applyFilters({ categoryIds: [1, 3], dateRange: dateRangeValue })

        expect(fetchActivitiesMock).toHaveBeenCalledTimes(2)
        expect(fetchActivitiesMock).toHaveBeenLastCalledWith(
          expect.objectContaining({
            accountId: 123,
            categoryIds: [1, 3],
            themeIds: [1, 2],
            fromDate: expect.any(String),
            toDate: expect.any(String),
          }),
        )
      })
    })

    describe('resetFilters', () => {
      it('should clear all filters and reload activities', async () => {
        const currentAccountId = ref<number | null>(123)
        const search = ref('')
        const mockResponse = getMockedActivitiesResponse([getMockedActivity(1)], 5)

        fetchActivitiesMock.mockResolvedValue(mockResponse)

        const [result] = withSetup(() => useHistory(currentAccountId, search))

        await flushPromises()

        expect(fetchActivitiesMock).toHaveBeenCalledOnce()

        const dateRangeValue: [Date, Date] = [new Date('2024-01-01'), new Date('2024-01-31')]
        await result.applyFilters({ categoryIds: [1, 2], dateRange: dateRangeValue })

        result.currentPage.value = 3

        await result.resetFilters()

        expect(result.selectedCategoryIds.value).toEqual([])
        expect(result.dateRange.value).toBe(null)
        expect(result.currentPage.value).toBe(1)
        expect(fetchActivitiesMock).toHaveBeenCalledTimes(3)
        expect(fetchActivitiesMock).toHaveBeenLastCalledWith({
          accountId: 123,
          page: 1,
          pageSize: PAGE_SIZES[0],
          search: '',
        })
      })
    })
  })
})
