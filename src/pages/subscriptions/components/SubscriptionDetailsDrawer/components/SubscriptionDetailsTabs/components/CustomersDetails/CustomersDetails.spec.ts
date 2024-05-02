import { describe, expect, it, beforeEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { getMockedSubscriptionDetails } from '@/pages/subscriptions/mocks/SubscriptionDetailsMock'
import CustomersDetails from '.'

const mockedSubscriptionCustomers = getMockedSubscriptionDetails().clients
const createWrapper = () => {
  return mount(CustomersDetails, {
    props: {
      principalContacts: mockedSubscriptionCustomers,
    },
  })
}

describe('customersDetails', () => {
  let wrapper: VueWrapper<any>
  beforeEach(() => {
    wrapper = createWrapper()
  })
  describe('display', () => {
    it('should correctly display the exact customers', () => {
      const customersCards = wrapper.findAllComponents({
        name: 'PrincipalContact',
      })

      expect(customersCards).toHaveLength(mockedSubscriptionCustomers.length)
    })
  })
})
