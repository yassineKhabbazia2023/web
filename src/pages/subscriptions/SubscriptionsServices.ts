import { commonApi } from '@kpmg/common'

import type { SubscriptionDemand, SubscriptionRequest, PostSubscriptionRequest } from './SubscriptionsTypes'

function handleRequestError(action: string, error: any) {
  console!.error(`Error ${action}:`, error)
}

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

export async function createSubscriptionRequest(request: SubscriptionDemand) {
  try {
    const response = await commonApi().offer.post('subscription', request)
    if (response?.data > 0) {
      return response.data
    }
  } catch (error) {
    handleRequestError('validating subscription', error)
  }
}

export async function createSubscriptionRequestNew(request: PostSubscriptionRequest) {
  try {
    const response = await commonApi().offer.post('subscription', request)
    if (response?.data > 0) {
      return response.data
    }
  } catch (error) {
    handleRequestError('validating subscription', error)
  }
}
