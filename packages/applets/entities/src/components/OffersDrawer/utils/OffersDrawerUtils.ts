import { SubscriptionPriceType } from '@entities/enums'
import type { SelectedProduct, SubscriptionOfferServices, ClientContact } from '@entities/types'
import type { ContactFunction, Note, PostSubscriptionRequest } from '@entities/services/subscription/subscriptionTypes'
import type { ContactWithRoles } from '@entities/modules/entity/components/ManageCollaborators/ManageCollaboratorsTypes'

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
  userEmail: string | undefined
  collaboratorsWithRoles: ContactWithRoles[]
  clients: ClientContact[] | undefined
  currentSubscriptionOffer: SubscriptionOfferServices | undefined
  selectedProducts: SelectedProduct[]
  notes: Note[]
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
  userEmail,
  collaboratorsWithRoles,
  clients,
  currentSubscriptionOffer,
  selectedProducts,
  notes,
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

  return {
    accountId,
    offerId,
    productConfigurations,
    contacts,
    contactFunctions,
    applicant: userEmail ?? '',
    notes,
  }
}

export const getFirstDayOfYear = () => {
  const firstDayOfYear = new Date(new Date().getFullYear(), 0, 1).toISOString()
  return firstDayOfYear
}
