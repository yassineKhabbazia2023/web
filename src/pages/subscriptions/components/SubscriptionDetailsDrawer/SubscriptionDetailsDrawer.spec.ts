import { it, expect, describe } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { subscriptionRequestMock } from '../../mocks/SubscriptionRequestMock'
import type { SubscriptionAccount } from '../../SubscriptionsTypes'
import SubscriptionDetailsDrawer from '.'

const subscriptionAccountTest: SubscriptionAccount =
  subscriptionRequestMock[0].account

async function getWrapper(isOpened: boolean) {
  const wrapper = mount(SubscriptionDetailsDrawer, {
    props: {
      modelValue: isOpened,
      account: subscriptionAccountTest
    }
  })
  await flushPromises()

  return wrapper
}

describe('subscriptionDetailsDrawer', () => {
  describe('display', () => {
    it('should correctly display the subscription drawer with tabs', async () => {
      const wrapper = await getWrapper(true)
      const subscriptionDrawerTabs = wrapper.find(
        '[data-testid=subscription-drawer-tabs]'
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
      const subscriptionDrawerTitle = wrapper.find(
        '[data-testid=subscription-drawer-title]'
      )

      expect(subscriptionDrawerTitle.text()).toBe(
        `${subscriptionAccountTest.accountLabel} - Nº ${subscriptionAccountTest.accountNumber}`
      )
    })
  })
})
