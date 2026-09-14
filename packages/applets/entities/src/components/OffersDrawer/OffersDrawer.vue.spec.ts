import { shallowMount, flushPromises } from '@vue/test-utils'
import { nextTick } from 'vue'
import { loggerErrorSpy } from '@pulse/toolbox/mocks'
import { getMockedSubscriptionOffers, getMockedSubscriptionOffersServices, getRFinanceSubscriptionOfferServiceMock } from '@entities/__mocks__/offer-subscription.mocks'
import { getMockedUser } from '@entities/__mocks__/users-client.mocks'
import { getMockedStepNotes } from '@entities/__mocks__/step-notes.mocks'
import type { SubscriptionOffer, SubscriptionOfferServices } from '@entities/types'
import type { AccountSignatories } from '@entities/services/account/account.type'
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
import type { PatchOperation, PatchValue } from '@entities/services/patch-record'
import { AmplitudeServiceMock } from '@pulse/common/mocks/vitest'
import { getMockedCollaborators } from '@entities/__mocks__/collaborators.mocks'
import { getMockedPrincipalContacts } from '@entities/__mocks__/principal-contact.mocks'

import {
  getHasNoSignatory,
  getIsAllCollaboratorRoleSelected,
  getIsMissingCollaboratorRole,
  getIsNextButtonDisabled,
  getIsNoCollaboratorSelected,
  updateAccountOnInput,
} from './OffersDrawer.utils'
import { getAllOffers, getOffer, getOffersBookLink } from '@entities/services/offer'
import { addPathValue, getPatchOperations } from '@entities/services/patch-record/patch-record.service'

import OffersDrawer from '.'

const getHasNoSignatoryMock = vi.mocked(getHasNoSignatory)
const getIsNoCollaboratorSelectedMock = vi.mocked(getIsNoCollaboratorSelected)
const getIsAllCollaboratorRoleSelectedMock = vi.mocked(getIsAllCollaboratorRoleSelected)
const getIsMissingCollaboratorRoleMock = vi.mocked(getIsMissingCollaboratorRole)
const getIsNextButtonDisabledMock = vi.mocked(getIsNextButtonDisabled)
const updateAccountOnInputMock = vi.mocked(updateAccountOnInput)

const principalContacts: AccountSignatories[] = getMockedPrincipalContacts()
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
const hubName = mockedAccount.hub?.hubName
const mockedPatchOperations = getMockedPatchOperations()
const mockedCollaborators = getMockedCollaborators()
const mockedCollaboratorIds = mockedCollaborators.map(({ id }) => id)

const getAllOffersMock = vi.mocked(getAllOffers)
const getAccountSignatoriesMock = vi.mocked(ServicesAccount.getAccountSignatories)
const fetchAccountMock = vi.mocked(ServicesAccount.fetchAccount)
const addPathValueMock = vi.mocked(addPathValue)
const getPatchOperationsMock = vi.mocked(getPatchOperations)
const fetchAccountSubscriptionsMock = vi.mocked(subscriptionService.fetchAccountSubscriptions)

beforeEach(() => {
  getHasNoSignatoryMock.mockReturnValue(undefined as unknown as boolean)
  getIsNoCollaboratorSelectedMock.mockReturnValue(undefined as unknown as boolean)
  getIsAllCollaboratorRoleSelectedMock.mockReturnValue(undefined as unknown as boolean)
  getIsMissingCollaboratorRoleMock.mockReturnValue(undefined as unknown as boolean)
  getIsNextButtonDisabledMock.mockReturnValue(undefined as unknown as boolean)
  updateAccountOnInputMock.mockImplementation(() => undefined)
  addPathValueMock.mockImplementation(() => undefined)
  getPatchOperationsMock.mockReturnValue(undefined as unknown as PatchOperation[])
  getAllOffersMock.mockImplementation(() => Promise.resolve(subscriptionOffers))
  vi.mocked(getOffer).mockImplementation((offerId) =>
    Promise.resolve(
      subscriptionOffersServices.find((item) => item.offerId === offerId),
    ))
  vi.mocked(getOffersBookLink).mockImplementation(() => offersBookTestLink)
  vi.mocked(ServicesAccount.fetchAccountReferential).mockResolvedValue(getMockedAccountReferential())
  vi.mocked(ServicesAccount.fetchReferentialHubs).mockResolvedValue(getMockedReferentialHubs())
  fetchAccountMock.mockResolvedValue(mockedAccount)
  vi.mocked(ServicesAccount.patchAccount).mockResolvedValue(undefined)
  getAccountSignatoriesMock.mockResolvedValue(principalContacts)
  vi.mocked(subscriptionService.createSubscriptionRequest).mockResolvedValue(undefined)
  fetchAccountSubscriptionsMock.mockImplementation(() => Promise.resolve([]))
})

const accountNumber = 'account-number'
const accountId = mockedAccount.accountId

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
    getIsNextButtonDisabledMock.mockReturnValue(false)
  })
  describe('interactions', () => {
    it('should display current offer when an offer is selected', async () => {
      const wrapper = await getWrapper(true)

      const subscriptionOffers = wrapper.findComponent({ name: 'SubscriptionOffers' })
      subscriptionOffers.vm.$emit('select-offer', secondOffer.offerId)
      await flushPromises()

      expect(AmplitudeServiceMock.track).toHaveBeenCalledExactlyOnceWith('Subscription Initiated', {
        subscription_initiate_offer_name: subscriptionOffersServices.at(1)?.offerCode,
      })
      const offers = wrapper.findComponent({ name: 'SubscriptionOffers' })
      expect(offers.exists()).toBe(false)

      const offer = wrapper.findComponent({ name: 'OfferSubscription' })
      expect(offer.exists()).toBe(true)
    })

    it('should hide current offer when click on backButton', async () => {
      const wrapper = await getWrapper(true)

      const subscriptionOffers = wrapper.findComponent({ name: 'SubscriptionOffers' })
      subscriptionOffers.vm.$emit('select-offer', secondOffer.offerId)
      await flushPromises()

      const nextPreviousButtons = wrapper.findComponent({ name: 'PDrawerActions' })

      nextPreviousButtons.vm.$emit('click-back-cta')
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
        applicant: currentUser.email,
        contacts: [1, 2, currentUser.id],
        offerId: 1,
        notes,
        productConfigurations: [1, 2, 3, 4],
        contactFunctions: [],
        hubName,
        planId: undefined,
      }
      const expectedArgumentWithoutValidation: PostSubscriptionRequest = {
        accountId,
        applicant: currentUser.email,
        contacts: [1, 2, currentUser.id],
        offerId: 2,
        notes: [],
        productConfigurations: [5],
        hubName,
        planId: undefined,
      }

      it('should patch the account and create a subscription when the user confirms', async () => {
        const content = 'confirmationContent'

        const expectedConfirmationModalBefore = {
          cancelButtonLabel: 'cancel',
          confirmButtonLabel: 'confirm',
          content,
          isCancelButtonDisabled: false,
          isConfirmButtonDisabled: false,
          isConfirmButtonLoading: false,
          modelValue: false,
          title: 'confirmationTitle',
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

        const patchAccountSpy = vi.mocked(ServicesAccount.patchAccount)
        const createSubscriptionRequestSpy = vi.mocked(subscriptionService.createSubscriptionRequest)

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
        const patchAccountSpy = vi.mocked(ServicesAccount.patchAccount)
        const createSubscriptionRequestSpy = vi.mocked(subscriptionService.createSubscriptionRequest)

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

        const patchAccountSpy = vi.mocked(ServicesAccount.patchAccount)
        const createSubscriptionRequestSpy = vi.mocked(subscriptionService.createSubscriptionRequest)
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

        const nextPreviousButtons = wrapper.findComponent({ name: 'PDrawerActions' })
        const STEP_TO_REACH = 3
        for (let i = 0; i < STEP_TO_REACH; i++) {
          if (i === STEP_TO_REACH - 1) {
            const manageCollaboratorsComponent = wrapper.findComponent({ name: 'ManageCollaborators' })
            manageCollaboratorsComponent.vm.$emit('update:selectedCollaboratorsWithRoles', mockedCollaboratorIds)
          }
          nextPreviousButtons.vm.$emit('click-primary-cta')
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

      expect(getAccountSignatoriesMock).not.toHaveBeenCalled()
      expect(fetchAccountSubscriptionsMock).not.toHaveBeenCalled()
      expect(fetchAccountMock).not.toHaveBeenCalled()

      await wrapper.vm.initDrawerForCurrentAccount()

      await offers.vm.$emit('select-offer', firstOffer.offerId)
      await flushPromises()

      expect(offerSubscription.exists()).toBe(false)

      expect(getAccountSignatoriesMock).toHaveBeenCalledExactlyOnceWith(mockedAccount.accountId)

      expect(fetchAccountSubscriptionsMock).toHaveBeenCalledExactlyOnceWith(mockedAccount.accountId)

      expect(fetchAccountMock).toHaveBeenCalledExactlyOnceWith(mockedAccount.accountId)
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

      const nextPreviousButtons = wrapper.findComponent({ name: 'PDrawerActions' })

      await nextPreviousButtons.vm.$emit('click-primary-cta')

      const customersStep = wrapper.find('[data-testid=customers-step]')
      const customersNoteStep = wrapper.findComponent({ name: 'StepNote' })
      await customersNoteStep.vm.$emit('update:modelValue', notes[1])
      expect(customersNoteStep.props()).toStrictEqual({ disabled: false, modelValue: notes[1] })
      expect(customersStep.exists()).toBe(true)

      await nextPreviousButtons.vm.$emit('click-primary-cta')
      const collaboratorsStep = wrapper.find('[data-testid=collaborators-step]')
      expect(collaboratorsStep.exists()).toBe(true)
    })

    it('should display the correct page and maintain notes when using stepper navigation buttons 2/2', async () => {
      const wrapper = await getWrapper(true)

      const subscriptionOffers = wrapper.findComponent({ name: 'SubscriptionOffers' })
      subscriptionOffers.vm.$emit('select-offer', firstOffer.offerId)
      await flushPromises()

      const nextPreviousButtons = wrapper.findComponent({ name: 'PDrawerActions' })

      await nextPreviousButtons.vm.$emit('click-primary-cta')
      const customersNoteStep = wrapper.findComponent({ name: 'StepNote' })
      await customersNoteStep.vm.$emit('update:modelValue', notes[1])

      await nextPreviousButtons.vm.$emit('click-primary-cta')

      const manageCollaboratorsComponent = wrapper.findComponent({ name: 'ManageCollaborators' })
      manageCollaboratorsComponent.vm.$emit('update:selectedCollaboratorsWithRoles', mockedCollaboratorIds)

      await nextPreviousButtons.vm.$emit('click-primary-cta')
      const informationStep = wrapper.find('[data-testid=information-step]')
      expect(informationStep.exists()).toBe(true)

      nextPreviousButtons.vm.$emit('click-back-cta')
      nextPreviousButtons.vm.$emit('click-back-cta')
      await nextTick()

      const customersStep2 = wrapper.find('[data-testid=customers-step]')
      const customersNoteStep2 = wrapper.findComponent({ name: 'StepNote' })
      expect(customersNoteStep2.props('modelValue')).toStrictEqual(notes[1])
      expect(customersStep2.exists()).toBe(true)

      nextPreviousButtons.vm.$emit('click-back-cta')
      await nextTick()

      const offer = wrapper.findComponent({ name: 'OfferSubscription' })
      expect(offer.exists()).toBe(true)

      nextPreviousButtons.vm.$emit('click-back-cta')
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

      const nextPreviousButtons = wrapper.findComponent({ name: 'PDrawerActions' })

      await nextPreviousButtons.vm.$emit('click-primary-cta')

      const customersNoteStep = wrapper.findComponent({ name: 'StepNote' })
      await customersNoteStep.vm.$emit('update:modelValue', notes[1])

      await nextPreviousButtons.vm.$emit('click-primary-cta')

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

      const nextPreviousButtons = wrapper.findComponent({ name: 'PDrawerActions' })

      await nextPreviousButtons.vm.$emit('click-primary-cta')

      const customersNoteStep = wrapper.findComponent({ name: 'StepNote' })
      await customersNoteStep.vm.$emit('update:modelValue', notes[1])

      await nextPreviousButtons.vm.$emit('click-primary-cta')

      const manageCollaboratorsComponent = wrapper.findComponent({ name: 'ManageCollaborators' })
      manageCollaboratorsComponent.vm.$emit('update:selectedCollaboratorsWithRoles', [])
      await nextTick()

      expect(nextPreviousButtons.props('pPrimaryCTA').pDisabled).toBe(true)
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

  describe('Error Handling - 409 Conflict Account Attachment Missing', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      getPatchOperationsMock.mockReturnValue([])
    })

    it('should return true on successful subscription creation', async () => {
      const createSubscriptionRequestSpy = vi.spyOn(
        subscriptionService,
        'createSubscriptionRequest',
      ).mockResolvedValue({})

      const wrapper = await getWrapper(true)
      await wrapper.vm.initDrawerForCurrentAccount()

      const subscriptionOffers = wrapper.findComponent({ name: 'SubscriptionOffers' })
      subscriptionOffers.vm.$emit('select-offer', secondOffer.offerId)
      await flushPromises()

      const confirmationModal = wrapper.findComponent({ name: 'ConfirmationModal' })
      expect(confirmationModal.exists()).toBe(true)
      expect(confirmationModal.props('modelValue')).toBe(false)

      const nextPreviousButtons = wrapper.findComponent({ name: 'PDrawerActions' })
      await nextPreviousButtons.vm.$emit('click-primary-cta')
      await flushPromises()

      const confirmModal = wrapper.findComponent({ name: 'ConfirmationModal' })
      expect(confirmModal.props('modelValue')).toBe(true)

      await confirmModal.vm.$emit('confirm')
      await flushPromises()

      expect(createSubscriptionRequestSpy).toHaveBeenCalledOnce()
      expect(confirmModal.props('modelValue')).toBe(false)
      expect(wrapper.emitted('offer-saved')).toBeTruthy()
    })

    it('should open prerequisite modal and close confirmation modal on 409 + GTW027 error', async () => {
      const error409 = {
        response: {
          status: 409,
          data: {
            errorCode: 'GTW027',
          },
        },
      }

      const createSubscriptionRequestSpy = vi.spyOn(
        subscriptionService,
        'createSubscriptionRequest',
      ).mockRejectedValue(error409)

      const wrapper = await getWrapper(true)
      await wrapper.vm.initDrawerForCurrentAccount()

      const subscriptionOffers = wrapper.findComponent({ name: 'SubscriptionOffers' })
      subscriptionOffers.vm.$emit('select-offer', secondOffer.offerId)
      await flushPromises()

      const nextPreviousButtons = wrapper.findComponent({ name: 'PDrawerActions' })
      await nextPreviousButtons.vm.$emit('click-primary-cta')
      await flushPromises()

      const confirmModal = wrapper.findComponent({ name: 'ConfirmationModal' })
      expect(confirmModal.props('modelValue')).toBe(true)

      const prerequisiteModalBefore = wrapper.findComponent({ name: 'PennylaneActivationPrerequisiteModal' })
      expect(prerequisiteModalBefore.props('modelValue')).toBe(false)

      await confirmModal.vm.$emit('confirm')
      await flushPromises()

      expect(createSubscriptionRequestSpy).toHaveBeenCalledOnce()

      const prerequisiteModalAfter = wrapper.findComponent({ name: 'PennylaneActivationPrerequisiteModal' })
      expect(prerequisiteModalAfter.props('modelValue')).toBe(true)

      const confirmModalAfter = wrapper.findComponent({ name: 'ConfirmationModal' })
      expect(confirmModalAfter.props('modelValue')).toBe(false)

      expect(wrapper.emitted('offer-saved')).toBeFalsy()
    })

    it('should not open prerequisite modal on 409 with different error code', async () => {
      const error409OtherCode = {
        response: {
          status: 409,
          data: {
            errorCode: 'OTHER_ERROR',
          },
        },
      }

      const createSubscriptionRequestSpy = vi.spyOn(
        subscriptionService,
        'createSubscriptionRequest',
      ).mockRejectedValue(error409OtherCode)

      const wrapper = await getWrapper(true)
      await wrapper.vm.initDrawerForCurrentAccount()

      const subscriptionOffers = wrapper.findComponent({ name: 'SubscriptionOffers' })
      subscriptionOffers.vm.$emit('select-offer', secondOffer.offerId)
      await flushPromises()

      const nextPreviousButtons = wrapper.findComponent({ name: 'PDrawerActions' })
      await nextPreviousButtons.vm.$emit('click-primary-cta')
      await flushPromises()

      const confirmModal = wrapper.findComponent({ name: 'ConfirmationModal' })
      await confirmModal.vm.$emit('confirm')
      await flushPromises()

      expect(createSubscriptionRequestSpy).toHaveBeenCalledOnce()

      const prerequisiteModal = wrapper.findComponent({ name: 'PennylaneActivationPrerequisiteModal' })
      expect(prerequisiteModal.props('modelValue')).toBe(false)

      expect(wrapper.emitted('offer-saved')).toBeFalsy()
    })

    it('should not open prerequisite modal on 500 error', async () => {
      const error500 = {
        response: {
          status: 500,
          data: {
            errorMessage: 'Internal Server Error',
          },
        },
      }

      const createSubscriptionRequestSpy = vi.spyOn(
        subscriptionService,
        'createSubscriptionRequest',
      ).mockRejectedValue(error500)

      const wrapper = await getWrapper(true)
      await wrapper.vm.initDrawerForCurrentAccount()

      const subscriptionOffers = wrapper.findComponent({ name: 'SubscriptionOffers' })
      subscriptionOffers.vm.$emit('select-offer', secondOffer.offerId)
      await flushPromises()

      const nextPreviousButtons = wrapper.findComponent({ name: 'PDrawerActions' })
      await nextPreviousButtons.vm.$emit('click-primary-cta')
      await flushPromises()

      const confirmModal = wrapper.findComponent({ name: 'ConfirmationModal' })
      await confirmModal.vm.$emit('confirm')
      await flushPromises()

      expect(createSubscriptionRequestSpy).toHaveBeenCalledOnce()

      const prerequisiteModal = wrapper.findComponent({ name: 'PennylaneActivationPrerequisiteModal' })
      expect(prerequisiteModal.props('modelValue')).toBe(false)

      expect(wrapper.emitted('offer-saved')).toBeFalsy()
      expect(loggerErrorSpy).toHaveBeenCalled()
    })

    it('should close confirmation modal even on error', async () => {
      const error500 = {
        response: {
          status: 500,
        },
      }

      vi.mocked(subscriptionService.createSubscriptionRequest).mockRejectedValue(error500)

      const wrapper = await getWrapper(true)
      await wrapper.vm.initDrawerForCurrentAccount()

      const subscriptionOffers = wrapper.findComponent({ name: 'SubscriptionOffers' })
      subscriptionOffers.vm.$emit('select-offer', secondOffer.offerId)
      await flushPromises()

      const nextPreviousButtons = wrapper.findComponent({ name: 'PDrawerActions' })
      await nextPreviousButtons.vm.$emit('click-primary-cta')
      await flushPromises()

      const confirmModalBefore = wrapper.findComponent({ name: 'ConfirmationModal' })
      expect(confirmModalBefore.props('modelValue')).toBe(true)

      await confirmModalBefore.vm.$emit('confirm')
      await flushPromises()

      const confirmModalAfter = wrapper.findComponent({ name: 'ConfirmationModal' })
      expect(confirmModalAfter.props('modelValue')).toBe(false)

      expect(wrapper.emitted('offer-saved')).toBeFalsy()
    })
  })

  describe('R/Finance offer', () => {
    const rFinanceOfferService = getRFinanceSubscriptionOfferServiceMock()
    const rFinanceOfferSummary: SubscriptionOffer = {
      offerId: rFinanceOfferService.offerId,
      offerName: rFinanceOfferService.offerName,
      offerLabel: rFinanceOfferService.offerLabel,
      offerPrice: rFinanceOfferService.offerPrice,
      offerCode: rFinanceOfferService.offerCode,
      offerPriceType: rFinanceOfferService.offerPriceType,
      logoName: rFinanceOfferService.logoName,
    }

    beforeEach(() => {
      getIsNextButtonDisabledMock.mockReturnValue(false)
      getAllOffersMock.mockResolvedValue([...subscriptionOffers, rFinanceOfferSummary])
      vi.mocked(getOffer).mockResolvedValue(rFinanceOfferService)
    })

    it('should display a 3-step flow without an information step and activate the offer on submit', async () => {
      const createSubscriptionRequestSpy = vi.mocked(subscriptionService.createSubscriptionRequest)

      const wrapper = await getWrapper(true)

      const offers = wrapper.findComponent({ name: 'SubscriptionOffers' })
      offers.vm.$emit('select-offer', rFinanceOfferService.offerId)
      await flushPromises()

      const stepper = wrapper.findComponent({ name: 'PSteps' })
      expect(stepper.exists()).toBe(true)
      expect(stepper.props('pSteps')).toHaveLength(3)

      // No MOD note step: R/Finance is an instant activation
      expect(wrapper.findComponent({ name: 'StepNote' }).exists()).toBe(false)

      const nextPreviousButtons = wrapper.findComponent({ name: 'PDrawerActions' })

      // Step 1 (services) -> step 2 (customers)
      await nextPreviousButtons.vm.$emit('click-primary-cta')
      expect(wrapper.find('[data-testid=customers-step]').exists()).toBe(true)

      // Step 2 (customers) -> step 3 (collaborators)
      await nextPreviousButtons.vm.$emit('click-primary-cta')
      expect(wrapper.find('[data-testid=collaborators-step]').exists()).toBe(true)

      // The information step never appears
      expect(wrapper.find('[data-testid=information-step]').exists()).toBe(false)

      // Submitting on the last step opens the confirmation modal
      await nextPreviousButtons.vm.$emit('click-primary-cta')
      const confirmationModal = wrapper.findComponent({ name: 'ConfirmationModal' })
      expect(confirmationModal.props('modelValue')).toBe(true)

      await confirmationModal.vm.$emit('confirm')
      await flushPromises()

      expect(createSubscriptionRequestSpy).toHaveBeenCalledOnce()
      expect(wrapper.emitted('offer-saved')).toStrictEqual([[]])
    })
  })
})
