import { commonApi } from '@pulse/common'
import { AxiosError } from 'axios'

import { API_PREFIXES } from '../../constants/api-prefixes'
import type { InvoicesAccessApiResponse, InvoicesAccessResponse } from './invoices-access.service.types'

export class InvoicesAccessService {
  static async fetchInvoicesAccess(accountId: number): Promise<InvoicesAccessResponse | null> {
    const url = `${API_PREFIXES.INVOICES}/accounts/${accountId}/currentuser`

    try {
      const { data } = await commonApi().gateway.get<InvoicesAccessApiResponse>(url)


      return {
        tabState: data['tab-state'],
        contactWithAccess: data.contactWithAccess,
        externalDematMail: data.externalDematMail,
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        return null
      }

      throw error
    }
  }
}
