import { commonApi } from '@kpmg/common'
import { handleRequestError } from '@/helper'
import { API_PREFIXES } from '../config'
import type { SubscriptionRequest, PostSubscriptionRequest } from '.'

export async function fetchSubscriptionRequests(): Promise<SubscriptionRequest[] | undefined> {
  try {
    const response = await commonApi().gateway.get(
      `${API_PREFIXES.OFFER}/subscription?status=pending`,
    )

    return response.data
  } catch (error) {
    handleRequestError('fetching subscriptions', error)
  }
}

export async function validateSubscriptionRequest(
  subscriptionId: number,
  validator: string | undefined,
): Promise<void> {
  try {
    await commonApi().gateway.put(
      `${API_PREFIXES.OFFER}/subscription/${subscriptionId}?validator=${validator}`,
    )
  } catch (error) {
    handleRequestError('validating subscription', error)
  }
}

export async function createSubscriptionRequest(
  request: PostSubscriptionRequest,
) {
  try {
    const response = await commonApi().gateway.post(
      `${API_PREFIXES.OFFER}/subscription`,
      request,
    )

    return response.data
  } catch (error) {
    handleRequestError('creating subscription', error)
  }
}
