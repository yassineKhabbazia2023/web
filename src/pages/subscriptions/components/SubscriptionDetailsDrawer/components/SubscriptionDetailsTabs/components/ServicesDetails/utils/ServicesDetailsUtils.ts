import type { SelectedProduct } from '@/common/types'
import type { SubscriptionOfferServices } from '@/pages/entities/components/SubscriptionOffers/SubscriptionOffersTypes'

export const getSubscriptionProducts = (offer: SubscriptionOfferServices) => {
  const { offerId, providers } = offer
  const selectedProducts: SelectedProduct[] = []

  providers?.forEach(({ products }) => {
    products.forEach((product) => {
      const { productConfigurationId, isSelected } = product

      if (isSelected) {
        selectedProducts.push({
          isMandatory: true,
          productConfigurationId,
          offerId,
        })
      }
    })
  })

  return selectedProducts
}
