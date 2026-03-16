import { describe, it, expect, vi } from 'vitest'
import { getMockedSubscriptionPaginationResponse, subscriptionDemandMock, subscriptionRequestMock } from '@entities/__mocks__/subscription.mocks'
import { API_PREFIXES } from '@pulse/common/constants'
import { SubscriptionStatusCode } from './subscriptionTypes'
import {
  fetchSubscriptionRequests,
  validateSubscriptionRequest,
  createSubscriptionRequest,
  fetchAccountSubscriptions,
} from '.'

const subscriptionGetMock = vi.hoisted(() => vi.fn())
const subscriptionPutMock = vi.hoisted(() => vi.fn())
const subscriptionPostMock = vi.hoisted(() => vi.fn())

vi.mock('@entities/helpers/entity.helper', () => ({
  handleRequestError: vi.fn(),
}))

vi.mock('@pulse/common/api', () => ({
  api: ({
    gateway: {
      get: subscriptionGetMock,
      post: subscriptionPostMock,
      put: subscriptionPutMock,
    },
  }),
}))

describe('subscriptionService', () => {
  const paginationResponseMock = getMockedSubscriptionPaginationResponse()

  beforeEach(() => {
    subscriptionGetMock.mockResolvedValue({ data: paginationResponseMock })
  })

  describe('fetchSubscriptionRequests', () => {
    it('should return a paginated response', async () => {
      const result = await fetchSubscriptionRequests()

      expect(result.items).toHaveLength(paginationResponseMock.items.length)
      expect(result.currentPage).toBe(1)
      expect(result.totalItems).toBe(paginationResponseMock.totalItems)
    })

    it('should pass pagination and sort params to the API', async () => {
      await fetchSubscriptionRequests({
        statusCodes: [SubscriptionStatusCode.PENDING],
        offerCodes: ['MEG Smart'],
        page: 2,
        pageSize: 15,
        sortField: 'creationDate',
        sortDescending: true,
      })

      const callArgs = subscriptionGetMock.mock.calls.at(-1)!
      const params = callArgs[1].params as URLSearchParams

      expect(params.get('status')).toBe(SubscriptionStatusCode.PENDING)
      expect(params.get('offerCode')).toBe('MEG Smart')
      expect(params.get('page')).toBe('2')
      expect(params.get('pageSize')).toBe('15')
      expect(params.get('sorting.field')).toBe('creationDate')
      expect(params.get('sorting.descending')).toBe('true')
    })

    it('should send offerCode=null when offerCodes is an empty array', async () => {
      await fetchSubscriptionRequests({
        offerCodes: [],
      })

      const callArgs = subscriptionGetMock.mock.calls.at(-1)!
      const params = callArgs[1].params as URLSearchParams

      expect(params.get('offerCode')).toBe('null')
    })
  })
  describe('fetchAccountSubscriptions', () => {
    it('should return account subscriptions', async () => {
      subscriptionGetMock.mockResolvedValueOnce({ data: subscriptionRequestMock })
      const accountSubscriptions = await fetchAccountSubscriptions(5)

      expect(accountSubscriptions).toHaveLength(subscriptionRequestMock.length)
    })
  })
  describe('validateSubscriptionRequest', () => {
    it('should call subscription.put()', async () => {
      const subscriptionId = 1
      await validateSubscriptionRequest(subscriptionId, 'test@test.fr')
      expect(subscriptionPutMock).toHaveBeenNthCalledWith(
        1,
        `${API_PREFIXES.OFFER}/subscription/1?validator=test@test.fr`,
      )
    })
  })
  describe('createSubscriptionRequest', () => {
    it('should call subscription.post()', async () => {
      const expectedUrl = 'offer/api/subscription/create'
      const expectedParams = [
        expectedUrl,
        subscriptionDemandMock,
      ]
      await createSubscriptionRequest(subscriptionDemandMock)

      expect(subscriptionPostMock).toHaveBeenCalledExactlyOnceWith(...expectedParams)
    })
  })
})
