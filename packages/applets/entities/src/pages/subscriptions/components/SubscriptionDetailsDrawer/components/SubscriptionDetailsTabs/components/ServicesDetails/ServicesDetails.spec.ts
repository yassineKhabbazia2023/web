import { beforeEach, describe, it, expect } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { getMockedSubscriptionDetails } from '@entities/pages/subscriptions/mocks/SubscriptionDetailsMock'
import ServicesDetails from '.'

const mockedSubscriptionOfferDetails = getMockedSubscriptionDetails()

describe('servicesDetails', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    wrapper = mount(ServicesDetails, {
      props: {
        subscriptionOfferDetails: mockedSubscriptionOfferDetails.offer,
      },
    })
  })
  describe('display', () => {
    it('should correctly display the exact number of provider cards', () => {
      const providerCards = wrapper.findAll('[data-testid="provider-card"]')

      expect(providerCards).toHaveLength(
        mockedSubscriptionOfferDetails?.offer.providers.length,
      )
    })
  })
})
