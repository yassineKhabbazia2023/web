import { describe, it, expect } from 'vitest'
import OfferSubscription from '.'
import { wrapperFactory } from '@/common/testHelper'
import { getMockedSubscriptionOffersServices } from './OfferSubscriptionMocks'

describe('offerSubscription', () => {
  describe('props', () => {
    it('should contain card', async () => {
      const subscriptionOffer = getMockedSubscriptionOffersServices().at(0)
      const wrapper = await wrapperFactory(OfferSubscription, {
        props: {
          subscriptionOffer
        }
      })
      const card = wrapper.findAll('[data-ut="provider-card"]')

      expect(card).toHaveLength(subscriptionOffer?.providers.length ?? 0)
    })
  })
})
