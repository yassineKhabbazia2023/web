import { commonApi } from '@pulse/common'
import { handleRequestError } from '@entities/helpers'
import type { SubscriptionRequest, PostSubscriptionRequest, SubscriptionDetails } from './subscriptionTypes'
import { API_PREFIXES } from '@pulse/common/constants'

export async function fetchSubscriptionRequests(): Promise<SubscriptionRequest[]> {
  try {
    const response = await commonApi().gateway.get(
      `${API_PREFIXES.OFFER}/subscription?status=pending`,
    )

    return response.data
  } catch (error) {
    handleRequestError('fetching subscriptions', error)
  }

  return []
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
      `${API_PREFIXES.OFFER}/subscription/create`,
      request,
    )

    return response.data
  } catch (error) {
    handleRequestError('creating subscription', error)
  }
}

export async function fetchAccountSubscriptions(
  accountId: number,
): Promise<SubscriptionRequest[]> {
  const response = await commonApi().gateway.get(
    `${API_PREFIXES.OFFER}/subscription?accountId=${accountId}`,
  )

  return response.data
}

export async function fetchSubscriptionDetails(
  subscriptionId: number,
): Promise<SubscriptionDetails | undefined> {
  const response = await commonApi().gateway.get(
    `${API_PREFIXES.OFFER}/subscription/${subscriptionId}`,
  )

  return response.data
}
