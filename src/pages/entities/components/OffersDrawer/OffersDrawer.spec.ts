import { describe, it, expect, vi } from 'vitest'
import { VueWrapper, mount, flushPromises } from '@vue/test-utils'
import OffersDrawer from '.'
import { getMockedSubscriptionOffers } from '../SubscriptionOffers/SubscriptionOffersMocks'
import type { SubscriptionOffer } from '../SubscriptionOffers/SubscriptionOffersTypes'

const subscriptionOffers: SubscriptionOffer[] = getMockedSubscriptionOffers()

vi.mock('@kpmg/common', () => ({
  commonApi: () => ({
    offer: {
      get: vi.fn().mockResolvedValue({ data: subscriptionOffers })
    }
  })
}))

async function getWrapper(isOpened: boolean) {
  const wrapper = await mount(OffersDrawer, {
    props: {
      modelValue: isOpened
    }
  })
  await flushPromises()

  return wrapper
}

describe('offersDrawer', () => {
  describe('interactions', () => {
    it('should close offers drawer when clicking on close buton',
      async () => {
        const wrapper = await getWrapper(true)
        const offers = wrapper.find('[data-ut=offers]')

        expect(wrapper.props('modelValue')).toBeTruthy()
        expect(offers.exists()).toBeTruthy()

        await wrapper.find('.p-drawer__close-button').trigger('click')

        expect(wrapper.emitted()).toHaveProperty('update:modelValue')
      }
    )
    it('should display current offer when an offer is selected',
      async () => {
        const wrapper = await getWrapper(true)
        const secondOffer = wrapper.find('[data-ut=offers] [data-ut=offer-item]:nth-child(2)')
        await secondOffer.trigger('click')
        await flushPromises()

        const offers = wrapper.find('[data-ut=offers]')
        expect(offers.exists()).toBeFalsy()

        const offer = wrapper.find('[data-ut=offer]')
        expect(offer.exists()).toBeTruthy()
      }
    )
    it('should hide current offer when click on previousButton',
      async () => {
        const wrapper = await getWrapper(true)
        const secondOffer = wrapper.find('[data-ut=offers] [data-ut=offer-item]:nth-child(2)')
        await secondOffer?.trigger('click')
        await flushPromises()

        const nextPreviousButtons = wrapper.findComponent('[data-ut=nextPreviousButtons]')
        await (nextPreviousButtons as VueWrapper).vm.$emit('clickPrevious')

        const offers = wrapper.find('[data-ut=offers]')
        expect(offers.exists()).toBeTruthy()

        const offer = wrapper.find('[data-ut=offer]')
        expect(offer.exists()).toBeFalsy()
      }
    )
  })
  describe('props', () => {
    it('should display offers when drawer is opened',
      async () => {
        const wrapper = await getWrapper(true)
        const offers = wrapper.find('[data-ut=offers]')
        expect(offers.exists()).toBeTruthy()
      }
    )
    it('should NOT display offers when drawer is closed',
      async () => {
        const wrapper = await getWrapper(false)
        const offers = wrapper.find('[data-ut=offers]')
        expect(offers.exists()).toBeFalsy()
      }
    )
  })
})
