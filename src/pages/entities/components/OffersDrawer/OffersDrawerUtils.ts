import type { SelectedProduct } from './OffersDrawerTypes'
import { SubscriptionPriceType } from '@/pages/entities/components/SubscriptionOffers/SubscriptionOffersEnums'
import type { SubscriptionOfferServices } from '../SubscriptionOffers/SubscriptionOffersTypes'
import type { PostSubscriptionRequest } from '@/pages/subscriptions/SubscriptionsTypes'

export function getSelectedProductIndex(
  selectedProducts: SelectedProduct[],
  offerId: number,
  productConfigurationId: number
) {
  return selectedProducts.findIndex(
    (selectedProduct) =>
      selectedProduct.offerId === offerId &&
      selectedProduct.productConfigurationId === productConfigurationId
  )
}

export function addSelectedProduct(
  selectedProducts: SelectedProduct[],
  offerId: number,
  productConfigurationId: number
) {
  const index = getSelectedProductIndex(
    selectedProducts,
    offerId,
    productConfigurationId
  )

  if (index < 0) {
    selectedProducts.push({
      offerId,
      productConfigurationId
    })
  }
}

export function removeSelectedProduct(
  selectedProducts: SelectedProduct[],
  offerId: number,
  productConfigurationId: number
) {
  const index = getSelectedProductIndex(
    selectedProducts,
    offerId,
    productConfigurationId
  )

  if (index < 0) {
    return
  }
  const isMandatory = selectedProducts.at(index)?.isMandatory
  if (isMandatory) {
    return
  }
  selectedProducts.splice(index, 1)
}

export function getInitialSelectedProducts(
  offer: SubscriptionOfferServices | undefined
) {
  const { offerId, providers } = offer ?? {}
  const selectedProducts: SelectedProduct[] = []

  providers?.forEach(({ products }) => {
    products.forEach((product) => {
      const { productConfigurationId, priceType, isOptionnal } = product

      if (!isOptionnal || priceType === SubscriptionPriceType.free) {
        selectedProducts.push({
          isMandatory: !isOptionnal,
          productConfigurationId,
          offerId: offerId ?? 0
        })
      }
    })
  })

  return selectedProducts
}

export function getPostSubscriptionRequest(
  accountId: number,
  userEmail: string | undefined,
  principalContact: number,
  currentSubscriptionOffer: SubscriptionOfferServices | undefined,
  selectedProducts: SelectedProduct[]
): PostSubscriptionRequest | undefined {
  if (currentSubscriptionOffer === undefined) {
    return
  }
  const { offerId } = currentSubscriptionOffer
  const products = selectedProducts.map(
    ({ productConfigurationId }) => productConfigurationId
  )

  return {
    accountId,
    offerId,
    products,
    contacts: [principalContact],
    applicant: userEmail ?? '',
    notes: []
  }
}
