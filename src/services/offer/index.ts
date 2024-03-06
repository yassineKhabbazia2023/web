import { commonApi } from '@kpmg/common'
import type {
  SubscriptionOffer,
  SubscriptionOfferServices
} from '@/pages/entities/components/SubscriptionOffers/SubscriptionOffersTypes'
import type { User } from '@/pages/entities/components/PrincipalContact/PrincipalContactTypes'
import { ACCOUNT_ID } from '@/pages/entities/components/OffersDrawer/OffersDrawerConst'
import { VITE_CONFIG_OFFERS_BOOK } from 'env-vars'
import { API_PREFIXES } from '../config'
import { handleRequestError } from '@/helper/helper'

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
  offerId: number
): Promise<SubscriptionOfferServices | undefined> => {
  try {
    const response = await commonApi().gateway.get(`${API_PREFIXES.OFFER}/offers/${offerId}`)

    return response.data
  } catch (error) {
    handleRequestError(`fetching offer ${offerId}`, error)
  }
}

export const getPrincipalContacts = async (): Promise<User[] | undefined> => {
  try {
    const response = await commonApi().gateway.get(`${API_PREFIXES.ACCOUNT}/roles/signatory/${ACCOUNT_ID}`)

    return response?.data
  } catch (error) {
    handleRequestError('fetching principal contact', error)
  }
}

export const getOffersBookLink = (): string | undefined => {
  return VITE_CONFIG_OFFERS_BOOK
}
