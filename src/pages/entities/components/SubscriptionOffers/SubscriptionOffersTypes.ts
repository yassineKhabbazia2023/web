export interface SubscriptionOfferProduct {
  productName: string
  productLabel: string
  isOptionnal: boolean
  priceType?: string
  price?: number
  globalProductConfigurationId: string
}

export interface SubscriptionOfferProvider {
  providerName: string
  providerEditor: string
  providerCategory: string
  logoName: string
  products?: SubscriptionOfferProduct[]
}

export interface SubscriptionOffer {
  globalOfferId: string
  offerName: string
  offerLabel: string
  logoName: string
  offerPrice?: number
  providers?: SubscriptionOfferProvider[]
  approvalRequired: boolean
}

export interface SubscriptionOffersProps {
  subscriptionOffers: SubscriptionOffer[],
}
