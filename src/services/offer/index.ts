import { commonApi } from '@kpmg/common'
import type
{ SubscriptionOffer } from '@/pages/entities/components/SubscriptionOffers/SubscriptionOffersTypes'

export const getAllOffers = async (): Promise<SubscriptionOffer[]> => {
  try {
    const response = await commonApi().offer.get('offers')

    if (response?.data?.length > 0) {
      return response.data
    }
  } catch (error) {
    console!.error(error)
  }

  return []
}
