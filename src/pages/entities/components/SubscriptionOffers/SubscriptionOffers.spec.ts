import { describe, it, expect, vi, beforeEach } from 'vitest'
import Subscription from '.'
import { getMockedSubscriptionOffers } from './SubscriptionOffersMocks'
import { wrapperFactory } from '@/common/testHelper'
import type { SubscriptionOffer } from './SubscriptionOffersTypes'

describe('subscriptionOffers', () => {
  let subscriptionOffers: SubscriptionOffer[]

  beforeEach(() => {
    subscriptionOffers = getMockedSubscriptionOffers('')
  })

  describe('props', () => {
    it('should display offers',
      async () => {
        const wrapper = await wrapperFactory(Subscription, {
          props: {
            subscriptionOffers
          }
        })
        const offers = wrapper.findAll('[data-ut=offer-list] [data-ut=offer-item]')
        expect(offers.length).toBeGreaterThan(0)
        expect(offers).toHaveLength(subscriptionOffers.length)
      }
    )
  })

  describe('interactions', () => {
    describe('when user clicks on second subscription offer', () => {
      it('should emit onSelectOffer',
        async () => {
          const mockMethods = {
            onSelectOffer: vi.fn()
          }

          const wrapper = await wrapperFactory(Subscription, {
            props: {
              modelValue: true,
              subscriptionOffers
            },
            methods: mockMethods
          })
          await wrapper
            .find('[data-ut=offer-list] [data-ut=offer-item]:nth-child(2)')
            .trigger('click')

          expect(wrapper.emitted('selectOffer')).toBeTruthy()
        }
      )
    })
  })
})
