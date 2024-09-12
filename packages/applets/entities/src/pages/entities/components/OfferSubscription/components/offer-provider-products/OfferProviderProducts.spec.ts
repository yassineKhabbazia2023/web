import { beforeEach, describe, it, expect, vi } from 'vitest'
import { type VueWrapper, mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import {
  getMockedSubscriptionOffersServices,
} from '@entities/pages/entities/components/OfferSubscription/OfferSubscriptionMocks'
import type {
  SubscriptionOfferProvider,
} from '@entities/pages/entities/components/SubscriptionOffers/SubscriptionOffersTypes'
import * as OfferProviderProductsUtils from './OfferProviderProductsUtils'
import type { ExtendedService } from './OfferProviderProductsTypes'
import OfferProviderProducts from '.'

const offerId = 101
const offerProviderServices = getMockedSubscriptionOffersServices()
const offerProviderService = offerProviderServices?.at(0)
const offerProvider = offerProviderService?.providers?.at(0) as SubscriptionOfferProvider
const productConfigurationId = offerProvider.products.at(0)?.productConfigurationId ?? 1

function getMockedService(pStatus: boolean): ExtendedService {
  return {
    productConfigurationId: 1,
    pStatus,
    pDisabled: false,
    pName: 'Service name',
  }
}

const createWrapper = () => {
  return mount(OfferProviderProducts, {
    props: {
      offerProvider,
      offerId,
      selectedProducts: [{
        offerId,
        productConfigurationId,
      }],
    },
  })
}

function getOfferServicesCard(wrapper: VueWrapper) {
  return wrapper.findComponent('[data-testid="offer-services"]') as VueWrapper
}

describe('offerProviderProducts', () => {
  let wrapper: VueWrapper
  let offerServicesCard: VueWrapper
  beforeEach(() => {
    wrapper = createWrapper()
    offerServicesCard = getOfferServicesCard(wrapper)
  })
  describe('props', () => {
    it('should display offer provider with services', () => {
      const offerProviderName = wrapper.find('.p-offer-services-card__title')
      const offerFirstService = wrapper.find(
        '.p-offer-services-card__service-name',
      )
      const offerFirstServiceSwitch = wrapper.find(
        '.p-offer-services-card__service-switch',
      )

      expect(offerServicesCard.exists()).toBeTruthy()
      expect(offerFirstServiceSwitch.classes()).includes('is-disabled')
      expect(offerFirstServiceSwitch.classes()).includes('is-checked')
      expect(offerProviderName.text()).toContain(offerProvider?.providerName)
      expect(offerFirstService.text()).toBe(
        offerProvider?.products[0].productLabel,
      )
    })
    it('should not display offer cards if the API returns an empty array', () => {
      vi.spyOn(OfferProviderProductsUtils, 'getProviderServices').mockReturnValue([])
      wrapper = createWrapper()
      const offerProviderProductsWrapper = wrapper.find('[data-testid=offer-provider-products-wrapper]')

      expect(offerProviderProductsWrapper.exists()).toBeFalsy()
    })
  })
  describe('interactions', () => {
    it('should emit "select-product" when user selects a product', async () => {
      const isSelected = true
      const pExtendedService = getMockedService(isSelected)
      const { productConfigurationId } = pExtendedService

      offerServicesCard.vm.$emit('changeServiceStatus', pExtendedService)
      await nextTick()

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
