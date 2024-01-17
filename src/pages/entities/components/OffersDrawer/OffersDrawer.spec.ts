import { describe, it, expect, vi } from 'vitest'
import { VueWrapper, mount, flushPromises } from '@vue/test-utils'
import OffersDrawer from '.'
import { getMockedSubscriptionOffers } from '../SubscriptionOffers/SubscriptionOffersMocks'
import { getMockedSubscriptionOffersServices } from '../OfferSubscription/OfferSubscriptionMocks'
import { getMockedPrincipalContact } from '../PrincipalContact/PrincipalContactMocks'
import type {
  SubscriptionOffer,
  SubscriptionOfferServices
} from '../SubscriptionOffers/SubscriptionOffersTypes'
import type { User } from '../PrincipalContact/PrincipalContactTypes'

const principalContact: User = getMockedPrincipalContact()
const subscriptionOffers: SubscriptionOffer[] = getMockedSubscriptionOffers()
const subscriptionOffersServices: SubscriptionOfferServices[] =
  getMockedSubscriptionOffersServices()
const companyTestName = 'Company Test Name'
const offersBookTestLink = 'offers-book-test-link'

vi.mock('@/services/offer', () => ({
  getAllOffers: vi.fn(() => Promise.resolve(subscriptionOffers)),
  getOffer: vi.fn((offerId) =>
    Promise.resolve(
      subscriptionOffersServices.find((item) => item.offerId === offerId)
    )
  ),
  getOffersBookLink: vi.fn(() => offersBookTestLink),
  getPrincipalContact: vi.fn(() => Promise.resolve(principalContact))
}))

async function getWrapper(isOpened: boolean) {
  const wrapper = mount(OffersDrawer, {
    props: {
      modelValue: isOpened,
      selectedCompanyName: companyTestName
    }
  })
  await flushPromises()

  return wrapper
}

const findSecondOffer = (wrapper: VueWrapper) =>
  wrapper.find('[data-testid=offers] [data-testid=offer-item]:nth-child(2)')

const findFirstOffer = (wrapper: VueWrapper) =>
  wrapper.find('[data-testid=offers] [data-testid=offer-item]')

const findOfferSubscription = (wrapper: VueWrapper) =>
  wrapper.find('[data-testid=offer]')

const findOffers = (wrapper: VueWrapper) =>
  wrapper.find('[data-testid=offers]')

describe('offersDrawer', () => {
  describe('interactions', () => {
    it('should close offers drawer when clicking on close buton', async () => {
      const wrapper = await getWrapper(true)
      const offers = findOffers(wrapper)

      expect(wrapper.props('modelValue')).toBeTruthy()
      expect(offers.exists()).toBeTruthy()

      await wrapper.find('.p-drawer__close-button').trigger('click')

      expect(wrapper.emitted()).toHaveProperty('update:modelValue')
    })
    it('should display current offer when an offer is selected', async () => {
      const wrapper = await getWrapper(true)
      const secondOffer = findSecondOffer(wrapper)
      await secondOffer.trigger('click')
      await flushPromises()

      const offers = findOffers(wrapper)
      expect(offers.exists()).toBeFalsy()

      const offer = findOfferSubscription(wrapper)
      expect(offer.exists()).toBeTruthy()
    })
    it('should hide current offer when click on previousButton', async () => {
      const wrapper = await getWrapper(true)
      const secondOffer = findSecondOffer(wrapper)
      await secondOffer?.trigger('click')
      await flushPromises()

      const nextPreviousButtons = wrapper.findComponent(
        '[data-testid=next-previous-buttons]'
      )
      await (nextPreviousButtons as VueWrapper).vm.$emit('clickPrevious')

      const offers = findOffers(wrapper)
      expect(offers.exists()).toBeTruthy()

      const offer = findOfferSubscription(wrapper)
      expect(offer.exists()).toBeFalsy()
    })
  })
  describe('props', () => {
    it('should display offers when drawer is opened', async () => {
      const wrapper = await getWrapper(true)
      const offers = findOffers(wrapper)
      expect(offers.exists()).toBeTruthy()
    })
    it('should NOT display offers when drawer is closed', async () => {
      const wrapper = await getWrapper(false)
      const offers = findOffers(wrapper)
      expect(offers.exists()).toBeFalsy()
    })
    it('should display company name at the top of the drawer', async () => {
      const wrapper = await getWrapper(true)
      const selectedCompanyName = wrapper.find('.offers-drawer__company-name')

      expect(selectedCompanyName.text()).toBe(companyTestName)
    })
  })
  describe('offersDrawerHeader', () => {
    it('should display offers book link beside the drawer title', async () => {
      const wrapper = await getWrapper(true)
      const offersBookLink = wrapper.find('.offers-drawer__details-link')

      expect(offersBookLink.text()).toBe('Offers Book')
      expect(offersBookLink.attributes().href).toBe(offersBookTestLink)
    })
    it('should display offer intranet link beside the drawer title', async () => {
      const wrapper = await getWrapper(true)
      const firstOfferIntranetLink = subscriptionOffersServices[0].intranetLink
      const firstOffer = findFirstOffer(wrapper)
      await firstOffer.trigger('click')
      await flushPromises()
      const offerIntranetLink = wrapper.find('.offers-drawer__details-link')

      expect(offerIntranetLink.text()).toBe('Offer Intranet')
      expect(offerIntranetLink.attributes().href).toBe(firstOfferIntranetLink)
    })
  })
  describe('offerStepper', () => {
    it('the offer stepper should be displayed after clicking on offer', async () => {
      const wrapper = await getWrapper(true)
      const firstOffer = findFirstOffer(wrapper)
      await firstOffer.trigger('click')
      await flushPromises()

      const offerStepper = wrapper.find('[data-testid=offer-stepper]')
      expect(offerStepper.exists()).toBeTruthy()

      const offer = findOfferSubscription(wrapper)
      expect(offer.exists()).toBeTruthy()
    })

    it('should display the correct page after clicking on stepper navigation buttons', async () => {
      const wrapper = await getWrapper(true)
      const firstOffer = findFirstOffer(wrapper)
      await firstOffer.trigger('click')
      await flushPromises()

      const nextButton = wrapper.findComponent(
        '[data-testid=next-previous-buttons]'
      )
      await (nextButton as VueWrapper).vm.$emit('clickNext')

      const usersStep = wrapper.find('[data-testid=users-step]')
      expect(usersStep.exists()).toBeTruthy()

      await (nextButton as VueWrapper).vm.$emit('clickNext')

      const informationStep = wrapper.find('[data-testid=information-step]')
      expect(informationStep.exists()).toBeTruthy()

      const PreviousButton = wrapper.findComponent(
        '[data-testid=next-previous-buttons]'
      )
      await (PreviousButton as VueWrapper).vm.$emit('clickPrevious')
      await (PreviousButton as VueWrapper).vm.$emit('clickPrevious')

      const offer = findOfferSubscription(wrapper)
      expect(offer.exists()).toBeTruthy()
    })

    it('should display the offer stepper when validation is not required', async () => {
      const wrapper = await getWrapper(true)
      const secondOffer = findSecondOffer(wrapper)
      await secondOffer.trigger('click')
      await flushPromises()

      const offerStepper = wrapper.find('[data-testid=offer-stepper]')
      expect(offerStepper.exists()).toBeFalsy()

      const offer = findOfferSubscription(wrapper)
      expect(offer.exists()).toBeTruthy()
    })
  })
})
