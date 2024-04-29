import { SubscriptionPriceType } from '@/pages/entities/components/SubscriptionOffers/SubscriptionOffersEnums'
import type { SelectedProduct } from '@/common/types'
import type { SubscriptionOfferServices } from '../../SubscriptionOffers/SubscriptionOffersTypes'
import type { Note, PostSubscriptionRequest } from '@/services/subscription'
import type { Contact } from '@/services/contact/contactTypes'
import type { ClientContact } from '../../PrincipalContact/PrincipalContactTypes'

export function getSelectedProductIndex(
  selectedProducts: SelectedProduct[],
  offerId: number,
  productConfigurationId: number,
) {
  return selectedProducts.findIndex(
    (selectedProduct) =>
      selectedProduct.offerId === offerId &&
      selectedProduct.productConfigurationId === productConfigurationId,
  )
}

export function addSelectedProduct(
  selectedProducts: SelectedProduct[],
  offerId: number,
  productConfigurationId: number,
) {
  const index = getSelectedProductIndex(
    selectedProducts,
    offerId,
    productConfigurationId,
  )

  if (index < 0) {
    selectedProducts.push({
      offerId,
      productConfigurationId,
    })
  }
}

export function removeSelectedProduct(
  selectedProducts: SelectedProduct[],
  offerId: number,
  productConfigurationId: number,
) {
  const index = getSelectedProductIndex(
    selectedProducts,
    offerId,
    productConfigurationId,
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
  offer: SubscriptionOfferServices | undefined,
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
          offerId: offerId ?? 0,
        })
      }
    })
  })

  return selectedProducts
}

export function getPostSubscriptionRequest(
  accountId: number,
  userEmail: string | undefined,
  collaborators: Contact[],
  clients: ClientContact[] | undefined,
  currentSubscriptionOffer: SubscriptionOfferServices | undefined,
  selectedProducts: SelectedProduct[],
  notes: Note[],
): PostSubscriptionRequest | undefined {
  if (currentSubscriptionOffer === undefined) {
    return
  }
  const { offerId } = currentSubscriptionOffer
  const productConfigurations = selectedProducts.map(
    ({ productConfigurationId }) => productConfigurationId,
  )
  const collaboratorsIds = collaborators.map(({ id }) => id)
  const clientsIds = clients?.map(({ contactId }) => contactId) ?? []
  const contacts = [...clientsIds, ...collaboratorsIds]

  return {
    accountId,
    offerId,
    productConfigurations,
    contacts,
    applicant: userEmail ?? '',
    notes,
  }
}

export const getFirstDayOfYear = () => {
  const firstDayOfYear = new Date(new Date().getFullYear(), 0, 1).toISOString()
  return firstDayOfYear
}
