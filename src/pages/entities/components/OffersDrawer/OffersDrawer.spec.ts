import { describe, it, expect, beforeEach } from 'vitest'
import Subscription from '.'
import { getMockedSubscriptionOffers } from '../SubscriptionOffers/SubscriptionOffersMocks'
import { wrapperFactory } from '@/common/testHelper'
import type { SubscriptionOffer } from '../SubscriptionOffers/SubscriptionOffersTypes'

describe('subscriptionOffers', () => {
  let subscriptionOffers: SubscriptionOffer[]

  beforeEach(() => {
    subscriptionOffers = getMockedSubscriptionOffers()
  })

  describe('props', () => {
    it('should display offers when drawer is opened',
      async () => {
        const wrapper = await wrapperFactory(Subscription, {
          props: {
            modelValue: true,
            subscriptionOffers
          }
        })
        const offers = wrapper.find('[data-ut=offers]')
        expect(offers.exists()).toBeTruthy()
      }
    )
    it('should NOT display offers when drawer is closed',
      async () => {
        const wrapper = await wrapperFactory(Subscription, {
          props: {
            modelValue: false,
            subscriptionOffers
          }
        })
        const offers = wrapper.find('[data-ut=offers]')
        expect(offers.exists()).toBeFalsy()
      }
    )
  })
})
