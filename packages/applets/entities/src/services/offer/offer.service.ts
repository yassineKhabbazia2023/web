import { commonApi } from '@pulse/common'
import type {
  SubscriptionOffer,
  SubscriptionOfferServices,
} from '@entities/types'
import { VITE_CONFIG_OFFERS_BOOK } from 'env-vars'
import { API_PREFIXES } from '@pulse/common/constants'
import { handleRequestError } from '@entities/helper/helper'

export const getAllOffers = async (): Promise<SubscriptionOffer[]> => {
  try {
    const response = await commonApi().gateway.get(`${API_PREFIXES.OFFER}/offers`)

    if (response?.data?.length > 0) {
      return response.data
    }
  } catch (error) {
    handleRequestError('fetching offers', error)
  }

  return []
}

export const getOffer = async (
  offerId: number,
): Promise<SubscriptionOfferServices | undefined> => {
  try {
    const response = await commonApi().gateway.get(`${API_PREFIXES.OFFER}/offers/${offerId}`)

    return response.data
  } catch (error) {
    handleRequestError(`fetching offer ${offerId}`, error)
  }
}

export const getOffersBookLink = (): string | undefined => {
  return VITE_CONFIG_OFFERS_BOOK
}
