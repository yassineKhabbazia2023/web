import { beforeEach, describe, it, expect } from 'vitest'
import OfferProviderProducts from '.'
import { type VueWrapper, mount } from '@vue/test-utils'
import {
  getMockedSubscriptionOffersServices
} from '@/pages/entities/components/OfferSubscription/OfferSubscriptionMocks'
import type {
  SubscriptionOfferProvider
} from '@/pages/entities/components/SubscriptionOffers/SubscriptionOffersTypes'
import type { ExtendedService } from './OfferProviderProductsTypes'

const offerProviderServices = getMockedSubscriptionOffersServices()
const offerProviderService = offerProviderServices?.at(0)
const offerProvider = offerProviderService?.providers?.at(0) as SubscriptionOfferProvider
const productConfigurationId = offerProvider.products.at(0)?.productConfigurationId ?? 1
const offerId = 101

function getMockedService(pStatus: boolean): ExtendedService {
  return {
    productConfigurationId: 1,
    pStatus,
    pDisabled: false,
    pName: 'Service name'
  }
}

function getWrapper() {
  const wrapper = mount(OfferProviderProducts, {
    props: {
      offerProvider,
      offerId,
      selectedProducts: [{
        offerId,
        productConfigurationId
      }]
    }
  })
  return wrapper
}

function getOfferServicesCard(wrapper: VueWrapper) {
  return wrapper.findComponent('[data-testid="offer-services"]') as VueWrapper
}

describe('offerProviderProducts', () => {
  let wrapper: VueWrapper
  let offerServicesCard: VueWrapper
  beforeEach(() => {
    wrapper = getWrapper()
    offerServicesCard = getOfferServicesCard(wrapper)
  })
  describe('props', () => {
    it('should display offer provider with services', () => {
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
  describe('interactions', () => {
    it('should emit "select-product" when user selects a product', async () => {
      const isSelected = true
      const pExtendedService = getMockedService(isSelected)
      const { productConfigurationId } = pExtendedService

      await offerServicesCard.vm.$emit('changeServiceStatus', pExtendedService)

      expect(wrapper.emitted('select-product')).toStrictEqual([[offerId, productConfigurationId]])
    })
    it('should emit "deselect-product" when user deselects a product', () => {
      const isSelected = false
      const pExtendedService = getMockedService(isSelected)
      const { productConfigurationId } = pExtendedService

      offerServicesCard.vm.$emit('change-service-status', pExtendedService)

      expect(wrapper.emitted('deselect-product')).toStrictEqual([[offerId, productConfigurationId]])
    })
  })
})
