import { beforeEach, describe, it, expect, vi } from 'vitest'
import { mount, flushPromises, type VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import { loggerErrorSpy, loggerMock } from '@pulse/core/mocks'
import { getMockedSubscriptionOffers , getMockedSubscriptionOffersServices } from '@entities/__mocks__/offer-subscription.mocks'
import { getMockedUser } from '@entities/__mocks__/users-client.mocks'
import { getMockedStepNotes } from '@entities/__mocks__/step-notes.mocks'
import type {
  SubscriptionOffer,
  SubscriptionOfferServices,
} from '../SubscriptionOffers/SubscriptionOffersTypes'
import type { ClientContact } from '../PrincipalContact/PrincipalContactTypes'
import * as OffersDrawerUtils from './utils/OffersDrawerUtils'
import * as ServicesAccount from '@entities/services/account'
import * as subscriptionService from '@entities/services/subscription/subscriptionService'
import * as offerService from '@entities/services/offer/index'
import * as PatchRecordService from '@entities/services/PatchRecordService/PatchRecordService'
import {
  getMockedAccount,
  getMockedAccountReferential,
  getMockedPatchOperations,
  getMockedReferentialHubs,
} from '@entities/__mocks__/account-row.mocks'
import type { UserInfo } from '@pulse/common/types'
import type { Note, PostSubscriptionRequest } from '@entities/services/subscription/subscriptionTypes'
import type { PatchValue } from '@entities/services/PatchRecordService'
import type { Contact } from '@entities/services/contact/contactTypes'
import type { ComponentWrapper } from '@entities/common/types'
import { mockedAmplitudeServiceTrack, mockedAmplitudeService } from '@pulse/common/mocks'
import { getMockedCollaborators } from '@entities/__mocks__/collaborators.mocks'
import { getMockedPrincipalContacts } from '@entities/__mocks__/principal-contact.mocks'
import OffersDrawer from '.'

vi.mock('@pulse/common', () => ({
  amplitudeService: mockedAmplitudeService,
}))

const principalContacts: ClientContact[] = getMockedPrincipalContacts()
const collaborators: Contact[] = getMockedCollaborators()
const currentUser: UserInfo = getMockedUser()
const subscriptionOffers: SubscriptionOffer[] = getMockedSubscriptionOffers()
const notes: Note[] = getMockedStepNotes()
const subscriptionOffersServices: SubscriptionOfferServices[] =
  getMockedSubscriptionOffersServices()
const companyTestName = 'Company Test Name'
const offersBookTestLink = 'offers-book-test-link'
const mockedAccount = getMockedAccount()
const mockedPatchOperations = getMockedPatchOperations()
const mockedCollaborators = getMockedCollaborators()

const expectedDefaultAuthenticatedUser = {
  id: currentUser.id,
  firstName: currentUser.firstName,
  lastName: currentUser.lastName,
  email: currentUser.email,
  mobilePhone: currentUser.officeMobile,
  oldId: currentUser.oldId,
  persona: currentUser.persona,
}

function getMockedSanitized(url: string) {
  return `sanitized-${url}`
}
async function asyncEmit(component: VueWrapper, eventName: string) {
  component.vm.$emit(eventName)
  await nextTick()
}
vi.mock('@pulse/core', () => ({ logger: loggerMock }))

vi.mock('@entities/services/offer', () => ({
  getAllOffers: vi.fn(() => Promise.resolve(subscriptionOffers)),
  getOffer: vi.fn((offerId) =>
    Promise.resolve(
      subscriptionOffersServices.find((item) => item.offerId === offerId),
    ),
  ),
  getOffersBookLink: vi.fn(() => offersBookTestLink),
  getPrincipalContacts: vi.fn(() => Promise.resolve(principalContacts)),
  getCollaborators: vi.fn(() => Promise.resolve(collaborators)),
}))

vi.mock('@entities/services/contact', () => ({
  getCollaborators: vi.fn(() => Promise.resolve(collaborators)),
}))

vi.mock('@entities/services/account', () => ({
  fetchAccountReferential: vi.fn(() => getMockedAccountReferential()),
  fetchReferentialHubs: vi.fn(() => getMockedReferentialHubs()),
  fetchAccount: vi.fn(() => Promise.resolve(mockedAccount)),
  patchAccount: vi.fn(() => Promise.resolve({})),
}))

vi.mock('@braintree/sanitize-url', () => ({
  sanitizeUrl: getMockedSanitized,
}))

vi.mock('@entities/services/PatchRecordService/PatchRecordService', () => ({
  addPathValue: vi.fn(),
  getPatchOperations: vi.fn(() => mockedPatchOperations),
}))

vi.mock('@entities/services/subscription/subscriptionService', () => ({
  createSubscriptionRequest: vi.fn(),
  fetchAccountSubscriptions: vi.fn(() => Promise.resolve([])),
}))

vi.mock('./OffersDrawerUtils', async () => {
  const OffersDrawerUtils = await vi.importActual('./utils/OffersDrawerUtils')

  return OffersDrawerUtils
})

const accountNumber = 'account-number'
const accountId = 5

async function getWrapper(isOpened: boolean) {
  const wrapper: ComponentWrapper<InstanceType<typeof OffersDrawer>> = mount(OffersDrawer, {
    props: {
      modelValue: isOpened,
      selectedCompanyName: companyTestName,
      accountNumber,
      accountId,
      currentUser,
    },
    global: {
      stubs: {
        PInput: true,
        ConfirmationModal: true,
        PIcon: true,
        PLoader: true,
        PSteps: true,
        PStep: true,
        CustomersDetails: true,
        OfferSubscription: true,
        ManageCollaborators: true,
        CompanyInformation: true,
        StepNote: true,
        NextPreviousButtons: true,
      },
    },
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
    it("should emit the 'update:modelValue' event when the v-model of confirmation modal is updated", async () => {
      const wrapper = await getWrapper(true)
      const confirmationModal = wrapper.findComponent({ name: 'ConfirmationModal' })
      confirmationModal.vm.$emit('update:modelValue', false)
      await nextTick()

      expect(confirmationModal.emitted('update:modelValue')).toStrictEqual([[false]])
    })
    it("should emit the 'update:modelValue' event when the v-model of drawer is updated", async () => {
      const wrapper = await getWrapper(true)
      const drawer = wrapper.findComponent({ name: 'PDrawer' })
      drawer.vm.$emit('update:modelValue', false)
      await nextTick()

      expect(wrapper.emitted('update:modelValue')).toStrictEqual([[false]])
    })
    it('should close offers drawer when clicking on close button', async () => {
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

      expect(mockedAmplitudeServiceTrack).toHaveBeenCalledOnce()
      expect(mockedAmplitudeServiceTrack).toHaveBeenCalledWith('Subscription Initiated', {
        subscription_initiate_offer_name: subscriptionOffersServices.at(1)?.offerCode,
      })
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

      nextPreviousButtons.vm.$emit('click-previous')
      await nextTick()

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
      const notes = [
        'services',
        'customers',
        'collaborators',
        'information',
      ].map(stepName => ({
        stepName,
        stepNote: '',
      }))
      const expectedArgument: PostSubscriptionRequest = {
        accountId,
        applicant: 'john@example.com',
        contacts: [1, 2, currentUser.id],
        offerId: 1,
        notes,
        productConfigurations: [1, 2, 3, 4],
      }
      const expectedArgumentWithoutValidation: PostSubscriptionRequest = {
        accountId,
        applicant: 'john@example.com',
        contacts: [1, 2, currentUser.id],
        offerId: 2,
        notes: [],
        productConfigurations: [5],
      }
      it('should patch the account and create a subscription when the user confirms', async () => {
        const patchAccountSpy = vi.spyOn(ServicesAccount, 'patchAccount')
        const createSubscriptionRequestSpy = vi.spyOn(subscriptionService, 'createSubscriptionRequest')

        const wrapper = await getWrapper(true)
        const firstOffer = findFirstOffer(wrapper)
        await firstOffer.trigger('click')

        const confirmationModal = wrapper.findComponent('[data-testid="create-offer-confirmation-modal"]') as VueWrapper
        expect(confirmationModal.exists()).toBeTruthy()

        confirmationModal.vm.$emit('confirm')
        await flushPromises()

        expect(patchAccountSpy).toHaveBeenNthCalledWith(1, mockedAccount.accountId, mockedPatchOperations)
        expect(createSubscriptionRequestSpy).toHaveBeenNthCalledWith(1, expectedArgument)
      })
      it('should track Amplitude event when saving for offers without validation', async () => {
        const patchAccountSpy = vi.spyOn(ServicesAccount, 'patchAccount')
        const createSubscriptionRequestSpy = vi.spyOn(subscriptionService, 'createSubscriptionRequest')

        const wrapper = await getWrapper(true)
        const secondOffer = findSecondOffer(wrapper)
        await secondOffer.trigger('click')

        const confirmationModal = wrapper.findComponent('[data-testid="create-offer-confirmation-modal"]') as VueWrapper
        expect(confirmationModal.exists()).toBeTruthy()

        confirmationModal.vm.$emit('confirm')
        await flushPromises()
        expect(mockedAmplitudeServiceTrack).toHaveBeenCalledTimes(4)
        expect(mockedAmplitudeServiceTrack).toHaveBeenNthCalledWith(1, 'Subscription Initiated', {
          subscription_initiate_offer_name: subscriptionOffersServices.at(1)?.offerCode,
        })
        expect(mockedAmplitudeServiceTrack).toHaveBeenNthCalledWith(2, 'Subscription Started', {
          subscription_start_offer_name: subscriptionOffersServices.at(1)?.offerCode,
          subscription_start_result: 'succeeded',
        })
        expect(mockedAmplitudeServiceTrack).toHaveBeenNthCalledWith(3, 'Subscription Completed', {
          subscription_complete_offer_name: subscriptionOffersServices.at(1)?.offerCode,
          subscription_complete_localisation: 'offer activation screen',
          subscription_complete_result: 'succeeded',
        })
        expect(mockedAmplitudeServiceTrack).toHaveBeenNthCalledWith(4, 'Onboarding Started', {
          onboarding_start_localisation: 'Offer activation',
          onboarding_start_result: 'succeeded',
        })
        expect(patchAccountSpy).toHaveBeenNthCalledWith(1, mockedAccount.accountId, mockedPatchOperations)
        expect(createSubscriptionRequestSpy).toHaveBeenNthCalledWith(1, expectedArgumentWithoutValidation)
      })
      it('should not patch the account when no account diff', async () => {
        vi
          .spyOn(PatchRecordService, 'getPatchOperations')
          .mockReturnValueOnce([])

        const wrapper = await getWrapper(true)
        const firstOffer = findFirstOffer(wrapper)
        await firstOffer.trigger('click')
        const patchAccountSpy = vi.spyOn(ServicesAccount, 'patchAccount')
        const createSubscriptionRequestSpy = vi.spyOn(subscriptionService, 'createSubscriptionRequest')
        const confirmationModal = wrapper.findComponent('[data-testid="create-offer-confirmation-modal"]') as VueWrapper
        expect(confirmationModal.exists()).toBeTruthy()

        confirmationModal.vm.$emit('confirm')

        expect(patchAccountSpy).not.toHaveBeenCalled()
        expect(createSubscriptionRequestSpy).toHaveBeenNthCalledWith(1, expectedArgument)
      })

      it('should call logger.error when patch fails', async () => {
        const errorMessage = 'patch rejected'
        const patchAccountSpy = vi
          .spyOn(ServicesAccount, 'patchAccount')
          .mockRejectedValueOnce(errorMessage)


        const wrapper = await getWrapper(true)
        const firstOffer = findFirstOffer(wrapper)
        firstOffer.trigger('click')

        const confirmationModal = wrapper.findComponent('[data-testid="create-offer-confirmation-modal"]') as VueWrapper
        expect(confirmationModal.exists()).toBeTruthy()

        confirmationModal.vm.$emit('confirm')
        await flushPromises()

        expect(patchAccountSpy).toHaveBeenCalledOnce()
        expect(loggerErrorSpy).toHaveBeenCalledOnce()
        expect(loggerErrorSpy).toHaveBeenNthCalledWith(1, errorMessage)
      })

      it('should call logger.error when save fails', async () => {
        const errorMessage = 'save rejected'
        vi
          .spyOn(subscriptionService, 'createSubscriptionRequest')
          .mockRejectedValueOnce(errorMessage)


        const wrapper = await getWrapper(true)
        const firstOffer = findFirstOffer(wrapper)
        await firstOffer.trigger('click')

        const confirmationModal = wrapper.findComponent('[data-testid="create-offer-confirmation-modal"]') as VueWrapper
        expect(confirmationModal.exists()).toBeTruthy()

        confirmationModal.vm.$emit('confirm')
        await flushPromises()

        expect(loggerErrorSpy).toHaveBeenCalledOnce()
        expect(loggerErrorSpy).toHaveBeenNthCalledWith(1, errorMessage)
      })
      it('should console error and track Amplitude event when saving fails for offers without validation', async () => {
        const errorMessage = 'save rejected'
        vi
          .spyOn(subscriptionService, 'createSubscriptionRequest')
          .mockRejectedValueOnce(errorMessage)


        const wrapper = await getWrapper(true)
        const secondOffer = findSecondOffer(wrapper)
        await secondOffer.trigger('click')

        const confirmationModal = wrapper.findComponent('[data-testid="create-offer-confirmation-modal"]') as VueWrapper
        expect(confirmationModal.exists()).toBeTruthy()

        confirmationModal.vm.$emit('confirm')
        await flushPromises()

        expect(mockedAmplitudeServiceTrack).toHaveBeenCalledTimes(4)
        expect(mockedAmplitudeServiceTrack).toHaveBeenNthCalledWith(2, 'Subscription Started', {
          subscription_start_offer_name: subscriptionOffersServices.at(1)?.offerCode,
          subscription_start_result: 'failed',
        })
        expect(mockedAmplitudeServiceTrack).toHaveBeenNthCalledWith(3, 'Subscription Completed', {
          subscription_complete_offer_name: subscriptionOffersServices.at(1)?.offerCode,
          subscription_complete_localisation: 'offer activation screen',
          subscription_complete_result: 'failed',
        })
        expect(mockedAmplitudeServiceTrack).toHaveBeenNthCalledWith(4, 'Onboarding Started', {
          onboarding_start_localisation: 'Offer activation',
          onboarding_start_result: 'failed',
        })
        expect(loggerErrorSpy).toHaveBeenCalledOnce()
        expect(loggerErrorSpy).toHaveBeenNthCalledWith(1, errorMessage)
      })
    })
    describe('when input CompanyInformation data', () => {
      it('should call addPathValue with proper arguments', async () => {
        const addPathValueSpy = vi.spyOn(PatchRecordService, 'addPathValue')

        const wrapper = await getWrapper(true)
        const firstOffer = findFirstOffer(wrapper)
        await firstOffer.trigger('click')
        await nextTick()

        const nextPreviousButtons = findNextPreviousButtons(wrapper)
        const STEP_TO_REACH = 3
        for (let i = 0; i < STEP_TO_REACH; i++) {
          if (i === STEP_TO_REACH - 1) {
            const manageCollaboratorsComponent = wrapper.findComponent({ name: 'ManageCollaborators' })
            manageCollaboratorsComponent.vm.$emit('update:collaborators', mockedCollaborators)
          }
          nextPreviousButtons.vm.$emit('click-next')
          await nextTick()
        }

        const component = wrapper.findComponent({ name: 'CompanyInformation' })
        const fieldKey = 'accounting.fiscalExerciseDuration'
        const currentValue = mockedAccount?.accounting?.fiscalExerciseDuration
        const newValue = 10
        component.vm.$emit('input', fieldKey, newValue)
        const patchValues: PatchValue[] = []
        const expectedArguments = [
          patchValues,
          fieldKey,
          currentValue,
          newValue,
        ]

        expect(addPathValueSpy).toHaveBeenCalledOnce()
        expect(addPathValueSpy).toHaveBeenNthCalledWith(1, ...expectedArguments)
      })
    })
  })
  describe('props', () => {
    it('should display logger.error when API call is rejected', async () => {
      const errorMessage = 'Fetch API ERROR'
      vi.spyOn(
        offerService,
        'getAllOffers',
      ).mockRejectedValueOnce(errorMessage)

      await getWrapper(true)
      expect(loggerErrorSpy).toHaveBeenCalledOnce()
      expect(loggerErrorSpy).toHaveBeenNthCalledWith(1,
        'Unable to retrieve data for subscribing to an offer :',
        errorMessage,
      )
    })
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
      const firstOfferIntranetLink = subscriptionOffersServices[0].intranetLink ?? ''
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
    it('should display the correct page and maintain notes when using stepper navigation buttons 1/2', async () => {
      const wrapper = await getWrapper(true)
      const firstOffer = findFirstOffer(wrapper)
      await firstOffer.trigger('click')
      await flushPromises()

      const nextPreviousButtons = findNextPreviousButtons(wrapper)

      await asyncEmit(nextPreviousButtons, 'click-next')
      const customersStep = wrapper.find('[data-testid=customers-step]')
      const customersNoteStep = wrapper.findComponent({ name: 'StepNote' })
      await customersNoteStep.vm.$emit('update:modelValue', notes[1])
      expect(customersNoteStep.props()).toStrictEqual({ disabled: false, modelValue: notes[1] })
      expect(customersStep.exists()).toBeTruthy()

      await asyncEmit(nextPreviousButtons, 'click-next')
      const collaboratorsStep = wrapper.find('[data-testid=collaborators-step]')
      expect(collaboratorsStep.exists()).toBeTruthy()
    })
    it('should display the correct page and maintain notes when using stepper navigation buttons 2/2', async () => {
      const wrapper = await getWrapper(true)
      const firstOffer = findFirstOffer(wrapper)
      await firstOffer.trigger('click')
      await flushPromises()

      const nextPreviousButtons = findNextPreviousButtons(wrapper)

      await asyncEmit(nextPreviousButtons, 'click-next')
      const customersNoteStep = wrapper.findComponent({ name: 'StepNote' })
      await customersNoteStep.vm.$emit('update:modelValue', notes[1])

      await asyncEmit(nextPreviousButtons, 'click-next')

      const manageCollaboratorsComponent = wrapper.findComponent({ name: 'ManageCollaborators' })
      manageCollaboratorsComponent.vm.$emit('update:collaborators', mockedCollaborators)

      await asyncEmit(nextPreviousButtons, 'click-next')
      const informationStep = wrapper.find('[data-testid=information-step]')
      expect(informationStep.exists()).toBeTruthy()

      nextPreviousButtons.vm.$emit('click-previous')
      nextPreviousButtons.vm.$emit('click-previous')
      await nextTick()

      const customersStep2 = wrapper.find('[data-testid=customers-step]')
      const customersNoteStep2 = wrapper.findComponent({ name: 'StepNote' })
      expect(customersNoteStep2.props('modelValue')).toStrictEqual(notes[1])
      expect(customersStep2.exists()).toBeTruthy()

      nextPreviousButtons.vm.$emit('click-previous')
      await nextTick()

      const offer = findOfferSubscription(wrapper)
      expect(offer.exists()).toBeTruthy()

      nextPreviousButtons.vm.$emit('click-previous')
      await nextTick()
      const secondOffer = findSecondOffer(wrapper)
      await secondOffer.trigger('click')

      expect(manageCollaboratorsComponent.props('collaborators')).toStrictEqual([expectedDefaultAuthenticatedUser])
    })
    it('should render the Manage Collaborators form with the default collaborator set to the authenticated user', async () => {
      const wrapper = await getWrapper(true)
      const firstOffer = findFirstOffer(wrapper)
      await firstOffer.trigger('click')
      await flushPromises()

      const nextPreviousButtons = findNextPreviousButtons(wrapper) as VueWrapper<any>

      await asyncEmit(nextPreviousButtons, 'click-next')

      const customersNoteStep = wrapper.findComponent({ name: 'StepNote' })
      await customersNoteStep.vm.$emit('update:modelValue', notes[1])

      await asyncEmit(nextPreviousButtons, 'click-next')

      const manageCollaboratorsComponent = wrapper.findComponent({ name: 'ManageCollaborators' })

      expect(manageCollaboratorsComponent.props('collaborators')).toHaveLength(1)
      expect(manageCollaboratorsComponent.props('collaborators')).toStrictEqual([expectedDefaultAuthenticatedUser])
    })
    it('should disable the next button when no collaborator is selected', async () => {
      const wrapper = await getWrapper(true)
      const firstOffer = findFirstOffer(wrapper)
      await firstOffer.trigger('click')
      await flushPromises()

      const nextPreviousButtons = findNextPreviousButtons(wrapper) as VueWrapper<any>

      await asyncEmit(nextPreviousButtons, 'click-next')

      const customersNoteStep = wrapper.findComponent({ name: 'StepNote' })
      await customersNoteStep.vm.$emit('update:modelValue', notes[1])

      await asyncEmit(nextPreviousButtons, 'click-next')

      const manageCollaboratorsComponent = wrapper.findComponent({ name: 'ManageCollaborators' })
      manageCollaboratorsComponent.vm.$emit('update:collaborators', [])
      await nextTick()

      expect(nextPreviousButtons.props('isNextButtonDisabled')).toBeTruthy()
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
