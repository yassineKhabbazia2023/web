import type { PDropdownOption } from '@pulse/styleguide/types'
import type { DigitalSafeCustomer } from '@entities/modules/entity/types'
import { InvoicesService } from '@entities/modules/entity/services/invoices.service'
import type { FetchCustomersResult } from './invoices-second-step.form.types'

export class InvoicesSecondStepFormManager {
  static mapCustomerToOption(customer: DigitalSafeCustomer): PDropdownOption {
    const customerDetailsLine = `${customer.firstName} ${customer.lastName} - ${customer.email}`.trim()
    return {
      pValue: customer.contactId,
      pLabel: customerDetailsLine,
      pDescription: customer.email,
    }
  }

  static async fetchCustomerOptions(entityId: number): Promise<FetchCustomersResult> {
    try {
      const customers = await InvoicesService.getAvailableCustomersForDigitalSafe(entityId)
      const options = customers.map(InvoicesSecondStepFormManager.mapCustomerToOption)
      return { success: true, options }
    } catch {
      return { success: false, options: [] }
    }
  }
}
