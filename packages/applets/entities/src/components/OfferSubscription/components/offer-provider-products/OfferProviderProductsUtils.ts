import type { PTagProps, PService } from '@pulse/styleguide/types'

import type { SelectedProduct, SubscriptionOfferProduct } from '@entities/types'
import { SubscriptionPriceType } from '@entities/enums'
import { getSelectedProductIndex } from '@entities/components/OffersDrawer/utils/OffersDrawerUtils'

export function getIsServiceSelected(
  offerId: number,
  offerProduct: SubscriptionOfferProduct,
  selectedProducts: SelectedProduct[],
) {
  const { productConfigurationId } = offerProduct

  const index = getSelectedProductIndex(
    selectedProducts,
    offerId,
    productConfigurationId,
  )

  return index >= 0
}

export function getServiceTag(
  isOptionnal: boolean,
  priceType: SubscriptionOfferProduct['priceType'],
  includedLabel: string,
  additionalPriceLabel: string,
): PTagProps | undefined {
  if (!isOptionnal) {
    return {
      pColor: 'gray',
      pContent: includedLabel,
    }
  }
  if (priceType === SubscriptionPriceType.exact) {
    return {
      pColor: 'tranquil',
      pContent: additionalPriceLabel,
    }
  }
}

export function getProviderServices(
  offerId: number,
  products: SubscriptionOfferProduct[],
  selectedProducts: SelectedProduct[],
  includedLabel: string,
  additionalPriceLabel: string,
  isRecap: boolean | undefined,
) {
  return products
    .filter((offerProduct) => offerProduct.enabled)
    .map<PService>((offerProduct) => {
      const { isOptionnal, productLabel, productConfigurationId, priceType } =
        offerProduct

      const isMandatory = !isOptionnal
      const pStatus = getIsServiceSelected(
        offerId,
        offerProduct,
        selectedProducts,
      )
      const pTag = getServiceTag(
        isOptionnal,
        priceType,
        includedLabel,
        additionalPriceLabel,
      )

      return {
        pStatus,
        pDisabled: isRecap ? true : isMandatory,
        pName: productLabel,
        pTag,
        productConfigurationId,
      }
    })
}

export function getTitle(
  ProviderCategoryTitles: Record<string, string>,
  category: string,
  providerName: string,
) {
  const productCategoryTitle = ProviderCategoryTitles[category]

  return productCategoryTitle
    ? `${productCategoryTitle} ${providerName}`
    : providerName
}
