import type { ProviderName } from '@entities/common/types/ProviderNameEnums'
import type { SubscriptionPriceType } from './SubscriptionOffersEnums'
import type { PImageProps } from '@pulse/styleguide/types'

export interface SubscriptionOfferProduct {
  productName: string
  productConfigurationId: number
  productLabel: string
  enabled: boolean
  isOptionnal: boolean
  isSelected?: boolean
  priceType: SubscriptionPriceType
  price: number
}

export interface SubscriptionOfferProvider {
  providerName: ProviderName
  providerEditor: string
  providerCategory: string
  logoName: PImageProps['pName']
  products: SubscriptionOfferProduct[]
}

export interface SubscriptionOffer {
  offerId: number
  offerName: string
  offerCode: string
  offerLabel: string
  offerPrice: number
  offerPriceType: string
  logoName: PImageProps['pName']
}

export interface CollaboratorRole {
  functionId: number
  functionName: string
}

export interface SubscriptionOfferServices extends SubscriptionOffer {
  offerDescription?: string
  offersBookLink?: string
  approvalRequired?: boolean
  intranetLink?: string
  providers: SubscriptionOfferProvider[]
  functions: CollaboratorRole[]
}

export interface SubscriptionOffersProps {
  subscriptionOffers: SubscriptionOffer[]
  activeOffers: string[]
}
