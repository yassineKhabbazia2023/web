import { expect, describe, it, beforeEach, vi } from 'vitest'
import { flushPromises, shallowMount } from '@vue/test-utils'
import {
  getMockedAccount,
  getMockedAccountReferential,
  getMockedReferentialHubs,
} from '@entities/__mocks__/account-row.mocks'
import * as accountServices from '@entities/services/account'
import LOOPOfferForm from '@entities/common/config/forms/LOOPOfferFormStructure.json'
import MEGOffersFormStructure from '@entities/common/config/forms/MEGOffersFormStructure.json'
import { loggerErrorSpy, loggerMock } from '@pulse/core/mocks'
import { getMockedSubscriptionOffersServices } from '@entities/__mocks__/offer-subscription.mocks'
import type { InformationDetailsProps } from './InformationDetailsTypes'
import InformationDetails from '.'

// Mocks
const mockedAccountId = 602
const mockedSubscriptionMEGOfferDetails =
  getMockedSubscriptionOffersServices()[0]
const mockedSubscriptionLoopOfferDetails =
  getMockedSubscriptionOffersServices()[2]

const getFormStructureMock = vi.hoisted(() => vi.fn(() => MEGOffersFormStructure))
const cleanRecordStructureMock = vi.hoisted(() => vi.fn())

vi.mock('@pulse/core', () => ({ logger: loggerMock }))

vi.mock('@entities/common/utils/referential', () => ({
  getFormStructure: getFormStructureMock,
  cleanRecordStructure: cleanRecordStructureMock,
}))
const accountMock = getMockedAccount()
const fetchAccountMock = vi.hoisted(() => vi.fn())
vi.mock('@entities/services/account', () => ({
  fetchAccount: fetchAccountMock,
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

const createWrapper = (overriddenProps: Partial<InformationDetailsProps> = {}) => {
  const props = {
    ...defaultProps,
    ...overriddenProps,
  }
  return shallowMount(InformationDetails, {
    props,
    global: {
      stubs: {
        PForm: {
          name: 'PForm',
          template: '<div><slot /></div>',
          props: ['pModel'],
        },
        PAlert: {
          name: 'PAlert',
          template: '<div><slot /></div>',
        },
      },
    },
  })
}

// Unit Tests
describe('informationDetails', () => {
  beforeEach(async () => {
    fetchAccountMock.mockResolvedValue(accountMock)
  })
  describe('display', () => {
    let wrapper: ReturnType<typeof createWrapper>
    beforeEach(async () => {
      wrapper = createWrapper()
      await flushPromises()
    })
    it('should accurately display the subscription information tab', () => {
      const alertInstruction = wrapper.find('[data-testid="subscription-details-information-alert"]')
      const informationForm = wrapper.find('[data-testid="subscription-details-information-form"]')

      expect(informationForm.exists()).toBeTruthy()
      expect(alertInstruction.text()).toBe(expectedAlertInstruction)
    })
    it('should display all form sections for MEG offers correctly', () => {
      const formSections = wrapper.findAll(
        '.information-details__form-section',
      )

      expect(formSections).toHaveLength(MEGOffersFormStructure.length)
    })
    it('should display all form sections for the LOOP offer correctly', async () => {
      getFormStructureMock.mockReturnValue(LOOPOfferForm)
      wrapper = createWrapper({
        subscriptionOfferDetails: mockedSubscriptionLoopOfferDetails,
        accountId: mockedAccountId,
      })
      await flushPromises()
      const formSections = wrapper.findAll('.information-details__form-section')

      expect(formSections).toHaveLength(LOOPOfferForm.length)
    })
  })
  describe('events', () => {
    it('should display the form once the loader has finished', async () => {
      const wrapper = createWrapper()
      const loaderBefore = wrapper.find('[data-testid="subscription-details-information-loader"]')
      const informationFormBefore = wrapper.find('[data-testid="subscription-details-information-form"]')

      expect(loaderBefore.exists()).toBe(true)
      expect(informationFormBefore.exists()).toBe(false)

      await flushPromises()
      const loaderAfter = wrapper.find('[data-testid="subscription-details-information-loader"]')
      const informationFormAfter = wrapper.find('[data-testid="subscription-details-information-form"]')

      expect(loaderAfter.exists()).toBe(false)
      expect(informationFormAfter.exists()).toBe(true)
    })
    it('should call the Account API with the correct parameters to fetch the account details', async () => {
      const spyFetchAccount = vi.spyOn(accountServices, 'fetchAccount')
      createWrapper()
      await flushPromises()

      expect(spyFetchAccount).toHaveBeenCalledOnce()
      expect(spyFetchAccount).toHaveBeenCalledWith(mockedAccountId)

      expect(cleanRecordStructureMock).toHaveBeenCalledOnce()
      expect(cleanRecordStructureMock).toHaveBeenCalledWith(MEGOffersFormStructure, accountMock)
    })
    it('should display a console error if the request to fetch account fails', async () => {
      const expectedErrorMessage = 'API Error: 503 Service Unavailable'
      vi.spyOn(accountServices, 'fetchAccount').mockRejectedValue(
        expectedErrorMessage,
      )
      createWrapper()
      await flushPromises()

      expect(loggerErrorSpy).toHaveBeenCalledOnce()
      expect(loggerErrorSpy).toHaveBeenCalledWith(
        'Error fetching information: ',
        expectedErrorMessage,
      )
    })
  })
})
