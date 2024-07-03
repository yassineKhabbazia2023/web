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
    it('should display offers', () => {
      const wrapper = mount(Subscription, {
        props: {
          subscriptionOffers,
          activeOffers: [],
        },
      })
      const offers = wrapper.findAll(
        '[data-testid=offer-list] [data-testid=offer-item]',
      )
      expect(offers).toHaveLength(subscriptionOffers.length)
    })
    it('should disable the offer card for active offers', () => {
      const wrapper = mount(Subscription, {
        props: {
          subscriptionOffers,
          activeOffers: ['MEG Smart'],
        },
      })
      const firstOfferCard = wrapper.findComponent({ name: 'POfferCard' })
      expect(firstOfferCard.props('disabled')).toBeTruthy()
    })
  })

  describe('interactions', () => {
    describe('when user clicks on second subscription offer', () => {
      it('should emit onSelectOffer', async () => {
        const mockMethods = {
          onSelectOffer: vi.fn(),
        }

        const wrapper = mount(Subscription, {
          props: {
            modelValue: true,
            subscriptionOffers,
            activeOffers: [],
          },
          methods: mockMethods,
        })
        wrapper
          .find(
            '[data-testid=offer-list] [data-testid=offer-item]:nth-child(2)',
          )
          .trigger('click')
        await nextTick()

        expect(wrapper.emitted('selectOffer')).toBeTruthy()
      })
    })
  })
})
