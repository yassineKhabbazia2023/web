import { api } from '@pulse/common/api'
import { API_PREFIXES } from '@pulse/common/constants'
import { INVOICE_FILE_MIME_TYPE } from './seres-invoices.consts'
import { buildInvoicesSearchParams } from './seres-invoices.utils'
import type { SeresInvoicesResponse, SeresInvoicesSearchCriteria } from './seres-invoices.types'

export class SeresInvoicesService {

  static async fetchInvoices(accountId: number, criteria: SeresInvoicesSearchCriteria): Promise<SeresInvoicesResponse> {
    const url = `${API_PREFIXES.ACCOUNT}/invoices/accounts/${accountId}`
    const params = buildInvoicesSearchParams(criteria)

    const { data } = await api.gateway.get<SeresInvoicesResponse | null>(url, { params })

    // A search without any match answers with an empty body: normalize it into an empty page.
    return {
      items: data?.items ?? [],
      totalItems: data?.totalItems ?? 0,
    }
  }

  static async fetchInvoiceContent(invoiceNumber: string, accountNumber: string): Promise<Blob> {
    const url = `${API_PREFIXES.REGISTRY}/invoices/${invoiceNumber}/accounts/${accountNumber}/content`
    const { data } = await api.gateway.get<Blob>(url, { responseType: 'blob' })

    // Rebuilt as a PDF: the response content type is too generic for the browser viewer to pick it up.
    return new Blob([data], { type: INVOICE_FILE_MIME_TYPE })
  }
}
