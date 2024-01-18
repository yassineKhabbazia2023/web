import { commonApi } from '@kpmg/common'
import type {
  SubscriptionOffer,
  SubscriptionOfferServices
} from '@/pages/entities/components/SubscriptionOffers/SubscriptionOffersTypes'
import type { User } from '@/pages/entities/components/PrincipalContact/PrincipalContactTypes'
import { getMockedPrincipalContact } from '@/pages/entities/components/PrincipalContact/PrincipalContactMocks'
import { VITE_CONFIG_OFFERS_BOOK } from 'env-vars'
import { handleRequestError } from '@/helper/helper'

export const getAllOffers = async (): Promise<SubscriptionOffer[]> => {
  try {
    const response = await commonApi().offer.get('offers')

    if (response?.data?.length > 0) {
      return response.data
    }
  } catch (error) {
    handleRequestError('fetching offers', error)
  }

  return []
}

export const getOffer = async (
  offerId: number
): Promise<SubscriptionOfferServices | undefined> => {
  try {
    const response = await commonApi().offer.get(`offers/${offerId}`)
    if (response.data) {
      return response.data
    }
  } catch (error) {
    handleRequestError(`fetching offer ${offerId}`, error)
  }
}

export const getPrincipalContact = async (): Promise<User | undefined> => {
  try {
    return Promise.resolve(getMockedPrincipalContact())
  } catch (error) {
    handleRequestError('fetching principal contact', error)
  }
}

export const getOffersBookLink = (): string | undefined => {
  return VITE_CONFIG_OFFERS_BOOK
}
