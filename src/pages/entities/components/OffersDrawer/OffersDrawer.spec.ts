import { describe, it, expect, beforeEach } from 'vitest'
import OffersDrawer from '.'
import { getMockedSubscriptionOffers } from '../SubscriptionOffers/SubscriptionOffersMocks'
import { wrapperFactory } from '@/common/testHelper'
import type { SubscriptionOffer } from '../SubscriptionOffers/SubscriptionOffersTypes'

describe('subscriptionOffers', () => {
  let subscriptionOffers: SubscriptionOffer[]

  beforeEach(() => {
    subscriptionOffers = getMockedSubscriptionOffers('')
  })

  describe('props', () => {
    it('should close offers drawer when clicking on close buton',
      async () => {
        const wrapper = await wrapperFactory(OffersDrawer, {
          props: {
            modelValue: true,
            subscriptionOffers
          }
        })
        const offers = wrapper.find('[data-ut=offers]')

        expect(wrapper.props('modelValue')).toBeTruthy()
        expect(offers.exists()).toBeTruthy()

        await wrapper.find('.p-drawer__close-button').trigger('click')

        expect(wrapper.emitted()).toHaveProperty('update:modelValue')
      }
    )
    it('should display offers when drawer is opened',
      async () => {
        const wrapper = await wrapperFactory(OffersDrawer, {
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
        const wrapper = await wrapperFactory(OffersDrawer, {
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
