import { describe, it, expect, vi } from 'vitest'
import { subscriptionRequestMock } from './mocks/SubscriptionRequestMock'
import { subscriptionDemandMock } from './mocks/SubscriptionDemandMock'
import {
  fetchSubscriptionRequests, validateSubscriptionRequest, createSubscriptionRequest
} from './SubscriptionsServices'

const subscriptionPutMock = vi.fn()
const subscriptionPostMock = vi.fn()

vi.mock('@kpmg/common', async () => ({
  commonApi: () => ({
    subscription: {
      get: vi.fn().mockResolvedValue({ data: subscriptionRequestMock }),
      put: subscriptionPutMock,
      post: subscriptionPostMock
    }
  })
}))

describe('subscriptionsServices', () => {
  describe('fetchSubscriptionRequests', () => {
    it('should return subscriptions', async () => {
      const subscriptions = await fetchSubscriptionRequests()

      expect(subscriptions).toHaveLength(subscriptionRequestMock.length)
    })
  })
  describe('validateSubscriptionRequest', () => {
    it('should call subscription.put()', async () => {
      const subscriptionId = '1'
      await validateSubscriptionRequest(subscriptionId)

      expect(subscriptionPutMock).toHaveBeenNthCalledWith(1, 'subscription?subscriptionId=1')
    })
  })
  describe('createSubscriptionRequest', () => {
    it('should call subscription.post()', async () => {
      await createSubscriptionRequest(subscriptionDemandMock)

      expect(subscriptionPostMock).toHaveBeenCalledOnce()
    })
  })
})
