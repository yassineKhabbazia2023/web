import { it, expect, describe, vi } from 'vitest'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { loggerErrorSpy, loggerMock } from '@pulse/core/mocks'
import type { SubscriptionAccount } from '@entities/services/subscription/subscriptionTypes'
import * as SubscriptionService from '@entities/services/subscription/subscriptionService'
import { getMockedSubscriptionDetails } from '@entities/__mocks__/subscription.mocks'
import SubscriptionDetailsDrawer from '.'
import { getSubscriptionOffersServiceMock } from '@entities/__mocks__/offer-subscription.mocks'

const mockedSubscriptionDetails = getMockedSubscriptionDetails()

vi.mock('@pulse/core', () => ({ logger: loggerMock }))

vi.mock('@pulse/common', () => ({
  getInitials: vi.fn(),
}))

const getOfferMock = vi.hoisted(() => vi.fn())
vi.mock('@entities/services/offer', () => ({
  getOffer: getOfferMock,
}))

vi.mock('@entities/services/subscription/subscriptionService', () => ({
  fetchSubscriptionDetails: vi.fn(() =>
    Promise.resolve(mockedSubscriptionDetails),
  ),
}))

const subscriptionAccountTest: SubscriptionAccount =
  mockedSubscriptionDetails.account

async function getWrapper(isOpened: boolean) {
  const wrapper = shallowMount(SubscriptionDetailsDrawer, {
    props: {
      modelValue: isOpened,
      selectedSubscriptionId: mockedSubscriptionDetails.subscriptionId,
    },
    global: {
      stubs: {
        PDrawer: {
          name: 'PDrawer',
          template: '<div><slot /></div>',
          props: ['pTitle'],
          events: ['close-drawer-button'],
        },
      },
    },
  })
  await flushPromises()

  return wrapper
}

describe('subscriptionDetailsDrawer', () => {
  describe('display', () => {
    it('should correctly display the subscription drawer with tabs', async () => {
      const wrapper = await getWrapper(true)
      const subscriptionDrawerTabs = wrapper.find(
        '[data-testid=subscription-recap-drawer-tabs]',
      )

      expect(subscriptionDrawerTabs.exists()).toBeTruthy()
    })

    it('should load currentSubscriptionOffer properly', async () => {
      const subscriptionOffersServiceMock = getSubscriptionOffersServiceMock()
      getOfferMock.mockResolvedValue(subscriptionOffersServiceMock)

      const wrapper = await getWrapper(true)
      const subscriptionDrawerTabs = wrapper.findComponent({ name: 'SubscriptionDetailsTabs' })

      expect(subscriptionDrawerTabs.props('currentSubscriptionOffer')).toStrictEqual(subscriptionOffersServiceMock)
    })

    it('should close the subscription drawer when the close button is clicked', async () => {
      const wrapper = await getWrapper(true)

      expect(wrapper.props('modelValue')).toBeTruthy()
      const subscriptionDrawer = wrapper.findComponent({ name: 'PDrawer' })

      await subscriptionDrawer.vm.$emit('close-drawer-button')

      expect(wrapper.emitted('update:modelValue')).toStrictEqual([[false]])
    })

    it('should correctly render the title of the subscription drawer', async () => {
      const wrapper = await getWrapper(true)
      const subscriptionDrawer = wrapper.findComponent({ name: 'PDrawer' })
      const expectedTitle = `${subscriptionAccountTest.accountLegalName} - No. ${subscriptionAccountTest.accountNumber}`

      expect(subscriptionDrawer.props('pTitle')).toBe(expectedTitle)
    })

    it('should display logger.error when API call is rejected', async () => {
      const errorMessage = 'Fetch API ERROR'
      vi.spyOn(
        SubscriptionService,
        'fetchSubscriptionDetails',
      ).mockRejectedValueOnce(errorMessage)

      await getWrapper(true)

      expect(loggerErrorSpy).toHaveBeenCalledOnce()
      expect(loggerErrorSpy).toHaveBeenNthCalledWith(1,
        'Unable to retrieve subscription summary :',
        errorMessage,
      )
    })

    it('should the drawer title be empty if the API call returns undefined', async () => {
      vi.spyOn(
        SubscriptionService,
        'fetchSubscriptionDetails',
      ).mockResolvedValue(undefined)
      const wrapper = await getWrapper(true)
      const subscriptionDrawer = wrapper.findComponent({ name: 'PDrawer' })
      const expectedTitle = ''

      expect(subscriptionDrawer.props('pTitle')).toBe(expectedTitle)
    })
  })
})
