import { describe, it, expect, beforeEach } from 'vitest'
import { flushPromises, shallowMount, type VueWrapper } from '@vue/test-utils'
import { subscriptionRequestMock } from '@entities/__mocks__/subscription.mocks'
import { nextTick } from 'vue'
import Subscriptions from '.'

describe('subscriptions', () => {
  let wrapper: VueWrapper
  beforeEach(async () => {
    wrapper = shallowMount(Subscriptions)
    await flushPromises()
  })
  it("should open the subscription drawer when clicked on 'consult'", async () => {
    const mockedSubscription = subscriptionRequestMock[0]
    const subscriptionTable = wrapper.findComponent({
      name: 'SubscriptionsTable',
    })

    await subscriptionTable.vm.$emit('consult', mockedSubscription.subscriptionId)
    await flushPromises()

    const subscriptionDrawer = wrapper.findComponent({
      name: 'SubscriptionDetailsDrawer',
    })

    expect(subscriptionDrawer.props('modelValue')).toBeTruthy()
    expect(subscriptionDrawer.props('selectedSubscriptionId')).toBe(mockedSubscription.subscriptionId)
    expect(subscriptionDrawer.exists()).toBeTruthy()
  })
  it('call TSubscriptions component', () => {
    const subscriptionsTableComponent = wrapper.findComponent({
      name: 'SubscriptionsTable',
    })
    expect(subscriptionsTableComponent.exists()).toBeTruthy()
  })
  it("should emit the 'update:modelValue' event when the v-model is updated", async () => {
    const mockedSubscription = subscriptionRequestMock[0]
    const subscriptionTable = wrapper.findComponent({
      name: 'SubscriptionsTable',
    })

    await subscriptionTable.vm.$emit('consult', mockedSubscription.subscriptionId)
    await flushPromises()
    const subscriptionDetailsDrawer = wrapper.findComponent({ name: 'SubscriptionDetailsDrawer' })
    subscriptionDetailsDrawer.vm.$emit('update:modelValue', false)
    await nextTick()

    expect(subscriptionDetailsDrawer.emitted('update:modelValue')).toStrictEqual([[false]])
  })
})
