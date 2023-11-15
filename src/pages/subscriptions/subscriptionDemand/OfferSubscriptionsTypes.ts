interface Product {
  productName: string
  productLabel: string
  isOptionnal: boolean
  priceType?: string
  price?: number
  globalProductConfigurationId: string
}

interface Provider {
  providerName: string
  providerEditor: string
  providerCategory: string
  logoName: string
  products?: Product[]
}

export interface OfferSubscription {
  globalOfferId: string
  offerName: string
  offerLabel: string
  logoName: string
  offerPrice?: number
  providers?: Provider[]
  approvalRequired: boolean
}
