import { describe, it, expect, vi, beforeEach } from 'vitest'
import { VueWrapper, flushPromises, mount } from '@vue/test-utils'
import { subscriptionRequestMock } from './mocks/SubscriptionRequestMock'
import Subscriptions from './'

const subscriptionGetMock = vi.fn().mockResolvedValue({
  data: subscriptionRequestMock
})
const subscriptionPutMock = vi.fn(() => Promise.resolve())

vi.mock('@kpmg/common', async () => ({
  commonApi: () => ({
    offer: {
      get: subscriptionGetMock,
      put: subscriptionPutMock
    }
  })
}))

describe('subscriptions', () => {
  let wrapper: VueWrapper
  beforeEach(async () => {
    wrapper = mount(Subscriptions)
    await flushPromises()
  })
  it("should open the subscription drawer when clicked on 'consult'", async () => {
    const subscriptionAccountTest = subscriptionRequestMock[0].account
    const subscriptionTable = wrapper.findComponent({
      name: 'SubscriptionsTable'
    })

    await subscriptionTable.vm.$emit('consult', subscriptionAccountTest)
    await flushPromises()

    const subscriptionDrawer = wrapper.findComponent({
      name: 'SubscriptionDetailsDrawer'
    })

    expect(subscriptionDrawer.props('modelValue')).toBeTruthy()
    expect(subscriptionDrawer.props('account')).toMatchObject(
      subscriptionAccountTest
    )
    expect(subscriptionDrawer.exists()).toBeTruthy()
  })
  it('call TSubscriptions component', () => {
    const subscriptionsTableComponent = wrapper.findComponent({
      name: 'SubscriptionsTable'
    })
    expect(subscriptionsTableComponent.exists()).toBeTruthy()
  })
})
