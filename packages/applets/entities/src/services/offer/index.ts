import { commonApi } from '@pulse/common'
import type {
  SubscriptionOffer,
  SubscriptionOfferServices,
} from '@entities/pages/entities/components/SubscriptionOffers/SubscriptionOffersTypes'
import type { ClientContact } from '@entities/pages/entities/components/PrincipalContact/PrincipalContactTypes'
import { VITE_CONFIG_OFFERS_BOOK } from 'env-vars'
import { API_PREFIXES } from '@entities/common/config/services'
import { handleRequestError } from '@entities/helper/helper'
import type { Contact } from '../contact/contactTypes'

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

export const getPrincipalContacts = async (accountId: number): Promise<ClientContact[]> => {
  try {
    const response = await commonApi().gateway.get(`${API_PREFIXES.ACCOUNT}/roles/signatory`, {
      params: {
        accountId,
      },
    })

    return response?.data
  } catch (error) {
    handleRequestError('fetching principal contact', error)
  }

  return []
}

export const fetchCollaborators = async (
  search: string | null = null,
  pageSize?: number,
): Promise<Contact[] | undefined> => {
  try {
    const response = await commonApi().gateway.get(
      `${API_PREFIXES.OFFER}/contacts`,
      {
        params: {
          Type: 'Collaborator',
          search,
          pageSize,
        },
      },
    )

    return response?.data?.items
  } catch (error) {
    handleRequestError('fetching contacts', error)
  }
}

export const getOffersBookLink = (): string | undefined => {
  return VITE_CONFIG_OFFERS_BOOK
}
