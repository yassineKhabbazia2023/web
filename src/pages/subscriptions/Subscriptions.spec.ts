import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import { subscriptionRequestMock } from './mocks/SubscriptionRequestMock'
import Subscriptions from './'

const subscriptionGetMock = vi.fn().mockResolvedValue({
  data: subscriptionRequestMock,
})
const subscriptionPutMock = vi.fn(() => Promise.resolve())

vi.mock('@kpmg/common', () => ({
  commonApi: () => ({
    offer: {
      get: subscriptionGetMock,
      put: subscriptionPutMock,
    },
  }),
  commonStore: () => ({
    user: {
      email: 'test@test.com',
    },
  }),
}))

describe('subscriptions', () => {
  let wrapper: VueWrapper
  beforeEach(async () => {
    wrapper = mount(Subscriptions)
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
    expect(subscriptionDrawer.props('selectedSubscriptionId')).toMatchObject(
      mockedSubscription.subscriptionId,
    )
    expect(subscriptionDrawer.exists()).toBeTruthy()
  })
  it('call TSubscriptions component', () => {
    const subscriptionsTableComponent = wrapper.findComponent({
      name: 'SubscriptionsTable',
    })
    expect(subscriptionsTableComponent.exists()).toBeTruthy()
  })
})
