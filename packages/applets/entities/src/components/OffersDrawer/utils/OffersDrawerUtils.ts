import { SubscriptionPriceType } from '@entities/enums'
import type { ContactWithRoles, SelectedProduct, SubscriptionOfferServices } from '@entities/types'
import type { AccountSignatories } from '@entities/services/account/account.type'
import type { ContactFunction, Note, PostSubscriptionRequest } from '@entities/services/subscription/subscriptionTypes'

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

interface GetPostSubscriptionRequestParams {
  accountId: number
  hubName?: string
  userEmail: string | undefined
  collaboratorsWithRoles: ContactWithRoles[]
  clients: AccountSignatories[] | undefined
  currentSubscriptionOffer: SubscriptionOfferServices | undefined
  selectedProducts: SelectedProduct[]
  notes: Note[]
  selectedPlanId?: number
  selectedPricingId?: number
  hasNoSiren?: boolean
}

export function getFormattedContactFunctions(collaboratorsWithRoles: ContactWithRoles[]) {
  return collaboratorsWithRoles
    .flatMap(({ contactId, roleIds }) => roleIds
      .map<ContactFunction>((functionId) => ({
        contactId,
        functionId,
      })))
}

export function getPostSubscriptionRequest({
  accountId,
  hubName,
  userEmail,
  collaboratorsWithRoles,
  clients,
  currentSubscriptionOffer,
  selectedProducts,
  notes,
  selectedPlanId,
  selectedPricingId,
  hasNoSiren,
}: GetPostSubscriptionRequestParams): PostSubscriptionRequest | undefined {
  if (currentSubscriptionOffer === undefined) {
    return
  }
  const { offerId, functions: collaboratorRoles } = currentSubscriptionOffer
  const productConfigurations = selectedProducts.map(
    ({ productConfigurationId }) => productConfigurationId,
  )
  const clientsIds = clients?.map(({ contactId }) => contactId) ?? []
  const ids = collaboratorsWithRoles.map(({ contactId }) => contactId)
  const contacts = [...clientsIds, ...ids]

  const hasCollaboratorRoles = collaboratorRoles?.length > 0
  const contactFunctions = hasCollaboratorRoles
    ? getFormattedContactFunctions(collaboratorsWithRoles)
    : undefined

  const request: PostSubscriptionRequest = {
    accountId,
    offerId,
    productConfigurations,
    contacts,
    contactFunctions,
    applicant: userEmail ?? '',
    notes,
    planId: selectedPlanId,
    planPricingId: selectedPricingId,
    hubName: hubName,
    hasNoSiren,
  }

  return request
}

export const getFirstDayOfYear = () => {
  const firstDayOfYear = new Date(new Date().getFullYear(), 0, 1).toISOString()
  return firstDayOfYear
}
