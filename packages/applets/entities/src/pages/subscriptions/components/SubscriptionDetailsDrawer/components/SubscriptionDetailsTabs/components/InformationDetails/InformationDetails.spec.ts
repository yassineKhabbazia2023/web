import { expect, describe, it, beforeEach, vi } from 'vitest'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import {
  getMockedAccount,
  getMockedAccountReferential,
  getMockedReferentialHubs,
} from '@entities/services/account/accountMock'
import * as accountServices from '@entities/services/account'
import LOOPOfferForm from '@entities/common/config/forms/LOOPOfferFormStructure.json'
import MEGOffersFormStructure from '@entities/common/config/forms/MEGOffersFormStructure.json'
import {
  getMockedSubscriptionOffersServices,
} from '@entities/pages/entities/components/OfferSubscription/OfferSubscriptionMocks'
import type { InformationDetailsProps } from './InformationDetailsTypes'
import InformationDetails from '.'
import { ProviderName } from '@entities/common/types/ProviderNameEnums'

// Mocks
const mockedAccountId = 602
const mockedSubscriptionMEGOfferDetails =
  getMockedSubscriptionOffersServices()[0]
const mockedSubscriptionLoopOfferDetails =
  getMockedSubscriptionOffersServices()[2]
const mockedGetFormStructure = vi.hoisted(() => vi.fn(() => MEGOffersFormStructure))
vi.mock('@entities/common/utils/referential', () => ({
  getFormStructure: mockedGetFormStructure,
}))
vi.mock('@entities/services/account', () => ({
  fetchAccount: vi.fn(() => Promise.resolve(getMockedAccount())),
  fetchAccountReferential: vi.fn(() => getMockedAccountReferential()),
  fetchReferentialHubs: vi.fn(() => getMockedReferentialHubs()),
}))

// Expectations
const expectedAlertInstruction =
  'If any information is incorrect, please update it in the CRM'

const defaultProps: InformationDetailsProps = {
  accountId: mockedAccountId,
  subscriptionOfferDetails: mockedSubscriptionMEGOfferDetails,
}

const createWrapper = (
  overriddenProps: InformationDetailsProps = defaultProps,
) => {
  return mount(InformationDetails, {
    props: {
      ...overriddenProps,
    },
  })
}

// Unit Tests
describe('informationDetails', () => {
  let wrapper: VueWrapper<any>
  beforeEach(async () => {
    wrapper = createWrapper()
    await flushPromises()
  })
  describe('display', () => {
    it('should accurately display the subscription information tab', () => {
      const alertInstruction = wrapper.find(
        '[data-testid="subscription-details-information-alert"]',
      )
      const informationForm = wrapper.find(
        '[data-testid="subscription-details-information-form"]',
      )

      expect(informationForm.exists()).toBeTruthy()
      expect(alertInstruction.text()).toBe(expectedAlertInstruction)
    })
    it('should display all form sections for MEG offers correctly', () => {
      const provider = wrapper.vm.providerName
      const formSections = wrapper.findAll(
        '.information-details__form-section',
      )

      expect(provider).toBe('MEG')
      expect(formSections).toHaveLength(MEGOffersFormStructure.length)
    })
    it('should display all form sections for the LOOP offer correctly', async () => {
      mockedGetFormStructure.mockReturnValue(LOOPOfferForm)
      wrapper = createWrapper({
        subscriptionOfferDetails: mockedSubscriptionLoopOfferDetails,
        accountId: mockedAccountId,
      })
      await flushPromises()
      const provider = wrapper.vm.providerName
      const formSections = wrapper.findAll(
        '.information-details__form-section',
      )

      expect(provider).toBe(ProviderName.LOOP)
      expect(formSections).toHaveLength(LOOPOfferForm.length)
    })
    it('should display the form once the loader has finished', async () => {
      wrapper.vm.isLoading = true
      await flushPromises()
      let loader = wrapper.find(
        '[data-testid="subscription-details-information-loader"]',
      )
      let informationForm = wrapper.find(
        '[data-testid="subscription-details-information-form"]',
      )

      expect(loader.exists()).toBeTruthy()
      expect(informationForm.exists()).toBeFalsy()

      wrapper.vm.isLoading = false
      await flushPromises()
      informationForm = wrapper.find(
        '[data-testid="subscription-details-information-form"]',
      )
      loader = wrapper.find(
        '[data-testid="subscription-details-information-loader"]',
      )

      expect(loader.exists()).toBeFalsy()
      expect(informationForm.exists()).toBeTruthy()
    })
  })
  describe('events', () => {
    it('should call the Account API with the correct parameters to fetch the account details', async () => {
      const spyFetchAccount = vi.spyOn(accountServices, 'fetchAccount')
      createWrapper()
      await flushPromises()

      expect(spyFetchAccount).toHaveBeenCalledOnce()
      expect(spyFetchAccount).toHaveBeenCalledWith(mockedAccountId)
    })
    it('should display a console error if the request to fetch account fails', async () => {
      const spyConsole = vi.spyOn(console, 'error')
      const expectedErrorMessage = 'API Error: 503 Service Unavailable'
      vi.spyOn(accountServices, 'fetchAccount').mockRejectedValue(
        expectedErrorMessage,
      )
      createWrapper()
      await flushPromises()

      expect(spyConsole).toHaveBeenCalledOnce()
      expect(spyConsole).toHaveBeenCalledWith(
        'Error fetching information: ',
        expectedErrorMessage,
      )
    })
  })
})
