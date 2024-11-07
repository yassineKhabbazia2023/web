import type { PDropdownOption } from '@/molecules/PDropdown/PDropdownTypes'

export function getMockedOptions(): PDropdownOption[] {
  const pOptions = [{
    pValue: 'a',
    pLabel: 'Collab GS',
  }, {
    pValue: 'b',
    pLabel: 'Supervisor',
  }]

  return pOptions
}
