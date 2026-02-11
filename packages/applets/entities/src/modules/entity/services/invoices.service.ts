import { commonApi as api } from '@pulse/common'
import { API_PREFIXES } from '@pulse/common/constants'
import type { BillingSubmissionInputRequest, DigitalSafeCustomer } from '@entities/modules/entity/types'
import type { PaginationResponse } from '@pulse/common/types'
import type { DigitalSafeStatus } from '../enums/invoices.enums'

export class InvoicesService {

  static async getAvailableCustomersForDigitalSafe(entityId: number): Promise<DigitalSafeCustomer[]> {
    const url = `${API_PREFIXES.INVOICES}/accounts/${entityId}/customers`
    const { data } = await api().gateway.get<PaginationResponse<DigitalSafeCustomer>>(url)

    return data.items
  }

  static async submitIntegration(accountNumber: string, payload: BillingSubmissionInputRequest): Promise<void> {
    const url = `${API_PREFIXES.INVOICES}/accounts/${accountNumber}/hubspot/submissions/currentuser`

    await api().gateway.post(url, payload)
  }

  static async getSubscriptionStatus(accountNumber: string) {
    const url = `${API_PREFIXES.INVOICES}/accounts/${accountNumber}/hubspot/submissions/currentuser`
    const { data } = await api().gateway.get<DigitalSafeStatus>(url)

    return data
  }
}
