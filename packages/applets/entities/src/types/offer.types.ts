import type { ProviderName } from '@entities/enums'
import type { PImageProps } from '@pulse/styleguide/types'
import { SubscriptionPriceType } from '@entities/enums'

export interface SelectedProduct {
  offerId: number
  productConfigurationId: number
  isMandatory?: boolean
}

export { SubscriptionPriceType }

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

export interface OfferPlanPricing {
  planPricingId: number
  price: number
  priceType: string
  label: string
  isSelected?: boolean
}

export interface OfferPlan {
  planId: number
  planCode: string
  planName: string
  isDefault: boolean
  isSelected?: boolean
  pricings?: OfferPlanPricing[]
}

export interface SubscriptionOfferServices extends SubscriptionOffer {
  offerDescription?: string
  offersBookLink?: string
  approvalRequired?: boolean
  intranetLink?: string
  providers: SubscriptionOfferProvider[]
  functions: CollaboratorRole[]
  plans?: OfferPlan[]
}
