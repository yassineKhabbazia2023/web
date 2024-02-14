import { beforeEach, describe, it, expect, vi } from 'vitest'
import { VueWrapper, mount, flushPromises } from '@vue/test-utils'
import { nextTick } from 'vue'
import OffersDrawer from '.'
import { getMockedSubscriptionOffers } from '../SubscriptionOffers/SubscriptionOffersMocks'
import { getMockedSubscriptionOffersServices } from '../OfferSubscription/OfferSubscriptionMocks'
import { getMockedPrincipalContact } from '../PrincipalContact/PrincipalContactMocks'
import type {
  SubscriptionOffer,
  SubscriptionOfferServices
} from '../SubscriptionOffers/SubscriptionOffersTypes'
import type { User } from '../PrincipalContact/PrincipalContactTypes'
import * as OffersDrawerUtils from './OffersDrawerUtils'
import * as ServicesAccount from '@/services/account'
import * as SubscriptionsServices from '@/pages/subscriptions/SubscriptionsServices'
import { offerStepperStep } from './OffersDrawerTypes'
import { getMockedAccount } from '@/services/account/accountMock'

const principalContact: User = getMockedPrincipalContact()
const subscriptionOffers: SubscriptionOffer[] = getMockedSubscriptionOffers()
const subscriptionOffersServices: SubscriptionOfferServices[] =
  getMockedSubscriptionOffersServices()
const companyTestName = 'Company Test Name'
const offersBookTestLink = 'offers-book-test-link'
const mockedAccount = getMockedAccount()

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

vi.mock('@/services/account', () => ({
  fetchAccount: vi.fn(() => Promise.resolve(mockedAccount)),
  patchAccount: vi.fn(() => Promise.resolve({}))
}))

vi.mock('@/pages/subscriptions/SubscriptionsServices', () => ({
  createSubscriptionRequestNew: vi.fn()
}))

vi.mock('./OffersDrawerUtils', async () => {
  const OffersDrawerUtils = await vi.importActual('./OffersDrawerUtils')

  return OffersDrawerUtils
})

const accountNumber = 'account-number'
const accountId = 'account-id'
const userEmail = 'user@email.com'

async function getWrapper(isOpened: boolean) {
  const wrapper = mount(OffersDrawer, {
    props: {
      modelValue: isOpened,
      selectedCompanyName: companyTestName,
      accountNumber,
      accountId,
      userEmail
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
  wrapper.findComponent('[data-testid=offer]') as VueWrapper

const findOffers = (wrapper: VueWrapper) =>
  wrapper.find('[data-testid=offers]')

const findNextPreviousButtons = (wrapper: VueWrapper) =>
  wrapper.findComponent('[data-testid=next-previous-buttons]') as VueWrapper

describe('offersDrawer', () => {
  describe('interactions', () => {
    it('should close offers drawer when clicking on close buton', async () => {
      const wrapper = await getWrapper(true)
      const offers = findOffers(wrapper)

      expect(wrapper.props('modelValue')).toBeTruthy()
      expect(offers.exists()).toBeTruthy()

      await wrapper.find('.p-drawer__close-button').trigger('click')

      expect(wrapper.emitted('update:modelValue')).toStrictEqual([[false]])
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

      const nextPreviousButtons = findNextPreviousButtons(wrapper)

      await nextPreviousButtons.vm.$emit('clickPrevious')

      const offers = findOffers(wrapper)
      expect(offers.exists()).toBeTruthy()

      const offer = findOfferSubscription(wrapper)
      expect(offer.exists()).toBeFalsy()
    })
    describe('when user selects or deselects a product', () => {
      const offerId = subscriptionOffersServices.at(0)?.offerId
      const products = subscriptionOffersServices.at(0)?.providers?.at(0)?.products
      const productConfigurationId = products?.at(0)?.productConfigurationId ?? 1
      let offer: VueWrapper
      beforeEach(async () => {
        const wrapper = await getWrapper(true)
        const firstOffer = findFirstOffer(wrapper)
        await firstOffer?.trigger('click')
        await flushPromises()

        offer = findOfferSubscription(wrapper)
      })
      it('should call addSelectedProduct when OfferSubscription emit select-product', () => {
        const addSelectedProductSpy = vi.spyOn(OffersDrawerUtils, 'addSelectedProduct')
        offer.vm.$emit('select-product', offerId, productConfigurationId)

        expect(addSelectedProductSpy).toHaveBeenNthCalledWith(1, expect.anything(), offerId, productConfigurationId)
      })
      it('should call removeSelectedProduct when OfferSubscription emit deselect-product', () => {
        const removeSelectedProductSpy = vi.spyOn(OffersDrawerUtils, 'removeSelectedProduct')
        offer.vm.$emit('deselect-product', offerId, productConfigurationId)

        expect(removeSelectedProductSpy).toHaveBeenNthCalledWith(1, expect.anything(), offerId, productConfigurationId)
      })
    })
    describe('when user has clicked 4 times on nextButton', () => {
      it('when user has clicked 4 times on nextButton', async () => {
        const wrapper = await getWrapper(true)
        const secondOffer = findSecondOffer(wrapper)
        await secondOffer.trigger('click')
        await flushPromises()
        const patchAccountSpy = vi.spyOn(ServicesAccount, 'patchAccount')
        const createSubscriptionRequestNewSpy = vi.spyOn(SubscriptionsServices, 'createSubscriptionRequestNew')

        const nextPreviousButtons = findNextPreviousButtons(wrapper)
        const stepCount = Object.keys(offerStepperStep).length
        for (let i = 0; i < stepCount - 1; i++) {
          nextPreviousButtons.vm.$emit('clickNext')
        }
        const confirmationModal = wrapper.findComponent('[data-testid="confirmation-modal"]') as VueWrapper

        await nextTick()
        expect(confirmationModal.exists()).toBeTruthy()

        confirmationModal.vm.$emit('confirm')
        await flushPromises()
        const expectedArgument = {
          account: {
            accountNumber: 'account-number',
            globalAccountId: accountId
          },
          applicant: 'user@email.com',
          approvalRequired: false,
          collaborators: [],
          globalOfferId: 'offer-id-2',
          notes: [],
          products: [
            5
          ],
          users: [
            'test_loscos@yopmail.com'
          ]
        }

        expect(patchAccountSpy).toHaveBeenNthCalledWith(1, mockedAccount)
        expect(createSubscriptionRequestNewSpy).toHaveBeenNthCalledWith(1, expectedArgument)
      })
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

      const nextPreviousButtons = findNextPreviousButtons(wrapper)

      await nextPreviousButtons.vm.$emit('clickNext')
      const customersStep = wrapper.find('[data-testid=customers-step]')
      expect(customersStep.exists()).toBeTruthy()

      await nextPreviousButtons.vm.$emit('clickNext')
      const collaboratorsStep = wrapper.find('[data-testid=collaborators-step]')
      expect(collaboratorsStep.exists()).toBeTruthy()

      await nextPreviousButtons.vm.$emit('clickNext')
      const informationStep = wrapper.find('[data-testid=information-step]')
      expect(informationStep.exists()).toBeTruthy()

      await nextPreviousButtons.vm.$emit('clickPrevious')
      await nextPreviousButtons.vm.$emit('clickPrevious')

      const customersStep2 = wrapper.find('[data-testid=customers-step]')
      expect(customersStep2.exists()).toBeTruthy()

      await nextPreviousButtons.vm.$emit('clickPrevious')

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
