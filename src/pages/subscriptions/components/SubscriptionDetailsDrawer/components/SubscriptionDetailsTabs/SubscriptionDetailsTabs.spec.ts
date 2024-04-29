import { describe, expect, it, beforeEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import { getMockedSubscriptionDetails } from '@/pages/subscriptions/mocks/SubscriptionDetailsMock'
import SubscriptionDetailsTabs from '.'

const mockedSubscriptionOfferDetails = getMockedSubscriptionDetails()

const createWrapper = (): VueWrapper<any> => {
  return mount(SubscriptionDetailsTabs, {
    props: {
      subscriptionDetails: mockedSubscriptionOfferDetails,
    },
  })
}

describe('subscriptionDetailsTabs', () => {
  let wrapper: VueWrapper<any>
  beforeEach(() => {
    wrapper = createWrapper()
  })
  describe('display', () => {
    it('should correctly display the list of tabs with the default tab active', () => {
      const expectedActiveTab = 'services'
      const tabsWrapper = wrapper.findComponent({ name: 'PTabs' })
      const ServicesDetails = wrapper.findComponent({ name: 'ServicesDetails' })

      expect(tabsWrapper.exists()).toBeTruthy()
      expect(ServicesDetails.exists()).toBeTruthy()
      expect(wrapper.vm.activeTab).toBe(expectedActiveTab)
    })
    it('should display the correct tab when the user changes it', async () => {
      wrapper.vm.activeTab = 'customerUsers'
      await nextTick()
      const ServicesDetails = wrapper.findComponent({ name: 'ServicesDetails' })

      expect(ServicesDetails.exists()).toBeFalsy()
    })
  })
  describe('props', () => {
    it('should properly pass the appropriate props to display the note', () => {
      const servicesNote = wrapper.findComponent({ name: 'StepNote' })

      expect(servicesNote.props()).toStrictEqual({
        disabled: true,
        modelValue: mockedSubscriptionOfferDetails.notes[0],
      })
      expect(servicesNote.props('modelValue')).toStrictEqual(
        mockedSubscriptionOfferDetails.notes[0],
      )
    })
  })
})
