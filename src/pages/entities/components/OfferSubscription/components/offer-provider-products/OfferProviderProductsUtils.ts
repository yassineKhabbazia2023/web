import { type PService } from '@kpmg/styleguide'
import type { SelectedProduct } from '@/pages/entities/components/OffersDrawer/OffersDrawerTypes'
import {
  SubscriptionPriceType
} from '@/pages/entities/components/SubscriptionOffers/SubscriptionOffersEnums'
import type {
  SubscriptionOfferProduct
} from '@/pages/entities/components/SubscriptionOffers/SubscriptionOffersTypes'
import { getSelectedProductIndex } from '../../../OffersDrawer/OffersDrawerUtils'

export function getIsServiceSelected(
  offerId: number,
  offerProduct: SubscriptionOfferProduct,
  selectedProducts: SelectedProduct[]
) {
  const { globalProductId } = offerProduct

  const index = getSelectedProductIndex(selectedProducts, offerId, globalProductId)

  return index >= 0
}

export function getServiceTag(
  isOptionnal: boolean,
  priceType: SubscriptionOfferProduct['priceType'],
  includedLabel: string,
  additionalPriceLabel: string
) {
  const pEffect = 'light'

  if (!isOptionnal) {
    return {
      pColor: 'gray-900',
      pEffect,
      pContent: includedLabel
    }
  }
  if (priceType === SubscriptionPriceType.exact) {
    return {
      pColor: 'amethyste',
      pEffect,
      pContent: additionalPriceLabel
    }
  }
}

export function getProviderServices(
  offerId: number,
  products: SubscriptionOfferProduct[],
  selectedProducts: SelectedProduct[],
  includedLabel: string,
  additionalPriceLabel: string
) {
  return products
    .map<PService>((offerProduct) => {
      const { isOptionnal, productLabel, globalProductId, priceType } = offerProduct

      const pStatus = getIsServiceSelected(offerId, offerProduct, selectedProducts)
      const pTag = getServiceTag(isOptionnal, priceType, includedLabel, additionalPriceLabel)

      return {
        pStatus,
        pDisabled: !isOptionnal,
        pName: productLabel,
        pTag,
        globalProductId
      }
    })
}

export function getTitle(
  ProviderCategoryTitles: Record<string, string>,
  category: string,
  providerName: string
) {
  const productCategoryTitle = ProviderCategoryTitles[category]

  return productCategoryTitle
    ? `${productCategoryTitle} ${providerName}`
    : providerName
}
