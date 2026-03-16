import { api } from '@pulse/common/api'
import { handleRequestError } from '@entities/helpers'
import type {
  SubscriptionRequest,
  PostSubscriptionRequest,
  SubscriptionDetails,
  SubscriptionStats,
  SubscriptionStatusCode,
} from './subscriptionTypes'
import { API_PREFIXES } from '@pulse/common/constants'

export async function fetchSubscriptionRequests(
  statusCodes?: SubscriptionStatusCode[],
): Promise<SubscriptionRequest[]> {
  try {
    const params = new URLSearchParams()
    statusCodes?.forEach(code => params.append('status', code))

    const response = await api.gateway.get(
      `${API_PREFIXES.OFFER}/subscription`,
      { params },
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
    await api.gateway.put(
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
    const response = await api.gateway.post(
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
  const response = await api.gateway.get(
    `${API_PREFIXES.OFFER}/subscription?accountId=${accountId}`,
  )

  return response.data
}

export async function fetchSubscriptionDetails(
  subscriptionId: number,
): Promise<SubscriptionDetails | undefined> {
  const response = await api.gateway.get(
    `${API_PREFIXES.OFFER}/subscription/${subscriptionId}`,
  )

  return response.data
}

export async function fetchSubscriptionStats(): Promise<SubscriptionStats> {
  try {
    const response = await api.gateway.get(
      `${API_PREFIXES.OFFER}/subscription/stats`,
    )

    return response.data
  } catch (error) {
    handleRequestError('fetching subscription stats', error)
    return { statuses: {} }
  }
}
