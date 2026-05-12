import { api } from '@pulse/common/api'
import { handleRequestError } from '@entities/helpers'
import type {
  PostSubscriptionRequest,
  SubscriptionRequest,
  SubscriptionDetails,
  SubscriptionStats,
  FetchSubscriptionRequestsParams,
} from './subscriptionTypes'
import type { PaginationResponse } from '@pulse/common/types'
import { API_PREFIXES } from '@pulse/common/constants'

const EMPTY_PAGINATION_RESPONSE: PaginationResponse<SubscriptionRequest> = {
  items: [],
  currentPage: 1,
  totalItems: 0,
  totalPages: 0,
}

export async function fetchSubscriptionRequests(
  params: FetchSubscriptionRequestsParams = {},
): Promise<PaginationResponse<SubscriptionRequest>> {
  try {
    const searchParams = new URLSearchParams()
    params.statusCodes?.forEach(code => searchParams.append('status', code))
    if (params.offerCodes?.length === 0) {
      searchParams.append('offerCode', 'null')
    } else {
      params.offerCodes?.forEach(code => searchParams.append('offerCode', code))
    }

    if (params.page !== undefined) {
      searchParams.append('page', String(params.page))
    }
    if (params.pageSize !== undefined) {
      searchParams.append('pageSize', String(params.pageSize))
    }
    if (params.sortField !== undefined) {
      searchParams.append('sorting.field', params.sortField)
    }
    if (params.sortDescending !== undefined) {
      searchParams.append('sorting.descending', String(params.sortDescending))
    }
    if (params.search !== undefined && params.search !== '') {
      searchParams.append('search', params.search)
    }

    const response = await api.gateway.get<PaginationResponse<SubscriptionRequest>>(
      `${API_PREFIXES.OFFER}/subscription`,
      { params: searchParams },
    )

    return response.data
  } catch (error) {
    handleRequestError('fetching subscriptions', error)
  }

  return EMPTY_PAGINATION_RESPONSE
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
    throw error
  }
}

export async function fetchAccountSubscriptions(
  accountId: number,
): Promise<SubscriptionRequest[]> {
  const response = await api.gateway.get<PaginationResponse<SubscriptionRequest>>(
    `${API_PREFIXES.OFFER}/subscription?accountId=${accountId}`,
  )

  return response.data.items
}

export async function fetchSubscriptionDetails(
  subscriptionId: number,
): Promise<SubscriptionDetails | undefined> {
  const response = await api.gateway.get(
    `${API_PREFIXES.OFFER}/subscription/${subscriptionId}`,
  )

  return response.data
}

export async function fetchSubscriptionStats(offerCodes?: string[], search?: string): Promise<SubscriptionStats> {
  try {
    const statsParams = new URLSearchParams()

    if (offerCodes?.length === 0) {
      statsParams.append('offerCode', 'null')
    } else {
      offerCodes?.forEach(code => statsParams.append('offerCode', code))
    }

    if (search !== undefined && search !== '') {
      statsParams.append('search', search)
    }

    const response = await api.gateway.get(
      `${API_PREFIXES.OFFER}/subscription/stats`,
      { params: statsParams },
    )

    return response.data
  } catch (error) {
    handleRequestError('fetching subscription stats', error)
    return { statuses: {} }
  }
}
