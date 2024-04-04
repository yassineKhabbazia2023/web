import { commonApi } from '@kpmg/common'
import { handleRequestError } from '@/helper'
import type {
  SubscriptionRequest,
  PostSubscriptionRequest,
} from '.'

export async function fetchSubscriptionRequests(): Promise<SubscriptionRequest[]|undefined> {
  try {
    const response = await commonApi().offer.get('subscription?status=pending')

    return response.data
  } catch (error) {
    handleRequestError('fetching subscriptions', error)
  }
}

export async function validateSubscriptionRequest(subscriptionId: string): Promise<void> {
  try {
    await commonApi().offer.put(`subscription/${subscriptionId}`)
  } catch (error) {
    handleRequestError('validating subscription', error)
  }
}

export async function createSubscriptionRequest(request: PostSubscriptionRequest) {
  try {
    const response = await commonApi().offer.post('subscription', request)

    return response.data
  } catch (error) {
    handleRequestError('creating subscription', error)
  }
}
