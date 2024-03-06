import { beforeEach, describe, it, expect, vi } from 'vitest'
import { VueWrapper, mount, flushPromises } from '@vue/test-utils'
import { nextTick } from 'vue'
import OffersDrawer from '.'
import { getMockedSubscriptionOffers } from '../SubscriptionOffers/SubscriptionOffersMocks'
import { getMockedSubscriptionOffersServices } from '../OfferSubscription/OfferSubscriptionMocks'
import { getMockedPrincipalContact } from '../PrincipalContact/PrincipalContactMocks'
import { getMockedUser } from '@/pages/entities/mocks'
import type {
  SubscriptionOffer,
  SubscriptionOfferServices
} from '../SubscriptionOffers/SubscriptionOffersTypes'
import type { User } from '../PrincipalContact/PrincipalContactTypes'
import * as OffersDrawerUtils from './utils/OffersDrawerUtils'
import * as ServicesAccount from '@/services/account'
import * as SubscriptionsServices from '@/pages/subscriptions/SubscriptionsServices'
import { getMockedAccount } from '@/services/account/accountMock'
import { getMockedStepNotes } from '../StepNote/StepNotesMock'
import type { UserInfo } from '@kpmg/common'
import type { Note, PostSubscriptionRequest } from '@/pages/subscriptions/SubscriptionsTypes'
import { CONTACT_ID } from './OffersDrawerConst'

const principalContact: User = getMockedPrincipalContact()
const currentUser: UserInfo = getMockedUser()
const subscriptionOffers: SubscriptionOffer[] = getMockedSubscriptionOffers()
const notes: Note[] = getMockedStepNotes()
const subscriptionOffersServices: SubscriptionOfferServices[] =
  getMockedSubscriptionOffersServices()
const companyTestName = 'Company Test Name'
const offersBookTestLink = 'offers-book-test-link'
const mockedAccount = getMockedAccount()

function getMockedSanitized(url: string) {
  return `sanitized-${url}`
}

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

vi.mock('@braintree/sanitize-url', () => ({
  sanitizeUrl: getMockedSanitized
}))

vi.mock('@/pages/subscriptions/SubscriptionsServices', () => ({
  createSubscriptionRequestNew: vi.fn()
}))

vi.mock('./OffersDrawerUtils', async () => {
  const OffersDrawerUtils = await vi.importActual('./utils/OffersDrawerUtils')

  return OffersDrawerUtils
})

const accountNumber = 'account-number'
const accountId = 5

async function getWrapper(isOpened: boolean) {
  const wrapper = mount(OffersDrawer, {
    props: {
      modelValue: isOpened,
      selectedCompanyName: companyTestName,
      accountNumber,
      accountId,
      currentUser
    },
    global: {
      stubs: {
        PInput: true
      }
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
    describe('create subscription', () => {
      it('should patch the account and create a subscription when the user confirms', async () => {
        const wrapper = await getWrapper(true)
        const firstOffer = findFirstOffer(wrapper)
        await firstOffer.trigger('click')
        await nextTick()

        const patchAccountSpy = vi.spyOn(ServicesAccount, 'patchAccount')
        const createSubscriptionRequestNewSpy = vi.spyOn(SubscriptionsServices, 'createSubscriptionRequestNew')
        const confirmationModal = wrapper.findComponent('[data-testid="confirmation-modal"]') as VueWrapper
        expect(confirmationModal.exists()).toBeTruthy()

        confirmationModal.vm.$emit('confirm')
        await flushPromises()
        const expectedArgument: PostSubscriptionRequest = {
          accountId,
          applicant: 'john@example.com',
          contacts: [CONTACT_ID],
          offerId: 1,
          notes: [
            {
              stepName: 'services',
              stepNote: ''
            },
            {
              stepName: 'customers',
              stepNote: ''
            },
            {
              stepName: 'collaborators',
              stepNote: ''
            },
            {
              stepName: 'information',
              stepNote: ''
            }
          ],
          productConfigurations: [1, 2, 3, 4]
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
      const sanitizedLink = getMockedSanitized(offersBookTestLink)

      expect(offersBookLink.text()).toBe('Offers Book')
      expect(offersBookLink.attributes().href).toBe(sanitizedLink)
    })
    it('should display offer intranet link beside the drawer title', async () => {
      const wrapper = await getWrapper(true)
      const firstOfferIntranetLink = subscriptionOffersServices[0].intranetLink
      const sanitizedLink = getMockedSanitized(firstOfferIntranetLink)
      const firstOffer = findFirstOffer(wrapper)
      await firstOffer.trigger('click')
      await flushPromises()
      const offerIntranetLink = wrapper.find('.offers-drawer__details-link')

      expect(offerIntranetLink.text()).toBe('Offer Intranet')
      expect(offerIntranetLink.attributes().href).toBe(sanitizedLink)
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
    it('should display the correct page and maintain notes when using stepper navigation buttons', async () => {
      const wrapper = await getWrapper(true)
      const firstOffer = findFirstOffer(wrapper)
      await firstOffer.trigger('click')
      await flushPromises()

      const nextPreviousButtons = findNextPreviousButtons(wrapper)

      await nextPreviousButtons.vm.$emit('clickNext')
      const customersStep = wrapper.find('[data-testid=customers-step]')
      const customersNoteStep = wrapper.findComponent({ name: 'StepNote' })
      await customersNoteStep.vm.$emit('update:modelValue', notes[1])
      expect(customersNoteStep.props()).toStrictEqual({ modelValue: notes[1] })
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
      const customersNoteStep2 = wrapper.findComponent({ name: 'StepNote' })
      expect(customersNoteStep2.props('modelValue')).toStrictEqual(notes[1])
      expect(customersStep2.exists()).toBeTruthy()

      await nextPreviousButtons.vm.$emit('clickPrevious')

      const offer = findOfferSubscription(wrapper)
      expect(offer.exists()).toBeTruthy()
    })

    it('should not display the offer stepper and note textarea when the validation is not required', async () => {
      const wrapper = await getWrapper(true)
      const secondOffer = findSecondOffer(wrapper)
      await secondOffer.trigger('click')
      await flushPromises()

      const offerStepper = wrapper.find('[data-testid=offer-stepper]')
      const noteStep = wrapper.findComponent({ name: 'StepNote' })
      expect(offerStepper.exists()).toBeFalsy()
      expect(noteStep.exists()).toBeFalsy()

      const offer = findOfferSubscription(wrapper)
      expect(offer.exists()).toBeTruthy()
    })
  })
})
