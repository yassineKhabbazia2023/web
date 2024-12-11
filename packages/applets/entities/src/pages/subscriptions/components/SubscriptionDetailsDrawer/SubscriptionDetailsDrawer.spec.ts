import { it, expect, describe, vi, type MockInstance } from 'vitest'
import { type VueWrapper, flushPromises, mount } from '@vue/test-utils'
import type { SubscriptionAccount } from '@entities/services/subscription'
import * as SubscriptionService from '@entities/services/subscription/subscriptionService'
import { getMockedSubscriptionDetails } from '../../mocks/SubscriptionDetailsMock'
import SubscriptionDetailsDrawer from '.'

const mockedSubscriptionDetails = getMockedSubscriptionDetails()

const loggerDebugSpy = vi.hoisted(() => vi.fn())
const loggerWarnSpy = vi.hoisted(() => vi.fn())
const loggerErrorSpy = vi.hoisted(() => vi.fn())

vi.mock('@pulse/core', () => ({
  logger: {
    debug: loggerDebugSpy,
    warn: loggerWarnSpy,
    error: loggerErrorSpy,
  },
}))

vi.mock('@pulse/common', () => ({
  getInitials: vi.fn(),
}))

vi.mock('@entities/services/subscription/subscriptionService', () => ({
  fetchSubscriptionDetails: vi.fn(() =>
    Promise.resolve(mockedSubscriptionDetails),
  ),
}))

const subscriptionAccountTest: SubscriptionAccount =
  mockedSubscriptionDetails.account

async function getWrapper(isOpened: boolean) {
  const wrapper: VueWrapper<any> = mount(SubscriptionDetailsDrawer, {
    props: {
      modelValue: isOpened,
      selectedSubscriptionId: mockedSubscriptionDetails.subscriptionId,
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
    it('should close the subscription drawer when the close button is clicked', async () => {
      const wrapper = await getWrapper(true)

      expect(wrapper.props('modelValue')).toBeTruthy()

      await wrapper.find('.p-drawer__close-button').trigger('click')

      expect(wrapper.emitted('update:modelValue')).toStrictEqual([[false]])
    })
    it('should correctly render the title of the subscription drawer', async () => {
      const wrapper = await getWrapper(true)
      const subscriptionDrawer = wrapper.findComponent({ name: 'PDrawer' })

      expect(subscriptionDrawer.props('pTitle')).toBe(
        `${subscriptionAccountTest.accountLegalName} - No. ${subscriptionAccountTest.accountNumber}`,
      )
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

      expect(wrapper.vm.subscriptionDrawerTitle).toBe('')
    })
  })
})
