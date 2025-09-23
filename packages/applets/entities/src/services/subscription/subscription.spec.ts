import { describe, it, expect, vi } from 'vitest'
import { subscriptionRequestMock, subscriptionDemandMock } from '@entities/__mocks__/subscription.mocks'
import { API_PREFIXES } from '@pulse/common/constants'
import {
  fetchSubscriptionRequests,
  validateSubscriptionRequest,
  createSubscriptionRequest,
  fetchAccountSubscriptions,
} from '.'

const subscriptionPutMock = vi.fn()
const subscriptionPostMock = vi.fn()

vi.mock('@entities/helper/helper', () => ({
  handleRequestError: vi.fn(),
}))

vi.mock('@pulse/common', () => ({
  commonApi: () => ({
    gateway: {
      get: vi.fn().mockResolvedValue({ data: subscriptionRequestMock }),
      post: subscriptionPostMock,
      put: subscriptionPutMock,
    },
  }),
}))

describe('subscriptionService', () => {
  describe('fetchSubscriptionRequests', () => {
    it('should return subscriptions', async () => {
      const subscriptions = await fetchSubscriptionRequests()

      expect(subscriptions).toHaveLength(subscriptionRequestMock.length)
    })
  })
  describe('fetchAccountSubscriptions', () => {
    it('should return account subscriptions', async () => {
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
      const expectedUrl = 'offer/api/subscription'
      const expectedParams = [
        expectedUrl,
        subscriptionDemandMock,
      ]
      await createSubscriptionRequest(subscriptionDemandMock)

      expect(subscriptionPostMock).toHaveBeenCalledOnce()
      expect(subscriptionPostMock).toHaveBeenCalledWith(...expectedParams)
    })
  })
})
