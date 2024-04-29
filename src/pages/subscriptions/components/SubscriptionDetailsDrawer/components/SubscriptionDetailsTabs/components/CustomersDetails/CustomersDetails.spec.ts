import { describe, expect, it, beforeEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { getMockedSubscriptionDetails } from '@/pages/subscriptions/mocks/SubscriptionDetailsMock'
import CustomersDetails from '.'

const mockedSubscriptionClients = getMockedSubscriptionDetails().clients
const createWrapper = () => {
  return mount(CustomersDetails, {
    props: {
      principalContacts: mockedSubscriptionClients,
    },
  })
}

describe('customersDetails', () => {
  let wrapper: VueWrapper<any>
  beforeEach(() => {
    wrapper = createWrapper()
  })
  describe('display', () => {
    it('should display correctly the exact clients', () => {
      const customersCards = wrapper.findAllComponents({
        name: 'PrincipalContact',
      })

      expect(customersCards).toHaveLength(mockedSubscriptionClients.length)
    })
  })
})
