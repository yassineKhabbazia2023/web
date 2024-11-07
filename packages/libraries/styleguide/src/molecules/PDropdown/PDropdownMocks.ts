import type { PDropdownOption } from './PDropdownTypes'

export function getMockedDropdownOptions(
  hasGroups: boolean,
): PDropdownOption[] {
  const altGroup = hasGroups ? 'women' : ''
  return [{
    pValue: 'a',
    pLabel: 'John',
    pDisabled: false,
  }, {
    pValue: 'b',
    pLabel: 'Maria',
    pDisabled: false,
    pGroupLabel: altGroup,
  }, {
    pValue: 'c',
    pLabel: 'Paul',
    pDisabled: false,
    pGroupLabel: '',
  }, {
    pValue: 'd',
    pLabel: 'Helen',
    pDisabled: true,
    pGroupLabel: altGroup,
  }]
}
