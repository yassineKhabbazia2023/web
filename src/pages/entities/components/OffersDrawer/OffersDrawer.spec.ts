import { describe, it, expect, vi } from 'vitest'
import { VueWrapper, mount, flushPromises } from '@vue/test-utils'
import OffersDrawer from '.'
import { getMockedSubscriptionOffers } from '../SubscriptionOffers/SubscriptionOffersMocks'
import { getMockedSubscriptionOffersServices } from '../OfferSubscription/OfferSubscriptionMocks'
import type {
  SubscriptionOffer,
  SubscriptionOfferServices
} from '../SubscriptionOffers/SubscriptionOffersTypes'

const subscriptionOffers: SubscriptionOffer[] = getMockedSubscriptionOffers()
const subscriptionOffersServices: SubscriptionOfferServices[] =
getMockedSubscriptionOffersServices()

vi.mock('@/services/offer', () => ({
  getAllOffers: vi.fn(() => Promise.resolve(subscriptionOffers)),
  getOffer: vi.fn((offerId) =>
    Promise.resolve(subscriptionOffersServices.find((item) => item.offerId === offerId))
  )
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
  describe('offerStepper', () => {
    it('step should change after clicking the Next button', async () => {
      const wrapper = await getWrapper(true)
      const firstOffer = wrapper.find('[data-ut=offers] [data-ut=offer-item]')
      await firstOffer.trigger('click')
      await flushPromises()

      const offerStepper = wrapper.find('[data-ut=offer-stepper]')
      expect(offerStepper.exists()).toBeTruthy()

      const offer = wrapper.find('[data-ut=offer]')
      expect(offer.exists()).toBeTruthy()
    })

    it('should display the offer stepper when validation is not required', async () => {
      const wrapper = await getWrapper(true)
      const firstOffer = wrapper.find('[data-ut=offers] [data-ut=offer-item]:nth-child(2)')
      await firstOffer.trigger('click')
      await flushPromises()

      const offerStepper = wrapper.find('[data-ut=offer-stepper]')
      expect(offerStepper.exists()).toBeFalsy()

      const offer = wrapper.find('[data-ut=offer]')
      expect(offer.exists()).toBeTruthy()
    })
  })
})
