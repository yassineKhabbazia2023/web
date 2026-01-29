import { commonApi as api } from '@pulse/common'
import { API_PREFIXES } from '@pulse/common/constants'
import type { DigitalSafeCustomer } from '@entities/modules/entity/types'
import type { PaginationResponse } from '@pulse/common/types'

export class InvoicesService {

  static async getAvailableCustomersForDigitalSafe(entityId: number): Promise<DigitalSafeCustomer[]> {
    const url = `${API_PREFIXES.INVOICES}/accounts/${entityId}/customers`
    const { data } = await api().gateway.get<PaginationResponse<DigitalSafeCustomer>>(url)

    return data.items
  }
}
