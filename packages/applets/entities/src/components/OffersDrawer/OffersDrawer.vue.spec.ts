import { beforeEach, describe, it, expect, vi } from 'vitest'
import { shallowMount, flushPromises } from '@vue/test-utils'
import { nextTick } from 'vue'
import { loggerErrorSpy, loggerMock } from '@pulse/toolbox/mocks'
import { getMockedSubscriptionOffers, getMockedSubscriptionOffersServices } from '@entities/__mocks__/offer-subscription.mocks'
import { getMockedUser } from '@entities/__mocks__/users-client.mocks'
import { getMockedStepNotes } from '@entities/__mocks__/step-notes.mocks'
import type { SubscriptionOffer, SubscriptionOfferServices, ClientContact } from '@entities/types'
import * as ServicesAccount from '@entities/services/account'
import * as subscriptionService from '@entities/services/subscription/subscriptionService'
import {
  getMockedAccount,
  getMockedAccountReferential,
  getMockedPatchOperations,
  getMockedReferentialHubs,
} from '@entities/__mocks__/account-row.mocks'
import type { UserInfo } from '@pulse/common/types'
import type { Note, PostSubscriptionRequest } from '@entities/services/subscription/subscriptionTypes'
import type { PatchValue } from '@entities/services/PatchRecordService'
import { AmplitudeServiceMock } from '@pulse/common/mocks'
import { getMockedCollaborators } from '@entities/__mocks__/collaborators.mocks'
import { getMockedPrincipalContacts } from '@entities/__mocks__/principal-contact.mocks'

import OffersDrawer from '.'

vi.mock('@pulse/common/services/amplitude', () => ({
  AmplitudeService: AmplitudeServiceMock,
}))

const getHasNoSignatoryMock = vi.hoisted(() => vi.fn())
const getIsNoCollaboratorSelectedMock = vi.hoisted(() => vi.fn())
const getIsAllCollaboratorRoleSelectedMock = vi.hoisted(() => vi.fn())
const getIsMissingCollaboratorRoleMock = vi.hoisted(() => vi.fn())
const getIsNextButtonDisabledMock = vi.hoisted(() => vi.fn())
const updateAccountOnInputMock = vi.hoisted(() => vi.fn())
vi.mock('./OffersDrawer.utils', () => ({
  getHasNoSignatory: getHasNoSignatoryMock,
  getIsNoCollaboratorSelected: getIsNoCollaboratorSelectedMock,
  getIsAllCollaboratorRoleSelected: getIsAllCollaboratorRoleSelectedMock,
  getIsMissingCollaboratorRole: getIsMissingCollaboratorRoleMock,
  getIsNextButtonDisabled: getIsNextButtonDisabledMock,
  updateAccountOnInput: updateAccountOnInputMock,
}))

const principalContacts: ClientContact[] = getMockedPrincipalContacts()
const currentUser: UserInfo = getMockedUser()
const subscriptionOffers: SubscriptionOffer[] = getMockedSubscriptionOffers()
const notes: Note[] = getMockedStepNotes()
const subscriptionOffersServices: SubscriptionOfferServices[] =
  getMockedSubscriptionOffersServices()

const firstOffer = subscriptionOffersServices[0]
const secondOffer = subscriptionOffersServices[1]

const companyTestName = 'Company Test Name'
const offersBookTestLink = 'offers-book-test-link'
const mockedAccount = getMockedAccount()
const mockedPatchOperations = getMockedPatchOperations()
const mockedCollaborators = getMockedCollaborators()
const mockedCollaboratorIds = mockedCollaborators.map(({ id }) => id)

function getMockedSanitized(url: string) {
  return `sanitized-${url}`
}

vi.mock('@pulse/toolbox', () => ({ logger: loggerMock }))

const getAllOffersMock = vi.hoisted(() => vi.fn(() => Promise.resolve(subscriptionOffers)))
const getPrincipalContactsMock = vi.hoisted(() => vi.fn(() => Promise.resolve(principalContacts)))
vi.mock('@entities/services/offer', () => ({
  getAllOffers: getAllOffersMock,
  getOffer: vi.fn((offerId) =>
    Promise.resolve(
      subscriptionOffersServices.find((item) => item.offerId === offerId),
    ),
  ),
  getOffersBookLink: vi.fn(() => offersBookTestLink),
  getPrincipalContacts: getPrincipalContactsMock,
}))

const fetchAccountMock = vi.hoisted(() => vi.fn(() => Promise.resolve(mockedAccount)))
vi.mock('@entities/services/account', () => ({
  fetchAccountReferential: vi.fn(() => getMockedAccountReferential()),
  fetchReferentialHubs: vi.fn(() => getMockedReferentialHubs()),
  fetchAccount: fetchAccountMock,
  patchAccount: vi.fn(() => Promise.resolve({})),
}))

vi.mock('@pulse/toolbox/utils/url', () => ({
  sanitizeUrl: getMockedSanitized,
}))

const addPathValueMock = vi.hoisted(() => vi.fn())
const getPatchOperationsMock = vi.hoisted(() => vi.fn())
vi.mock('@entities/services/PatchRecordService/PatchRecordService', () => ({
  addPathValue: addPathValueMock,
  getPatchOperations: getPatchOperationsMock,
}))

const fetchAccountSubscriptionsMock = vi.hoisted(() => vi.fn(() => Promise.resolve([])))
vi.mock('@entities/services/subscription/subscriptionService', () => ({
  createSubscriptionRequest: vi.fn(),
  fetchAccountSubscriptions: fetchAccountSubscriptionsMock,
}))

vi.mock('./OffersDrawerUtils', async () => {
  const OffersDrawerUtils = await vi.importActual('./utils/OffersDrawerUtils')

  return OffersDrawerUtils
})

vi.mock('@entities/utils/helpers')

const accountNumber = 'account-number'
const accountId = 5

async function getWrapper(isOpened: boolean, callInitDrawerForAccount = true) {
  const wrapper = shallowMount(OffersDrawer, {
    props: {
      modelValue: isOpened,
      selectedCompanyName: companyTestName,
      accountNumber,
      accountId,
      currentUser,
    },
    global: {
      stubs: {
        PDrawer: {
          name: 'PDrawer',
          template: '<div><slot name="header-prefix" /><slot name="header-suffix" /><slot /><slot name="footer" /></div>',
          props: ['isOpened', 'pTitle'],
          events: ['close-drawer-button'],
        },
      },
    },
  })
  if (callInitDrawerForAccount) {
    await wrapper.vm.initDrawerForCurrentAccount()
  }
  await flushPromises()

  return wrapper
}

describe('offersDrawer', () => {
  beforeEach(() => {
    getPatchOperationsMock.mockReturnValue(mockedPatchOperations)
  })
  describe('interactions', () => {
    it('should display current offer when an offer is selected', async () => {
      const wrapper = await getWrapper(true)

      const subscriptionOffers = wrapper.findComponent({ name: 'SubscriptionOffers' })
      subscriptionOffers.vm.$emit('select-offer', secondOffer.offerId)
      await flushPromises()

      expect(AmplitudeServiceMock.track).toHaveBeenCalledOnce()
      expect(AmplitudeServiceMock.track).toHaveBeenCalledWith('Subscription Initiated', {
        subscription_initiate_offer_name: subscriptionOffersServices.at(1)?.offerCode,
      })
      const offers = wrapper.findComponent({ name: 'SubscriptionOffers' })
      expect(offers.exists()).toBe(false)

      const offer = wrapper.findComponent({ name: 'OfferSubscription' })
      expect(offer.exists()).toBe(true)
    })

    it('should hide current offer when click on previousButton', async () => {
      const wrapper = await getWrapper(true)

      const subscriptionOffers = wrapper.findComponent({ name: 'SubscriptionOffers' })
      subscriptionOffers.vm.$emit('select-offer', secondOffer.offerId)
      await flushPromises()

      const nextPreviousButtons = wrapper.findComponent({ name: 'NextPreviousButtons' })

      nextPreviousButtons.vm.$emit('click-previous')
      await nextTick()

      const offers = wrapper.findComponent({ name: 'SubscriptionOffers' })
      expect(offers.exists()).toBe(true)

      const offer = wrapper.findComponent({ name: 'OfferSubscription' })
      expect(offer.exists()).toBe(false)
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
        contactFunctions: [],
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
        const content = 'After confirmation, the offer activation request will be submitted, and there will be no option to revert. Please review your information carefully before proceeding.\n'

        const expectedConfirmationModalBefore = {
          cancelButtonLabel: 'Cancel',
          confirmButtonLabel: 'Confirm',
          content,
          isCancelButtonDisabled: false,
          isConfirmButtonDisabled: false,
          isConfirmButtonLoading: false,
          modelValue: false,
          title: 'Attention',
        }
        const expectedConfirmationModalDuring = {
          ...expectedConfirmationModalBefore,
          isCancelButtonDisabled: true,
          isConfirmButtonDisabled: true,
          isConfirmButtonLoading: true,
        }
        const expectedConfirmationModalAfter = {
          ...expectedConfirmationModalBefore,
        }

        const patchAccountSpy = vi.spyOn(ServicesAccount, 'patchAccount')
        const createSubscriptionRequestSpy = vi.spyOn(subscriptionService, 'createSubscriptionRequest')

        const wrapper = await getWrapper(true)

        const subscriptionOffers = wrapper.findComponent({ name: 'SubscriptionOffers' })
        subscriptionOffers.vm.$emit('select-offer', firstOffer.offerId)
        await flushPromises()

        const confirmationModal = wrapper.findComponent({ name: 'ConfirmationModal' })
        expect(confirmationModal.exists()).toBe(true)
        expect(confirmationModal.props()).toStrictEqual(expectedConfirmationModalBefore)

        confirmationModal.vm.$emit('confirm')
        await nextTick()
        expect(confirmationModal.props()).toStrictEqual(expectedConfirmationModalDuring)
        await flushPromises()

        expect(confirmationModal.props()).toStrictEqual(expectedConfirmationModalAfter)
        expect(patchAccountSpy).toHaveBeenNthCalledWith(1, mockedAccount.accountId, mockedPatchOperations)
        expect(createSubscriptionRequestSpy).toHaveBeenNthCalledWith(1, expectedArgument)

        expect(wrapper.emitted('offer-saved')).toStrictEqual([[]])
      })

      it('should track Amplitude event when saving for offers without validation', async () => {
        const patchAccountSpy = vi.spyOn(ServicesAccount, 'patchAccount')
        const createSubscriptionRequestSpy = vi.spyOn(subscriptionService, 'createSubscriptionRequest')

        const wrapper = await getWrapper(true)

        const subscriptionOffers = wrapper.findComponent({ name: 'SubscriptionOffers' })
        subscriptionOffers.vm.$emit('select-offer', secondOffer.offerId)
        await flushPromises()

        const confirmationModal = wrapper.findComponent({ name: 'ConfirmationModal' })
        expect(confirmationModal.exists()).toBe(true)

        confirmationModal.vm.$emit('confirm')
        await flushPromises()
        expect(AmplitudeServiceMock.track).toHaveBeenCalledTimes(4)
        expect(AmplitudeServiceMock.track).toHaveBeenNthCalledWith(1, 'Subscription Initiated', {
          subscription_initiate_offer_name: subscriptionOffersServices.at(1)?.offerCode,
        })
        expect(AmplitudeServiceMock.track).toHaveBeenNthCalledWith(2, 'Subscription Started', {
          subscription_start_offer_name: subscriptionOffersServices.at(1)?.offerCode,
          subscription_start_result: 'succeeded',
        })
        expect(AmplitudeServiceMock.track).toHaveBeenNthCalledWith(3, 'Subscription Completed', {
          subscription_complete_offer_name: subscriptionOffersServices.at(1)?.offerCode,
          subscription_complete_localisation: 'offer activation screen',
          subscription_complete_result: 'succeeded',
        })
        expect(AmplitudeServiceMock.track).toHaveBeenNthCalledWith(4, 'Onboarding Started', {
          onboarding_start_localisation: 'Offer activation',
          onboarding_start_result: 'succeeded',
        })
        expect(patchAccountSpy).toHaveBeenNthCalledWith(1, mockedAccount.accountId, mockedPatchOperations)
        expect(createSubscriptionRequestSpy).toHaveBeenNthCalledWith(1, expectedArgumentWithoutValidation)
      })

      it('should not patch the account when no account diff', async () => {
        getPatchOperationsMock.mockReturnValueOnce([])

        const wrapper = await getWrapper(true)

        const subscriptionOffers = wrapper.findComponent({ name: 'SubscriptionOffers' })
        subscriptionOffers.vm.$emit('select-offer', firstOffer.offerId)
        await flushPromises()

        const patchAccountSpy = vi.spyOn(ServicesAccount, 'patchAccount')
        const createSubscriptionRequestSpy = vi.spyOn(subscriptionService, 'createSubscriptionRequest')
        const confirmationModal = wrapper.findComponent({ name: 'ConfirmationModal' })
        expect(confirmationModal.exists()).toBe(true)

        confirmationModal.vm.$emit('confirm')

        expect(patchAccountSpy).not.toHaveBeenCalled()
        expect(createSubscriptionRequestSpy).toHaveBeenNthCalledWith(1, expectedArgument)
      })

      it('should console error and track Amplitude event when saving fails for offers without validation', async () => {
        const errorMessage = 'save rejected'
        vi
          .spyOn(subscriptionService, 'createSubscriptionRequest')
          .mockRejectedValueOnce(errorMessage)


        const wrapper = await getWrapper(true)
        const subscriptionOffers = wrapper.findComponent({ name: 'SubscriptionOffers' })
        subscriptionOffers.vm.$emit('select-offer', secondOffer.offerId)
        await flushPromises()

        const confirmationModal = wrapper.findComponent({ name: 'ConfirmationModal' })
        expect(confirmationModal.exists()).toBe(true)

        confirmationModal.vm.$emit('confirm')
        await flushPromises()

        expect(AmplitudeServiceMock.track).toHaveBeenCalledTimes(4)
        expect(AmplitudeServiceMock.track).toHaveBeenNthCalledWith(2, 'Subscription Started', {
          subscription_start_offer_name: subscriptionOffersServices.at(1)?.offerCode,
          subscription_start_result: 'failed',
        })
        expect(AmplitudeServiceMock.track).toHaveBeenNthCalledWith(3, 'Subscription Completed', {
          subscription_complete_offer_name: subscriptionOffersServices.at(1)?.offerCode,
          subscription_complete_localisation: 'offer activation screen',
          subscription_complete_result: 'failed',
        })
        expect(AmplitudeServiceMock.track).toHaveBeenNthCalledWith(4, 'Onboarding Started', {
          onboarding_start_localisation: 'Offer activation',
          onboarding_start_result: 'failed',
        })
        expect(loggerErrorSpy).toHaveBeenCalledOnce()
        expect(loggerErrorSpy).toHaveBeenNthCalledWith(1, errorMessage)
      })
    })

    describe('when input CompanyInformation data', () => {
      it('should call addPathValue with proper arguments', async () => {
        const wrapper = await getWrapper(true)

        const subscriptionOffers = wrapper.findComponent({ name: 'SubscriptionOffers' })
        subscriptionOffers.vm.$emit('select-offer', firstOffer.offerId)
        await flushPromises()

        const nextPreviousButtons = wrapper.findComponent({ name: 'NextPreviousButtons' })
        const STEP_TO_REACH = 3
        for (let i = 0; i < STEP_TO_REACH; i++) {
          if (i === STEP_TO_REACH - 1) {
            const manageCollaboratorsComponent = wrapper.findComponent({ name: 'ManageCollaborators' })
            manageCollaboratorsComponent.vm.$emit('update:selectedCollaboratorsWithRoles', mockedCollaboratorIds)
          }
          nextPreviousButtons.vm.$emit('click-next')
          await nextTick()
        }

        const component = wrapper.findComponent({ name: 'CompanyInformation' })
        const fieldKey = 'accounting.fiscalExerciseDuration'
        const newValue = 10
        component.vm.$emit('input', fieldKey, newValue)
        const patchValues: PatchValue[] = []
        const expectedArguments = [
          fieldKey,
          newValue,
          patchValues,
          mockedAccount,
        ]

        expect(updateAccountOnInputMock).toHaveBeenCalledOnce()
        expect(updateAccountOnInputMock).toHaveBeenNthCalledWith(1, ...expectedArguments)
      })
    })
  })

  describe('props', () => {
    it('should load current account data only on initDrawerForCurrentAccount call', async () => {
      const wrapper = await getWrapper(true, false)
      const offers = wrapper.findComponent({ name: 'SubscriptionOffers' })
      const offerSubscription = wrapper.findComponent({ name: 'OfferSubscription' })

      expect(offers.exists()).toBe(true)
      expect(offerSubscription.exists()).toBe(false)

      expect(getPrincipalContactsMock).not.toHaveBeenCalled()
      expect(fetchAccountSubscriptionsMock).not.toHaveBeenCalled()
      expect(fetchAccountMock).not.toHaveBeenCalled()

      await wrapper.vm.initDrawerForCurrentAccount()

      await offers.vm.$emit('select-offer', firstOffer.offerId)
      await flushPromises()

      expect(offerSubscription.exists()).toBe(false)

      expect(getPrincipalContactsMock).toHaveBeenCalledOnce()
      expect(getPrincipalContactsMock).toHaveBeenCalledWith(mockedAccount.accountId)

      expect(fetchAccountSubscriptionsMock).toHaveBeenCalledOnce()
      expect(fetchAccountSubscriptionsMock).toHaveBeenCalledWith(mockedAccount.accountId)

      expect(fetchAccountMock).toHaveBeenCalledOnce()
      expect(fetchAccountMock).toHaveBeenCalledWith(mockedAccount.accountId)
    })
  })

  describe('offerStepper', () => {
    it('the offer stepper should be displayed after clicking on offer', async () => {
      const wrapper = await getWrapper(true)

      const subscriptionOffers = wrapper.findComponent({ name: 'SubscriptionOffers' })
      subscriptionOffers.vm.$emit('select-offer', firstOffer.offerId)
      await flushPromises()

      const offerStepper = wrapper.find('[data-testid=offer-stepper]')
      expect(offerStepper.exists()).toBe(true)

      const offer = wrapper.findComponent({ name: 'OfferSubscription' })
      expect(offer.exists()).toBe(true)
    })

    it('should display the correct page and maintain notes when using stepper navigation buttons 1/2', async () => {
      const wrapper = await getWrapper(true)

      const subscriptionOffers = wrapper.findComponent({ name: 'SubscriptionOffers' })
      subscriptionOffers.vm.$emit('select-offer', firstOffer.offerId)
      await flushPromises()

      const nextPreviousButtons = wrapper.findComponent({ name: 'NextPreviousButtons' })

      await nextPreviousButtons.vm.$emit('click-next')

      const customersStep = wrapper.find('[data-testid=customers-step]')
      const customersNoteStep = wrapper.findComponent({ name: 'StepNote' })
      await customersNoteStep.vm.$emit('update:modelValue', notes[1])
      expect(customersNoteStep.props()).toStrictEqual({ disabled: false, modelValue: notes[1] })
      expect(customersStep.exists()).toBe(true)

      await nextPreviousButtons.vm.$emit('click-next')
      const collaboratorsStep = wrapper.find('[data-testid=collaborators-step]')
      expect(collaboratorsStep.exists()).toBe(true)
    })

    it('should display the correct page and maintain notes when using stepper navigation buttons 2/2', async () => {
      const wrapper = await getWrapper(true)

      const subscriptionOffers = wrapper.findComponent({ name: 'SubscriptionOffers' })
      subscriptionOffers.vm.$emit('select-offer', firstOffer.offerId)
      await flushPromises()

      const nextPreviousButtons = wrapper.findComponent({ name: 'NextPreviousButtons' })

      await nextPreviousButtons.vm.$emit('click-next')
      const customersNoteStep = wrapper.findComponent({ name: 'StepNote' })
      await customersNoteStep.vm.$emit('update:modelValue', notes[1])

      await nextPreviousButtons.vm.$emit('click-next')

      const manageCollaboratorsComponent = wrapper.findComponent({ name: 'ManageCollaborators' })
      manageCollaboratorsComponent.vm.$emit('update:selectedCollaboratorsWithRoles', mockedCollaboratorIds)

      await nextPreviousButtons.vm.$emit('click-next')
      const informationStep = wrapper.find('[data-testid=information-step]')
      expect(informationStep.exists()).toBe(true)

      nextPreviousButtons.vm.$emit('click-previous')
      nextPreviousButtons.vm.$emit('click-previous')
      await nextTick()

      const customersStep2 = wrapper.find('[data-testid=customers-step]')
      const customersNoteStep2 = wrapper.findComponent({ name: 'StepNote' })
      expect(customersNoteStep2.props('modelValue')).toStrictEqual(notes[1])
      expect(customersStep2.exists()).toBe(true)

      nextPreviousButtons.vm.$emit('click-previous')
      await nextTick()

      const offer = wrapper.findComponent({ name: 'OfferSubscription' })
      expect(offer.exists()).toBe(true)

      nextPreviousButtons.vm.$emit('click-previous')
      await nextTick()

      subscriptionOffers.vm.$emit('select-offer', secondOffer.offerId)
      await flushPromises()

      const expectedCollaboratorIds = [{
        contactId: currentUser.id,
        roleIds: [],
      }]

      expect(manageCollaboratorsComponent.props('selectedCollaboratorsWithRoles')).toStrictEqual(expectedCollaboratorIds)
    })

    it('should render the Manage Collaborators form with the default collaborator set to the authenticated user', async () => {
      const expectedCollaboratorRoles = firstOffer.functions
      const expectedCollaboratorIds = [{
        contactId: currentUser.id,
        roleIds: [],
      }]

      const wrapper = await getWrapper(true)

      const subscriptionOffers = wrapper.findComponent({ name: 'SubscriptionOffers' })
      subscriptionOffers.vm.$emit('select-offer', firstOffer.offerId)
      await flushPromises()

      const nextPreviousButtons = wrapper.findComponent({ name: 'NextPreviousButtons' })

      await nextPreviousButtons.vm.$emit('click-next')

      const customersNoteStep = wrapper.findComponent({ name: 'StepNote' })
      await customersNoteStep.vm.$emit('update:modelValue', notes[1])

      await nextPreviousButtons.vm.$emit('click-next')

      const manageCollaboratorsComponent = wrapper.findComponent({ name: 'ManageCollaborators' })

      expect(manageCollaboratorsComponent.props('selectedCollaboratorsWithRoles')).toHaveLength(1)
      expect(manageCollaboratorsComponent.props('selectedCollaboratorsWithRoles')).toStrictEqual(expectedCollaboratorIds)
      expect(manageCollaboratorsComponent.props('collaboratorRoles')).toStrictEqual(expectedCollaboratorRoles)
    })

    it('should disable the next button when no collaborator is selected', async () => {
      getIsNextButtonDisabledMock.mockReturnValue(true)

      const wrapper = await getWrapper(true)

      const subscriptionOffers = wrapper.findComponent({ name: 'SubscriptionOffers' })
      subscriptionOffers.vm.$emit('select-offer', firstOffer.offerId)
      await flushPromises()

      const nextPreviousButtons = wrapper.findComponent({ name: 'NextPreviousButtons' })

      await nextPreviousButtons.vm.$emit('click-next')

      const customersNoteStep = wrapper.findComponent({ name: 'StepNote' })
      await customersNoteStep.vm.$emit('update:modelValue', notes[1])

      await nextPreviousButtons.vm.$emit('click-next')

      const manageCollaboratorsComponent = wrapper.findComponent({ name: 'ManageCollaborators' })
      manageCollaboratorsComponent.vm.$emit('update:selectedCollaboratorsWithRoles', [])
      await nextTick()

      expect(nextPreviousButtons.props('isNextButtonDisabled')).toBe(true)
    })

    it('should not display the note textarea when the validation is not required', async () => {
      const offerWithNoneRequiredValidation = subscriptionOffersServices[1]

      const wrapper = await getWrapper(true)

      const subscriptionOffers = wrapper.findComponent({ name: 'SubscriptionOffers' })
      subscriptionOffers.vm.$emit('select-offer', offerWithNoneRequiredValidation.offerId)
      await flushPromises()

      const noteStep = wrapper.findComponent({ name: 'StepNote' })
      expect(noteStep.exists()).toBe(false)

      const offer = wrapper.findComponent({ name: 'OfferSubscription' })
      expect(offer.exists()).toBe(true)
    })
  })
})
