import { api } from '@pulse/common/api'
import { AxiosError } from 'axios'

import { API_PREFIXES } from '../../constants/api-prefixes'
import type {
  DematAccountApiResponse,
  DematAccountResponse,
  DematMailSubmissionRequest,
} from './invoices.types'

export class InvoicesService {
  static async fetchDematAccount(accountId: number): Promise<DematAccountResponse> {
    const url = `${API_PREFIXES.DEMAT}/accounts/${accountId}/currentuser`
    const { data } = await api.gateway.get<DematAccountApiResponse>(url)

    return {
      accountId: data.accountId,
      dematMail: data.email ?? null,
      routingCode: data.accountRoutingCode ?? null,
      modalClosedAt: data.modalClosedAt ?? null,
    }
  }

  static async submitDematMail(accountId: number, payload: DematMailSubmissionRequest): Promise<void> {
    const url = `${API_PREFIXES.DEMAT}/accounts/${accountId}/hubspot/submissions/currentuser`

    await api.gateway.post(url, payload)
  }

  // Persists that this account's demat mail dialog was closed by the requesting contact (the
  // gateway resolves who via the CurrentUser header), so it does not auto-open again for them.
  // Other contacts with access to the same account are unaffected and keep seeing it.
  static async closeDematModal(accountId: number): Promise<void> {
    const url = `${API_PREFIXES.DEMAT}/accounts/${accountId}/demat-ready/closure`

    await api.gateway.post(url)
  }

  // 200 means a submission successfully dispatched to HubSpot exists for this account; 404
  // covers both "no submission at all" and "a submission row exists but the dispatch failed",
  // so a 404 here must keep soliciting the client, same as no submission at all.
  static async hasHubspotSubmission(accountId: number): Promise<boolean> {
    const url = `${API_PREFIXES.REGISTRY}/accounts/${accountId}/hubspot/submissions`

    try {
      await api.gateway.get(url)
      return true
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        return false
      }

      throw error
    }
  }
}
