import { describe, it, expect } from 'vitest'
import OfferProviderProducts from '.'
import { mount } from '@vue/test-utils'
import {
  getMockedSubscriptionOffersServices
} from '@/pages/entities/components/OfferSubscription/OfferSubscriptionMocks'

describe('offerProviderProducts', () => {
  describe('props', () => {
    it('should display offer provider with services', async () => {
      const offerProvider = getMockedSubscriptionOffersServices()
        .at(0)
        ?.providers?.at(0)
      const wrapper = await mount(OfferProviderProducts, {
        props: {
          offerProvider
        }
      })
      const offerServicesCard = wrapper.find('[data-ut="offer-services"]')
      const offerProviderName = wrapper.find('.p-offer-services-card__title')
      const offerFirstService = wrapper.find(
        '.p-offer-services-card__service-name'
      )
      const offerFirstServiceSwitch = wrapper.find(
        '.p-offer-services-card__service-switch'
      )

      expect(offerServicesCard.exists()).toBeTruthy()
      expect(offerFirstServiceSwitch.classes()).includes('is-disabled')
      expect(offerFirstServiceSwitch.classes()).includes('is-checked')
      expect(offerProviderName.text()).toContain(offerProvider?.providerName)
      expect(offerFirstService.text()).toBe(
        offerProvider?.products[0].productLabel
      )
    })
  })
})
