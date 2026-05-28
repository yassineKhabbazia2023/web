import type { PDropdownOption } from '@pulse/styleguide/types'

export interface InvoicesSecondStepFormModel {
  selectedContactId: string | null
}

export interface FetchCustomersResult {
  success: boolean
  options: PDropdownOption[]
}
