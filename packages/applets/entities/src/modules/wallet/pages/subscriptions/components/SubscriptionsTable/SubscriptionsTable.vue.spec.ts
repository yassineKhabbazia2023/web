import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { subscriptionRequestMock } from '@entities/__mocks__/subscription.mocks'
import { AmplitudeService } from '@pulse/common/services/amplitude'
import type { ComponentWrapper } from '@pulse/toolbox/utils/test'
import { nextTick } from 'vue'
import { getMockedUserInfo } from '@pulse/common/mocks'
import { getStoreMock } from '@pulse/common/mocks/vitest'
import { useUserStore } from '@pulse/common/stores'
import * as styleguide from '@pulse/styleguide'

import SubscriptionsTable from '.'

const userStoreMock = getStoreMock(useUserStore)

const { subscriptionId, offer, status } = subscriptionRequestMock[0]
const { mockValidateSubscriptionRequest, mockFetchSubscriptionRequests } = vi.hoisted(() => ({
  mockValidateSubscriptionRequest: vi.fn(() => Promise.resolve()),
  mockFetchSubscriptionRequests: vi.fn(() => Promise.resolve(subscriptionRequestMock)),
}))
vi.mock('@entities/services/subscription', async () => {
  const actual = await vi.importActual('@entities/services/subscription')
  return {
    ...(actual as object),
    validateSubscriptionRequest: mockValidateSubscriptionRequest,
    fetchSubscriptionRequests: mockFetchSubscriptionRequests,
  }
})

vi.mock('@pulse/common/services/amplitude')

const requestMenu = [
  {
    pIconName: 'eye',
    pValue: 'Consult',
    pActionName: 'consult',
    pState: 'default',
  },
  {
    pIconName: 'check',
    pValue: 'Validate request',
    pActionName: 'validate',
    pState: 'default',
  },
]

const pTableColumnsLabel: { [key: number]: string } = {
  0: 'Legal name',
  1: 'Customer code',
  2: 'Date',
  3: 'Requester',
  4: 'Offer',
  5: 'User',
  6: 'Status',
}

const emailMock = 'email-mock'

describe('subscriptionsTable', () => {
  let wrapper: ComponentWrapper<InstanceType<typeof SubscriptionsTable>>
  beforeEach(async () => {
    userStoreMock.user = getMockedUserInfo({
      email: emailMock,
    })
    wrapper = mount(SubscriptionsTable, {
      global: {
        stubs: {
          PLoader: true,
          SubscriptionsFilter: true,
          PToolbox: true,
          PButton: true,
          PIcon: true,
        },
      },
    })
    await flushPromises()
  })
  it('should render the subscription table correctly', () => {
    const pTable = wrapper.findComponent('[data-testid="subscriptions-table"]') as VueWrapper
    expect(pTable.exists()).toBeTruthy()

    const pTableColumns = pTable.findAllComponents({ name: 'ElTableColumn' })
    for (let i = 0; i <= 6; i++) {
      const pColumn = pTableColumns.at(i)
      expect(pColumn?.props('label')).toBe(pTableColumnsLabel[i])
    }

    const dataRows = pTable.findAll('tr.el-table__row')
    expect(dataRows.length).equals(subscriptionRequestMock.length)

    const cells = dataRows[0].findAll('td')
    const cellsText = cells.map((cell) => cell.text())
    const expected: string[] = [
      'Test Indicators 1',
      'V900000163',
      '3/24/2023',
      'test-01@test.fr',
      'Modules MEG : facturation et caisse',
      'TTTFirsName TLastNameTLastName+test@test.onmicrosoft.com',
      'To validate',
      '',
    ]
    expect(cellsText).toMatchObject(expected)
  })

  it('should display subscription toolbox items', () => {
    const pToolbox = wrapper.findComponent({ name: 'PToolbox' })

    expect(pToolbox.props('pElements')).toStrictEqual(requestMenu)
  })

  it('should display the subscriptions table filtered by offer type', async () => {
    wrapper.vm.offerTypeSelection = ['MEG Smart']
    wrapper.vm.handleOfferFiltered()
    await nextTick()
    const subscriptionsTable = wrapper.findComponent('[data-testid="subscriptions-table"]') as VueWrapper
    const subscriptionRows = subscriptionsTable.findAll('tr.el-table__row')

    expect(subscriptionRows).toHaveLength(1)
  })

  it("should emit 'consult' event when the 'consult' button is clicked", async () => {
    const subscriptionToolbox = wrapper.findComponent('[data-testid=subscription-actions-toolbox]') as VueWrapper
    subscriptionToolbox.vm.$emit('p-toolbox-item-clicked', 'consult')

    await flushPromises()

    expect(wrapper.emitted('consult')).toBeTruthy()
  })

  it("should send a request to validate the demand when the 'Validate' button is clicked", async () => {
    const spyTrackAmplitude = vi.spyOn(AmplitudeService, 'track')
    const spyDisplayNotification = vi.spyOn(styleguide, 'displayNotification').mockImplementation(() => { })

    wrapper = mount(SubscriptionsTable)
    await flushPromises()

    wrapper.vm.onClickToolboxItem('validate', { subscriptionId, offer, status })
    await flushPromises()

    expect(mockValidateSubscriptionRequest).toHaveBeenCalledOnce()
    expect(spyTrackAmplitude).toHaveBeenCalledTimes(2)
    expect(spyTrackAmplitude).toHaveBeenNthCalledWith(1, 'Subscription Completed', {
      subscription_complete_offer_name: offer.offerCode,
      subscription_complete_localisation: 'MOD screen',
      subscription_complete_result: 'succeeded',
      subscription_complete_plan: 'MEG Premium',
      subscription_complete_statut: 'To validate',
    })
    expect(spyTrackAmplitude).toHaveBeenNthCalledWith(2, 'Onboarding Started', {
      onboarding_start_localisation: 'MOD screen',
      onboarding_start_result: 'succeeded',
    })
    expect(spyDisplayNotification).toHaveBeenCalledOnce()
  })

  it('should track the amplitude event and display an error notification if the demand validation fails', async () => {
    mockValidateSubscriptionRequest.mockRejectedValue('API Error: 503 Service Unavailable')
    const spyTrackAmplitude = vi.spyOn(AmplitudeService, 'track')
    const spyDisplayNotification = vi.spyOn(styleguide, 'displayNotification').mockImplementation(() => { })

    wrapper = mount(SubscriptionsTable)
    await flushPromises()

    wrapper.vm.onClickToolboxItem('validate', { subscriptionId, offer, status })
    await flushPromises()

    expect(spyTrackAmplitude).toHaveBeenCalledTimes(2)
    expect(spyTrackAmplitude).toHaveBeenNthCalledWith(1, 'Subscription Completed', {
      subscription_complete_offer_name: offer.offerCode,
      subscription_complete_localisation: 'MOD screen',
      subscription_complete_result: 'failed',
      subscription_complete_plan: 'MEG Premium',
      subscription_complete_statut: 'To validate',
    })
    expect(spyTrackAmplitude).toHaveBeenNthCalledWith(2, 'Onboarding Started', {
      onboarding_start_localisation: 'MOD screen',
      onboarding_start_result: 'failed',
    })
    expect(spyDisplayNotification).toHaveBeenCalledOnce()
  })
})
