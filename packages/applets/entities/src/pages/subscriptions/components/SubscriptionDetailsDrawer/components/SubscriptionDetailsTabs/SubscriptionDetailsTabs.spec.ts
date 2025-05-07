import { describe, expect, it, beforeEach, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { getMockedSubscriptionDetails } from '@entities/__mocks__/subscription.mocks'
import { getSubscriptionOffersServiceMock } from '@entities/__mocks__/offer-subscription.mocks'
import { RecapTabs } from './SubscriptionDetailsTabsTypes'
import type { SubscriptionDetailsTabsProps } from './SubscriptionDetailsTabsTypes'

import SubscriptionDetailsTabs from '.'

const mockedSubscriptionOfferDetails = getMockedSubscriptionDetails()

vi.mock('@pulse/common', () => ({
  getInitials: vi.fn(),
}))

const currentSubscriptionOfferMock = getSubscriptionOffersServiceMock()

const defaultProps: SubscriptionDetailsTabsProps = {
  subscriptionDetails: mockedSubscriptionOfferDetails,
  currentSubscriptionOffer: currentSubscriptionOfferMock,
}
function createWrapper(override: Partial<SubscriptionDetailsTabsProps> = {}) {
  const props = {
    ...defaultProps,
    ...override,
  }

  return shallowMount(SubscriptionDetailsTabs, {
    props,
    global: {
      stubs: {
        PTabs: {
          name: 'PTabs',
          template: '<div><slot /></div>',
          props: ['modelValue'],
        },
      },
    },
  })
}

describe('subscriptionDetailsTabs', () => {
  let wrapper: ReturnType<typeof createWrapper>
  beforeEach(() => {
    wrapper = createWrapper()
  })
  describe('display', () => {
    it('should correctly display the list of tabs with the default tab active', () => {
      const expectedActiveTab = RecapTabs.SERVICES
      const pTabs = wrapper.findComponent({ name: 'PTabs' })
      const ServicesDetails = wrapper.findComponent({ name: 'ServicesDetails' })

      expect(pTabs.exists()).toBeTruthy()
      expect(ServicesDetails.exists()).toBeTruthy()
      expect(pTabs.props('modelValue')).toBe(expectedActiveTab)
    })

    it('should display the correct tab when the user changes it', async () => {
      const expectedCollaboratorRoles = currentSubscriptionOfferMock.functions

      const pTabs = wrapper.findComponent({ name: 'PTabs' })
      pTabs.vm.$emit('update:modelValue', RecapTabs.CUSTOMER_USERS)
      await nextTick()

      const ServicesDetails = wrapper.findComponent({ name: 'ServicesDetails' })
      const CustomersDetails = wrapper.findComponent({ name: 'CustomersDetails' })
      expect(CustomersDetails.exists()).toBeTruthy()
      expect(ServicesDetails.exists()).toBeFalsy()

      pTabs.vm.$emit('update:modelValue', RecapTabs.COLLABORATORS)
      await nextTick()

      const CollaboratorsDetails = wrapper.findComponent({ name: 'CollaboratorsDetails' })
      expect(CollaboratorsDetails.exists()).toBeTruthy()
      expect(CustomersDetails.exists()).toBeFalsy()
      expect(CollaboratorsDetails.props('collaboratorRoles')).toStrictEqual(expectedCollaboratorRoles)
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

    it('should not display Note when trimed value is empty', () => {
      const mockedSubscriptionOfferDetailsWithoutNotes = getMockedSubscriptionDetails({
        notes: [{
          stepName: 'services',
          stepNote: '   ',
        }],
      })

      wrapper = createWrapper({
        subscriptionDetails: mockedSubscriptionOfferDetailsWithoutNotes,
      })
      const servicesNote = wrapper.findComponent({ name: 'StepNote' })

      expect(servicesNote.exists()).toBe(false)
    })
  })
})
