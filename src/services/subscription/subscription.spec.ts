import { describe, it, expect, vi } from 'vitest'
import { subscriptionRequestMock } from '@/pages/subscriptions/mocks/SubscriptionRequestMock'
import { subscriptionDemandMock } from '@/pages/subscriptions/mocks/SubscriptionDemandMock'
import {
  fetchSubscriptionRequests,
  validateSubscriptionRequest,
  createSubscriptionRequest,
} from '.'
import { API_PREFIXES } from '../config'

const subscriptionPutMock = vi.fn()
const subscriptionPostMock = vi.fn()

vi.mock('@kpmg/common', () => ({
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
  describe('validateSubscriptionRequest', () => {
    it('should call subscription.put()', async () => {
      const subscriptionId = 1
      await validateSubscriptionRequest(subscriptionId, 'test@test.com')
      expect(subscriptionPutMock).toHaveBeenNthCalledWith(
        1,
        `${API_PREFIXES.OFFER}/subscription/1?validator=test@test.com`,
      )
    })
  })
  describe('createSubscriptionRequest', () => {
    it('should call subscription.post()', async () => {
      await createSubscriptionRequest(subscriptionDemandMock)

      expect(subscriptionPostMock).toHaveBeenCalledOnce()
    })
  })
})
