import { describe, expect, it, beforeEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { getMockedSubscriptionDetails } from '@/pages/subscriptions/mocks/SubscriptionDetailsMock'
import CustomersDetails from '.'
import type { ClientContact } from '@/pages/entities/components/PrincipalContact/PrincipalContactTypes'

const mockedSubscriptionCustomers = getMockedSubscriptionDetails().clients
const createWrapper = (
  principalContacts: ClientContact[] = mockedSubscriptionCustomers,
) => {
  return mount(CustomersDetails, {
    props: {
      principalContacts,
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
    it('should display a danger alert when principalContacts array is empty', () => {
      wrapper = createWrapper([])
      const noSignatoryAlert = wrapper.findComponent({
        name: 'PAlert',
      })

      expect(noSignatoryAlert.exists()).toBeTruthy()
    })
  })
})
