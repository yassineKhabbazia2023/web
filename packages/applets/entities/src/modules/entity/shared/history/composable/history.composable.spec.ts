import { ref } from 'vue'
import { PAGE_SIZES } from '@pulse/common/constants'
import { HistoryService } from '../services/history.service'
import { getMockedActivity, getMockedActivitiesResponse } from '../__mocks__/history.mocks'
import { useHistory } from './history.composable'

vi.mock('vue', async (importOriginal) => ({
  ...await importOriginal<typeof import('vue')>(),
  onMounted: vi.fn(),
}))
vi.mock('../services/history.service')
vi.mock('@pulse/toolbox')

const fetchActivitiesMock = vi.mocked(HistoryService.fetchActivities)

describe('history.composable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('should set initial state properly', () => {
      const currentAccountId = ref<number | null>(123)
      const search = ref('')

      const {
        isLoading,
        activities,
        currentPage,
        pageSize,
        totalItems,
      } = useHistory(currentAccountId, search)

      expect(isLoading.value).toBe(true)
      expect(activities.value).toEqual([])
      expect(currentPage.value).toBe(1)
      expect(pageSize.value).toBe(PAGE_SIZES[0])
      expect(totalItems.value).toBe(0)
    })
  })

  describe('loadActivities', () => {
    it('should not fetch activities when currentAccountId is null', async () => {
      const currentAccountId = ref<number | null>(null)
      const search = ref('')

      const { loadActivities } = useHistory(currentAccountId, search)

      await loadActivities()

      expect(fetchActivitiesMock).not.toHaveBeenCalled()
    })

    it('should fetch activities and update state on success', async () => {
      const currentAccountId = ref<number | null>(123)
      const search = ref('')
      const mockActivities = [getMockedActivity(1), getMockedActivity(2)]
      const mockResponse = getMockedActivitiesResponse(mockActivities, 10)

      fetchActivitiesMock.mockResolvedValue(mockResponse)

      const {
        isLoading,
        activities,
        totalItems,
        loadActivities,
      } = useHistory(currentAccountId, search)

      await loadActivities()

      expect(fetchActivitiesMock).toHaveBeenCalledWith({
        accountId: 123,
        page: 1,
        pageSize: PAGE_SIZES[0],
        search: '',
      })
      expect(activities.value).toEqual(mockActivities)
      expect(totalItems.value).toBe(10)
      expect(isLoading.value).toBe(false)
    })

    it('should set isLoading to false on error', async () => {
      const currentAccountId = ref<number | null>(123)
      const search = ref('')

      fetchActivitiesMock.mockRejectedValue(new Error('API Error'))

      const { isLoading, loadActivities } = useHistory(currentAccountId, search)

      await loadActivities()

      expect(isLoading.value).toBe(false)
    })

    it('should not update activities on error', async () => {
      const currentAccountId = ref<number | null>(123)
      const search = ref('')

      fetchActivitiesMock.mockRejectedValue(new Error('API Error'))

      const { activities, totalItems, loadActivities } = useHistory(currentAccountId, search)

      await loadActivities()

      expect(activities.value).toEqual([])
      expect(totalItems.value).toBe(0)
    })
  })

  describe('onUpdateCurrentPage', () => {
    it('should update currentPage and reload activities', async () => {
      const currentAccountId = ref<number | null>(123)
      const search = ref('')
      const mockResponse = getMockedActivitiesResponse([getMockedActivity(1)], 5)

      fetchActivitiesMock.mockResolvedValue(mockResponse)

      const { currentPage, onUpdateCurrentPage } = useHistory(currentAccountId, search)

      await onUpdateCurrentPage(3)

      expect(currentPage.value).toBe(3)
      expect(fetchActivitiesMock).toHaveBeenCalledWith({
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

      const { currentPage, pageSize, onPageRangeChanged } = useHistory(currentAccountId, search)

      currentPage.value = 5

      await onPageRangeChanged(50)

      expect(pageSize.value).toBe(50)
      expect(currentPage.value).toBe(1)
      expect(fetchActivitiesMock).toHaveBeenCalledWith({
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

      const { loadActivities } = useHistory(currentAccountId, search)

      await loadActivities()

      expect(fetchActivitiesMock).toHaveBeenCalledWith({
        accountId: 123,
        page: 1,
        pageSize: PAGE_SIZES[0],
        search: 'test query',
      })
    })

    it('should reset currentPage to 1 when search query changes', async () => {
      const currentAccountId = ref<number | null>(123)
      const search = ref('')
      const mockResponse = getMockedActivitiesResponse([getMockedActivity(1)], 5)

      fetchActivitiesMock.mockResolvedValue(mockResponse)

      const { currentPage } = useHistory(currentAccountId, search)

      currentPage.value = 3

      search.value = 'new search'

      await vi.waitFor(() => {
        expect(currentPage.value).toBe(1)
      })
    })
  })
})
