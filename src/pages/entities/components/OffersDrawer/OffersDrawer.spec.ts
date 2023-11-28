import { describe, it, expect, vi } from 'vitest'
import OffersDrawer from '.'
import { wrapperFactory } from '@/common/testHelper'
import { getMockedSubscriptionOffers } from '../SubscriptionOffers/SubscriptionOffersMocks'
import type { SubscriptionOffer } from '../SubscriptionOffers/SubscriptionOffersTypes'

const subscriptionOffers: SubscriptionOffer[] = getMockedSubscriptionOffers()

vi.mock('@kpmg/common', async () => ({
  commonApi: () => ({
    $patch: vi.fn(),
    offer: {
      get: vi.fn().mockResolvedValue({ data: subscriptionOffers })
    }
  })
}))

describe('subscriptionOffers', () => {
  describe('props', () => {
    it('should close offers drawer when clicking on close buton',
      async () => {
        const wrapper = await wrapperFactory(OffersDrawer, {
          props: {
            modelValue: true
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
            modelValue: true
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
            modelValue: false
          }
        })
        const offers = wrapper.find('[data-ut=offers]')
        expect(offers.exists()).toBeFalsy()
      }
    )
  })
})
