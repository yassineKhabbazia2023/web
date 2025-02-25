import { describe, it, expect } from 'vitest'
import { getIsServiceSelected, getServiceTag, getTitle } from './OfferProviderProductsUtils'
import {
  SubscriptionPriceType,
} from '@entities/pages/entities/components/SubscriptionOffers/SubscriptionOffersEnums'

import type { SelectedProduct } from '@entities/common/types'

import { getMockedSubscriptionOfferProduct } from '@entities/__mocks__/offer-subscription.mocks'

const ProviderCategoryTitles: Record<string, string> = {
  pulse: 'Les services de la plateforme',
}

describe('offerProviderProductsUtils', () => {
  describe('getServiceInSelected', () => {
    const offerId = 102
    const offerProduct = getMockedSubscriptionOfferProduct()

    it('should return true when service is in selectedProducts', () => {
      const expected = true
      const productConfigurationId = offerProduct.productConfigurationId
      const selectedProducts: SelectedProduct[] = [{
        offerId,
        productConfigurationId,
      }]

      const isSelected = getIsServiceSelected(offerId, offerProduct, selectedProducts)
      expect(isSelected).toBe(expected)
    })

    it('should return false when service is NOT in selectedProducts', () => {
      const expected = false
      const selectedProducts: SelectedProduct[] = [{
        offerId,
        productConfigurationId: 2,
      }]
      const isSelected = getIsServiceSelected(offerId, offerProduct, selectedProducts)

      expect(isSelected).toBe(expected)
    })
  })
  describe('getServiceTag', () => {
    const includedLabel = 'Inclus'
    const additionalPriceLabel = 'Prix additionnel'

    const tests = [{
      isOptionnal: false,
      priceType: SubscriptionPriceType.free,
      expected: {
        pColor: 'gray-900',
        pContent: 'Inclus',
        pEffect: 'light',
      },
    }, {
      isOptionnal: true,
      priceType: SubscriptionPriceType.free,
      expected: undefined,
    }, {
      isOptionnal: false,
      priceType: SubscriptionPriceType.exact,
      expected: {
        pColor: 'gray-900',
        pContent: 'Inclus',
        pEffect: 'light',
      },
    }, {
      isOptionnal: true,
      priceType: SubscriptionPriceType.exact,
      expected: {
        pColor: 'amethyste',
        pContent: 'Prix additionnel',
        pEffect: 'light',
      },
    }]
    it.each(tests)('should return $expected when isOptionnal = $isOptionnal and priceType is \'$priceType\'', ({
      isOptionnal,
      priceType,
      expected,
    }) => {
      const serviceTag = getServiceTag(
        isOptionnal,
        priceType,
        includedLabel,
        additionalPriceLabel,
      )
      expect(serviceTag).toStrictEqual(expected)
    })
  })
  describe('getTitle', () => {
    const providerName = 'provider name'
    const tests = [{
      category: 'pulse',
      expected: `Les services de la plateforme ${providerName}`,
    }, {
      category: 'foo',
      expected: providerName,
    }]
    it.each(tests)('should return $expected when category = \'$category\'', ({
      category,
      expected,
    }) => {
      const title = getTitle(
        ProviderCategoryTitles,
        category,
        providerName,
      )
      expect(title).toBe(expected)
    })
  })
})
