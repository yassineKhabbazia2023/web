import { commonApi } from '@kpmg/common'

import type { SubscriptionDemand, SubscriptionRequest } from './SubscriptionsTypes'

function handleRequestError(action: string, error: any) {
  console!.error(`Error ${action}:`, error)
}

export async function fetchSubscriptionRequests(): Promise<SubscriptionRequest[]|undefined> {
  try {
    const response = await commonApi().subscription.get('subscription?status=pending')

    return response.data
  } catch (error) {
    handleRequestError('fetching subscriptions', error)
  }
}

export async function validateSubscriptionRequest(subscriptionId: string): Promise<void> {
  try {
    await commonApi().subscription.put(`subscription?subscriptionId=${subscriptionId}`)
  } catch (error) {
    handleRequestError('validating subscription', error)
  }
}

export async function createSubscriptionRequest(request: SubscriptionDemand) {
  try {
    const response = await commonApi().subscription.post('subscription', request)
    if (response?.data > 0) {
      return response.data
    }
  } catch (error) {
    handleRequestError('validating subscription', error)
  }
}
