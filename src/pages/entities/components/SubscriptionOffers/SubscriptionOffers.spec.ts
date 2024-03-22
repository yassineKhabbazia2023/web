import { describe, it, expect, vi, beforeEach } from 'vitest'
import Subscription from '.'
import { getMockedSubscriptionOffers } from './SubscriptionOffersMocks'
import { mount } from '@vue/test-utils'
import type { SubscriptionOffer } from './SubscriptionOffersTypes'
import { nextTick } from 'vue'

describe('subscriptionOffers', () => {
  let subscriptionOffers: SubscriptionOffer[]

  beforeEach(() => {
    subscriptionOffers = getMockedSubscriptionOffers()
  })

  describe('props', () => {
    it('should display offers',
      () => {
        const wrapper = mount(Subscription, {
          props: {
            subscriptionOffers,
          },
        })
        const offers = wrapper.findAll('[data-testid=offer-list] [data-testid=offer-item]')
        expect(offers).toHaveLength(subscriptionOffers.length)
      },
    )
  })

  describe('interactions', () => {
    describe('when user clicks on second subscription offer', () => {
      it('should emit onSelectOffer',
        async () => {
          const mockMethods = {
            onSelectOffer: vi.fn(),
          }

          const wrapper = mount(Subscription, {
            props: {
              modelValue: true,
              subscriptionOffers,
            },
            methods: mockMethods,
          })
          wrapper
            .find('[data-testid=offer-list] [data-testid=offer-item]:nth-child(2)')
            .trigger('click')
          await nextTick()

          expect(wrapper.emitted('selectOffer')).toBeTruthy()
        },
      )
    })
  })
})
