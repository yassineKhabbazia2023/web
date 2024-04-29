import type { SubscriptionPriceType } from './SubscriptionOffersEnums'

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
  providerName: string
  providerEditor: string
  providerCategory: string
  logoName: string
  products: SubscriptionOfferProduct[]
}

export interface SubscriptionOffer {
  offerId: number
  offerName: string
  offerLabel: string
  offerPrice: number
  offerPriceType: string
  logoName: string
}

export interface SubscriptionOfferServices extends SubscriptionOffer {
  offerDescription?: string
  offersBookLink?: string
  approvalRequired?: boolean
  intranetLink?: string
  providers: SubscriptionOfferProvider[]
}

export interface SubscriptionOffersProps {
  subscriptionOffers: SubscriptionOffer[]
}
