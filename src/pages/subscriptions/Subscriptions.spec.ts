import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import { subscriptionRequestMock } from './mocks/SubscriptionRequestMock'
import Subscriptions from './'

const subscriptionGetMock = vi.fn().mockResolvedValue({
  data: subscriptionRequestMock
})
const subscriptionPutMock = vi.fn().mockResolvedValue(null)

vi.mock('@kpmg/common', async () => ({
  commonApi: () => ({
    subscription: {
      get: subscriptionGetMock,
      put: subscriptionPutMock
    }
  })
}))

describe('subscriptions', () => {
  it('renders the correct title', () => {
    const wrapper = mount(Subscriptions)

    const titleElement = wrapper.find('h1')
    expect(titleElement.text()).toBe('Offer activation request to be validated')
  })

  it('call TSubscriptions component', () => {
    const wrapper = mount(Subscriptions)
    const subscriptionsTableComponent = wrapper.findComponent({ name: 'SubscriptionsTable' })
    expect(subscriptionsTableComponent.exists()).toBeTruthy()
  })
})
