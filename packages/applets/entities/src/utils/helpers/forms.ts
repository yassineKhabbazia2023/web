import type { PDropdownOption } from '@pulse/styleguide/types'

export const validPhoneNumberPattern = /^(\d{10}|\d{2} \d{2} \d{2} \d{2} \d{2})$/

export function convertRecordToDropdownOptions(options: Record<string, string>): PDropdownOption[] {
  return Object
    .entries(options)
    .map(([value, label]) => ({ pValue: value, pLabel: label }))
}
