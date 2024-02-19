import { SubscriptionPriceType } from '@/pages/entities/components/SubscriptionOffers/SubscriptionOffersEnums'
import type { SelectedProduct } from '../OffersDrawerTypes'
import type { SubscriptionOfferServices } from '../../SubscriptionOffers/SubscriptionOffersTypes'
import type { PostSubscriptionRequest } from '@/pages/subscriptions/SubscriptionsTypes'
import type { Account } from '@/services/account'

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
  const productConfigurations = selectedProducts.map(
    ({ productConfigurationId }) => productConfigurationId
  )

  return {
    accountId,
    offerId,
    productConfigurations,
    contacts: [principalContact],
    applicant: userEmail ?? '',
    notes: []
  }
}

export const getFirstDayOfYear = () => {
  const firstDayOfYear = new Date(new Date().getFullYear(), 0, 1).toISOString()
  return firstDayOfYear
}

// For now, there's no need to translate the text
export const getMappedAPIData = (account: Account) => ({
  'legal.siret': account?.legal?.siret ?? 'Non modifiable',
  'legal.legalForm': account?.legal?.legalForm ?? 'Non modifiable',
  'legal.naf.nafCode': account?.legal?.naf?.at(0)?.nafCode ?? 'Non modifiable',
  'legal.staffSizeRange': account?.legal?.staffSizeRange ?? '',
  'hub.hubName': account?.hub?.hubName ?? '',
  'accounting.fiscalExerciseStartDate':
    account?.accounting?.fiscalExerciseStartDate ?? getFirstDayOfYear(),
  'accounting.fiscalExerciseDuration':
    account?.accounting?.fiscalExerciseDuration ?? 12,
  'accounting.accountingType':
    account?.accounting?.accountingType ?? 'Engagement',
  'accounting.activityType':
    account?.accounting?.activityType ?? 'Prestation de services',
  'accounting.fiscalSystem': account?.accounting?.fiscalSystem ?? 'BIC',
  'accounting.taxationSystem':
    account?.accounting?.taxationSystem ?? 'Impôt sur le revenu',
  'vat.system': account?.vat?.system ?? 'Réel normal - CA3 mensuelle',
  'vat.intra': account?.vat?.intra ?? 'Non modifiable',
  'vat.type': account?.vat?.type ?? 'Encaissement',
  'address.addressLine1':
    account?.address?.at(0)?.addressLine1 ?? 'Non modifiable',
  'address.addressLine2':
    account?.address?.at(0)?.addressLine2 ?? 'Non modifiable',
  'address.zipCode': account?.address?.at(0)?.zipCode ?? 'Non modifiable',
  'address.city': account?.address?.at(0)?.city ?? 'Non modifiable',
  'address.country': account?.address?.at(0)?.country ?? 'Non modifiable',
  email: account?.email ?? 'Non modifiable',
  'phone.phoneNumber': account?.phone?.at(0)?.phoneNumber ?? 'Non modifiable'
})
