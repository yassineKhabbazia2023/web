import { getMockedProspectAccountRow } from '@entities/__mocks__'
import { ProspectOnboardingStep } from '@entities/modules/wallet/enums'
import { ProspectsManager } from './prospects.manager'
import { ProspectsService } from '@entities/services/prospects/prospects.service'
import type { SearchCriteria } from '@entities/modules/wallet/types'

const fetchProspectsAccountsMock = vi.fn()

beforeEach(() => {
  vi.spyOn(ProspectsService, 'fetchProspectsAccounts').mockImplementation(fetchProspectsAccountsMock)
})

const defaultSearchCriteria: SearchCriteria = {
  currentPage: 1,
  limit: 15,
  search: '',
  sorting: { field: '', descending: false },
}

describe('ProspectsManager', () => {
  describe('getMappedProspectAccount', () => {
    it('maps prospect data to ProspectWalletData format', () => {
      const result = ProspectsManager.getMappedProspectAccount(getMockedProspectAccountRow())

      expect(result.prospectId).toBe(1)
      expect(result.accountId).toBe(1971)
      expect(result.accountNumber).toBe('P595350001')
      expect(result.name).toBe('Prospect 0001')
      expect(result.isFavorite).toBe(false)
      expect(result.onboardingStep).toBe(ProspectOnboardingStep.LEADER_INFO)
      expect(result.cacFolder).toBe(true)
    })

    it('builds owner object from signatory', () => {
      const result = ProspectsManager.getMappedProspectAccount(getMockedProspectAccountRow())

      expect(result.owner.contactId).toBe(980001)
      expect(result.owner.firstName).toBe('Seed')
      expect(result.owner.lastName).toBe('Signatory')
      expect(result.owner.email).toBe('seed@test.local')
      expect(result.owner.initials).toBe('SS')
    })

    it('handles null stepCode', () => {
      const result = ProspectsManager.getMappedProspectAccount(getMockedProspectAccountRow({ stepCode: null }))

      expect(result.onboardingStep).toBeNull()
    })
  })

  describe('fetchProspectsData', () => {
    it('calls ProspectsService with correct search params', async () => {
      fetchProspectsAccountsMock.mockResolvedValueOnce({
        items: [],
        currentPage: 1,
        totalItems: 0,
        totalPages: 0,
      })

      await ProspectsManager.fetchProspectsData({ ...defaultSearchCriteria, search: 'test' })

      const calledParams = fetchProspectsAccountsMock.mock.calls[0][0]
      expect(calledParams?.get('pageNumber')).toBe('1')
      expect(calledParams?.get('pageSize')).toBe('15')
      expect(calledParams?.get('search')).toBe('test')
    })

    it('includes sorting params when provided', async () => {
      fetchProspectsAccountsMock.mockResolvedValueOnce({
        items: [],
        currentPage: 1,
        totalItems: 0,
        totalPages: 0,
      })

      await ProspectsManager.fetchProspectsData({
        ...defaultSearchCriteria,
        sorting: { field: 'companyName', descending: true },
      })

      const calledParams = fetchProspectsAccountsMock.mock.calls[0][0]
      expect(calledParams?.get('sorting.field')).toBe('companyName')
      expect(calledParams?.get('sorting.descending')).toBe('true')
    })

    it('does not include empty search param', async () => {
      fetchProspectsAccountsMock.mockResolvedValueOnce({
        items: [],
        currentPage: 1,
        totalItems: 0,
        totalPages: 0,
      })

      await ProspectsManager.fetchProspectsData(defaultSearchCriteria)

      const calledParams = fetchProspectsAccountsMock.mock.calls[0][0]
      expect(calledParams?.has('search')).toBe(false)
    })

    it('includes pageNumber even when it is 0', async () => {
      fetchProspectsAccountsMock.mockResolvedValueOnce({
        items: [],
        currentPage: 0,
        totalItems: 0,
        totalPages: 0,
      })

      await ProspectsManager.fetchProspectsData({ ...defaultSearchCriteria, currentPage: 0 })

      const calledParams = fetchProspectsAccountsMock.mock.calls[0][0]
      expect(calledParams?.get('pageNumber')).toBe('0')
    })

    it('includes sorting.descending when it is false', async () => {
      fetchProspectsAccountsMock.mockResolvedValueOnce({
        items: [],
        currentPage: 1,
        totalItems: 0,
        totalPages: 0,
      })

      await ProspectsManager.fetchProspectsData({
        ...defaultSearchCriteria,
        sorting: { field: 'companyName', descending: false },
      })

      const calledParams = fetchProspectsAccountsMock.mock.calls[0][0]
      expect(calledParams?.get('sorting.descending')).toBe('false')
    })

    it('maps response items to ProspectWalletData and returns pagination info', async () => {
      const mockProspect = getMockedProspectAccountRow()
      fetchProspectsAccountsMock.mockResolvedValueOnce({
        items: [mockProspect],
        currentPage: 1,
        totalItems: 1,
        totalPages: 1,
      })

      const result = await ProspectsManager.fetchProspectsData(defaultSearchCriteria)

      expect(result.items).toHaveLength(1)
      expect(result.items[0].name).toBe('Prospect 0001')
      expect(result.currentPage).toBe(1)
      expect(result.totalItems).toBe(1)
      expect(result.totalPage).toBe(1)
    })

    it('returns empty result on error', async () => {
      fetchProspectsAccountsMock.mockRejectedValueOnce(new Error('API error'))

      const result = await ProspectsManager.fetchProspectsData(defaultSearchCriteria)

      expect(result.items).toHaveLength(0)
      expect(result.totalItems).toBe(0)
    })
  })
})
