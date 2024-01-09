import { describe, it, expect, vi, beforeEach } from 'vitest'
import Subscription from '.'
import { getMockedSubscriptionOffers } from './SubscriptionOffersMocks'
import { mount } from '@vue/test-utils'
import type { SubscriptionOffer } from './SubscriptionOffersTypes'

describe('subscriptionOffers', () => {
  let subscriptionOffers: SubscriptionOffer[]

  beforeEach(() => {
    subscriptionOffers = getMockedSubscriptionOffers()
  })

  describe('props', () => {
    it('should display offers',
      async () => {
        const wrapper = await mount(Subscription, {
          props: {
            subscriptionOffers
          }
        })
        const offers = wrapper.findAll('[data-testid=offer-list] [data-testid=offer-item]')
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

          const wrapper = await mount(Subscription, {
            props: {
              modelValue: true,
              subscriptionOffers
            },
            methods: mockMethods
          })
          await wrapper
            .find('[data-testid=offer-list] [data-testid=offer-item]:nth-child(2)')
            .trigger('click')

          expect(wrapper.emitted('selectOffer')).toBeTruthy()
        }
      )
    })
  })
})
