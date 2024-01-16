import type { SelectedProduct } from './OffersDrawerTypes'
import type {
  SubscriptionOfferServices
} from '../SubscriptionOffers/SubscriptionOffersTypes'
import type { PostSubscriptionRequest } from '@/pages/subscriptions/SubscriptionsTypes'
import type { User } from '../PrincipalContact/PrincipalContactTypes'

export function getSelectedProductIndex(selectedProducts: SelectedProduct[], offerId: number, productId: string) {
  return selectedProducts
    .findIndex(selectedProduct => selectedProduct.offerId === offerId && selectedProduct.productId === productId)
}

export function addSelectedProduct(selectedProducts: SelectedProduct[], offerId: number, productId: string) {
  const index = getSelectedProductIndex(selectedProducts, offerId, productId)

  if (index < 0) {
    selectedProducts.push({
      offerId,
      productId
    })
  }
}

export function removeSelectedProduct(selectedProducts: SelectedProduct[], offerId: number, productId: string) {
  const index = getSelectedProductIndex(selectedProducts, offerId, productId)

  if (index < 0) {
    return
  }
  const isMandatory = selectedProducts.at(index)?.isMandatory
  if (isMandatory) {
    return
  }
  selectedProducts.splice(index, 1)
}

export function getInitialSelectedProducts(offer: SubscriptionOfferServices | undefined) {
  const { offerId, providers } = offer ?? {}
  const selectedProducts: SelectedProduct[] = []

  providers?.forEach(({ products }) => {
    products.forEach((product) => {
      const { productId, priceType, isOptionnal } = product

      if (!isOptionnal || priceType === 'free') {
        selectedProducts.push({
          isMandatory: !isOptionnal,
          productId,
          offerId: offerId ?? 0
        })
      }
    })
  })

  return selectedProducts
}

export function getPostSubscriptionRequest(
  accountNumber: string,
  userEmail: string | undefined,
  principalContact: User | undefined,
  currentSubscriptionOffer: SubscriptionOfferServices | undefined,
  selectedProducts: SelectedProduct[]
): PostSubscriptionRequest | undefined {
  if (currentSubscriptionOffer === undefined) {
    return
  }
  const { globalOfferId, approvalRequired } = currentSubscriptionOffer
  const principalContactEmail = principalContact?.email ?? ''
  const products = selectedProducts.map(({ productId }) => productId)

  return {
    account: {
      accountNumber
    },
    globalOfferId,
    products,
    applicant: userEmail ?? '',
    users: [principalContactEmail],
    collaborators: [],
    notes: [],
    approvalRequired
  }
}
