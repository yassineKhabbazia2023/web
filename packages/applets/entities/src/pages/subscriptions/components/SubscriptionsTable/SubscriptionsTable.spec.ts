import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { subscriptionRequestMock } from '../../mocks/SubscriptionRequestMock'
import * as helpers from '@entities/common/utils/helpers'
import { amplitudeService } from '@pulse/common'
import type { ComponentWrapper } from '@entities/common/types'
import { nextTick } from 'vue'
import SubscriptionsTable from '.'

const { subscriptionId, offer } = subscriptionRequestMock[0]
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
vi.mock('@pulse/common', () => ({
  commonStore: () => ({}),
  amplitudeService: {
    track: vi.fn(),
  },
}))

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
  0: 'Request date',
  1: 'Folder ID',
  2: 'Legal name',
  3: 'Principal Contact',
  4: 'Requester',
  5: 'Offer',
  6: 'Status',
}

describe('subscriptionsTable', () => {
  let wrapper: ComponentWrapper<InstanceType<typeof SubscriptionsTable>>
  beforeEach(async () => {
    wrapper = mount(SubscriptionsTable)
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
      '3/24/2023',
      'V900000163',
      'Test Indicators 1',
      'TTTFirsName TLastNameTLastName+test@rydge.onmicrosoft.com',
      'test-01@rydge.fr',
      'Modules MEG : facturation et caisse',
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
    wrapper.vm.handleOfferFiltered(['MEG Smart'])
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
    const spyTrackAmplitude = vi.spyOn(amplitudeService, 'track')
    const spyDisplayNotification = vi.spyOn(helpers, 'displayNotification')

    wrapper = mount(SubscriptionsTable)
    await flushPromises()

    wrapper.vm.onClickToolboxItem('validate', { subscriptionId, offer })
    await flushPromises()

    expect(mockValidateSubscriptionRequest).toHaveBeenCalledOnce()
    expect(spyTrackAmplitude).toHaveBeenCalledTimes(2)
    expect(spyTrackAmplitude).toHaveBeenNthCalledWith(1, 'Subscription Completed', {
      subscription_complete_offer_name: offer.offerCode,
      subscription_complete_localisation: 'MOD screen',
      subscription_complete_result: 'succeeded',
    })
    expect(spyTrackAmplitude).toHaveBeenNthCalledWith(2, 'Onboarding Started', {
      onboarding_start_localisation: 'MOD screen',
      onboarding_start_result: 'succeeded',
    })
    expect(spyDisplayNotification).toHaveBeenCalledOnce()
  })

  it('should track the amplitude event and display an error notification if the demand validation fails', async () => {
    mockValidateSubscriptionRequest.mockRejectedValue('API Error: 503 Service Unavailable')
    const spyTrackAmplitude = vi.spyOn(amplitudeService, 'track')
    const spyDisplayNotification = vi.spyOn(helpers, 'displayNotification')

    wrapper = mount(SubscriptionsTable)
    await flushPromises()

    wrapper.vm.onClickToolboxItem('validate', { subscriptionId, offer })
    await flushPromises()

    expect(spyTrackAmplitude).toHaveBeenCalledTimes(2)
    expect(spyTrackAmplitude).toHaveBeenNthCalledWith(1, 'Subscription Completed', {
      subscription_complete_offer_name: offer.offerCode,
      subscription_complete_localisation: 'MOD screen',
      subscription_complete_result: 'failed',
    })
    expect(spyTrackAmplitude).toHaveBeenNthCalledWith(2, 'Onboarding Started', {
      onboarding_start_localisation: 'MOD screen',
      onboarding_start_result: 'failed',
    })
    expect(spyDisplayNotification).toHaveBeenCalledOnce()
  })
})
