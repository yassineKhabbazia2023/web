import { describe, it, expect } from 'vitest'
import OfferSubscription from '.'
import { mount } from '@vue/test-utils'
import { getMockedSubscriptionOffersServices } from './OfferSubscriptionMocks'

describe('offerSubscription', () => {
  describe('props', () => {
    it('should contain card', async () => {
      const subscriptionOffers = getMockedSubscriptionOffersServices()
      const subscriptionOffer = subscriptionOffers[0]
      const wrapper = await mount(OfferSubscription, {
        props: {
          subscriptionOffer
        }
      })
      const card = wrapper.findAll('[data-ut="provider-card"]')

      expect(card).toHaveLength(subscriptionOffer?.providers.length ?? 0)
    })
  })
})
