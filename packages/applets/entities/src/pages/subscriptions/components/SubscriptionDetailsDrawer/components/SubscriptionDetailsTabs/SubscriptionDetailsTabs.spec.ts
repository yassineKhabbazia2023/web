import { describe, expect, it, beforeEach, vi } from 'vitest'
import { shallowMount, type VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import { getMockedSubscriptionDetails } from '@entities/pages/subscriptions/mocks/SubscriptionDetailsMock'
import SubscriptionDetailsTabs from '.'

const mockedSubscriptionOfferDetails = getMockedSubscriptionDetails()

vi.mock('@pulse/common', () => ({
  getInitials: vi.fn(),
}))

const createWrapper = (): VueWrapper<any> => {
  return shallowMount(SubscriptionDetailsTabs, {
    props: {
      subscriptionDetails: mockedSubscriptionOfferDetails,
    },
    global: {
      stubs: {
        PTabs: {
          name: 'PTabs',
          template: '<div><slot /></div>',
        },
      },
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
      const CustomersDetails = wrapper.findComponent({ name: 'CustomersDetails' })
      expect(CustomersDetails.exists()).toBeTruthy()
      expect(ServicesDetails.exists()).toBeFalsy()
      wrapper.vm.activeTab = 'collaborators'
      await nextTick()
      const CollaboratorsDetails = wrapper.findComponent({ name: 'CollaboratorsDetails' })
      expect(CollaboratorsDetails.exists()).toBeTruthy()
      expect(CustomersDetails.exists()).toBeFalsy()
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
