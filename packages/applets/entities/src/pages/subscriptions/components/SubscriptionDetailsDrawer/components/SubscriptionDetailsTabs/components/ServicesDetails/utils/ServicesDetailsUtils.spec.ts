import { describe, it, expect } from 'vitest'
import { getSubscriptionProducts } from './ServicesDetailsUtils'
import { getMockedSubscriptionDetails } from '@entities/__mocks__/subscription.mocks'

const mockedSubscriptionOffer = getMockedSubscriptionDetails().offer
const expectedSubscriptionProducts = [
  {
    isMandatory: true,
    productConfigurationId: 1,
    offerId: 1,
  },
  {
    isMandatory: true,
    productConfigurationId: 2,
    offerId: 1,
  },
]
describe('servicesDetailsUtils', () => {
  describe('getSubscriptionProducts', () => {
    it('should return the correct array of subscription products', () => {
      const subscriptionProducts = getSubscriptionProducts(
        mockedSubscriptionOffer,
      )

      expect(subscriptionProducts).toStrictEqual(expectedSubscriptionProducts)
    })
  })
})
